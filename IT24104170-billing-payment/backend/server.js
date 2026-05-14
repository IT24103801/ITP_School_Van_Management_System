require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/Billing');
require('./models/PaymentReminder');
const BillingRule = require('./models/BillingRule');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/billing-rules', require('./routes/billingRuleRoutes'));
app.use('/api/payment-reminders', require('./routes/paymentReminderRoutes'));

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    const n = await BillingRule.count();
    if (n === 0) {
      await BillingRule.create({
        name: 'Below 50% attendance → 50% fee',
        minAttendancePercent: 50,
        feeMultiplier: 0.5,
        isActive: true,
      });
    }
    console.log('Database tables synchronized');
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
  });

const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Billing & Payment Backend running on port ${PORT}`);
});
