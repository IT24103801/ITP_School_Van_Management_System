const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const BillingRule = require('../models/BillingRule');

function mapQueryStatusToEnum(s) {
  if (!s) return undefined;
  const k = String(s).toLowerCase();
  if (k === 'paid') return 'Paid';
  if (k === 'pending') return 'Pending';
  if (k === 'overdue') return 'Overdue';
  if (k === 'cancelled') return 'Cancelled';
  return s;
}

function mapBodyStatusToEnum(s) {
  return mapQueryStatusToEnum(s);
}

/** API responses include camelCase (DB) plus snake_case aliases for older clients */
function formatBillingRow(row) {
  const j = row.toJSON ? row.toJSON() : { ...row };
  const statusLower = (j.status || 'Pending').toString().toLowerCase();
  return {
    ...j,
    payment_status: statusLower,
    parent_id: j.parentId,
    student_id: j.studentId,
    amount: j.calculatedFee != null ? Number(j.calculatedFee) : null,
    base_fee: j.baseFee != null ? Number(j.baseFee) : null,
    due_date: j.dueDate,
    paid_date: j.paidDate,
    billing_period:
      j.month && j.year != null ? `${j.month} ${j.year}` : j.billing_period || null,
    attendance_percentage:
      j.attendancePercentage != null ? Number(j.attendancePercentage) : null,
  };
}

function normalizeCreateBody(body) {
  const parentId = body.parentId ?? body.parent_id;
  const studentId = body.studentId ?? body.student_id ?? 1;
  let calculatedFee = body.calculatedFee ?? body.amount;
  const baseFee = body.baseFee ?? calculatedFee;
  const dueDateRaw = body.dueDate ?? body.due_date;
  const period = body.billing_period ?? body.billingPeriod ?? '';
  let month = body.month;
  let year = body.year;
  if ((!month || !year) && typeof period === 'string' && period.trim()) {
    const parts = period.trim().split(/\s+/);
    month = month || parts[0];
    year = year != null ? year : parts[1] ? parseInt(parts[1], 10) : undefined;
  }
  if (!month) month = new Date().toLocaleString('en-US', { month: 'long' });
  if (year == null || Number.isNaN(year)) year = new Date().getFullYear();

  const attendancePercentage =
    body.attendancePercentage ?? body.attendance_percentage ?? null;

  const status = mapBodyStatusToEnum(body.payment_status ?? body.status) || 'Pending';

  if (calculatedFee == null || calculatedFee === '') {
    calculatedFee = baseFee;
  }

  const billId =
    body.billId ||
    body.bill_id ||
    `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    billId,
    studentId: Number(studentId),
    parentId: Number(parentId),
    month: String(month),
    year: Number(year),
    baseFee: Number(baseFee),
    attendancePercentage:
      attendancePercentage != null ? Number(attendancePercentage) : null,
    calculatedFee: Number(calculatedFee),
    status,
    dueDate: dueDateRaw ? new Date(dueDateRaw) : new Date(),
    paidDate: (() => {
      if (body.paidDate || body.paid_date) {
        return new Date(body.paidDate || body.paid_date);
      }
      if (status === 'Paid') return new Date();
      return null;
    })(),
    invoiceSent: body.invoiceSent ?? body.invoice_sent ?? false,
  };
}

router.get('/', async (req, res) => {
  try {
    const paymentStatus = req.query.payment_status || req.query.status;
    const where = {};
    const mapped = mapQueryStatusToEnum(paymentStatus);
    if (mapped) where.status = mapped;

    const billings = await Billing.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: billings.map(formatBillingRow) });
  } catch (error) {
    console.error('Error fetching billings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalRevenue =
      (await Billing.sum('calculatedFee', {
        where: { status: 'Paid' },
      })) || 0;

    const paidBills = await Billing.count({ where: { status: 'Paid' } });
    const pendingBills = await Billing.count({ where: { status: 'Pending' } });
    const overdue = await Billing.sum('calculatedFee', {
      where: { status: 'Overdue' },
    });

    res.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue) || 0,
        paidBills,
        pendingBills,
        overdue: Number(overdue) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/** Attendance-based preview using active billing rules (first matching rule wins). */
router.post('/compute-fee', async (req, res) => {
  try {
    const baseFee = Number(req.body.baseFee ?? req.body.base_fee ?? 0);
    const attendancePercent = Number(
      req.body.attendancePercentage ?? req.body.attendance_percent ?? 100
    );
    const routeDistanceKm = Number(req.body.routeDistanceKm ?? req.body.route_distance_km ?? 0);

    const rules = await BillingRule.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']],
    });

    let multiplier = 1;
    let appliedRule = null;
    for (const rule of rules) {
      if (attendancePercent < Number(rule.minAttendancePercent)) {
        multiplier = Number(rule.feeMultiplier);
        appliedRule = rule;
        break;
      }
    }

    let calculatedFee = Math.round(baseFee * multiplier * 100) / 100;
    if (routeDistanceKm > 0 && req.body.perKmRate != null) {
      const perKm = Number(req.body.perKmRate);
      calculatedFee = Math.round((calculatedFee + routeDistanceKm * perKm) * 100) / 100;
    }

    res.json({
      success: true,
      data: {
        baseFee,
        attendancePercent,
        routeDistanceKm,
        multiplier,
        calculatedFee,
        appliedRuleId: appliedRule ? appliedRule.id : null,
      },
    });
  } catch (error) {
    console.error('compute-fee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, error: 'Billing not found' });
    }
    res.json({ success: true, data: formatBillingRow(billing) });
  } catch (error) {
    console.error('Error fetching billing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = normalizeCreateBody(req.body);
    if (!payload.parentId || Number.isNaN(payload.parentId)) {
      return res.status(400).json({ success: false, error: 'parent_id / parentId is required' });
    }
    if (Number.isNaN(payload.calculatedFee)) {
      return res.status(400).json({ success: false, error: 'amount / calculatedFee is required' });
    }

    const billing = await Billing.create(payload);
    res.status(201).json({ success: true, data: formatBillingRow(billing) });
  } catch (error) {
    console.error('Error creating billing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, error: 'Billing not found' });
    }

    const patch = { ...req.body };
    if (patch.parent_id != null) patch.parentId = patch.parent_id;
    if (patch.student_id != null) patch.studentId = patch.student_id;
    if (patch.amount != null) patch.calculatedFee = patch.amount;
    if (patch.base_fee != null) patch.baseFee = patch.base_fee;
    if (patch.due_date != null) patch.dueDate = patch.due_date;
    if (patch.paid_date != null) patch.paidDate = patch.paid_date;
    if (patch.payment_status != null) patch.status = mapBodyStatusToEnum(patch.payment_status);
    if (patch.attendance_percentage != null) {
      patch.attendancePercentage = patch.attendance_percentage;
    }

    delete patch.parent_id;
    delete patch.student_id;
    delete patch.payment_status;
    delete patch.amount;
    delete patch.base_fee;
    delete patch.due_date;
    delete patch.paid_date;
    delete patch.attendance_percentage;
    delete patch.billing_period;

    await billing.update(patch);
    await billing.reload();
    res.json({ success: true, data: formatBillingRow(billing) });
  } catch (error) {
    console.error('Error updating billing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/send-invoice', async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, error: 'Billing not found' });
    }

    console.log(`Sending invoice for billing #${billing.id} to parent ${billing.parentId}`);

    await billing.update({ invoiceSent: true });
    res.json({ success: true, message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, error: 'Billing not found' });
    }

    await billing.destroy();
    res.json({ success: true, message: 'Billing deleted successfully' });
  } catch (error) {
    console.error('Error deleting billing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
