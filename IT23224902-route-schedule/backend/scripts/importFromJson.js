require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDatabase, mongoose } = require('../config/database');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const StopPoint = require('../models/StopPoint');
const GpsBreadcrumb = require('../models/GpsBreadcrumb');
const { Counter } = require('../models/Counter');

const sourceFile =
  process.argv[2] ||
  path.resolve(__dirname, '../../..', 'school_van_system (1).json');

function toNum(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function toBool(value) {
  if (value == null || value === '') return false;
  return String(value) === '1' || String(value).toLowerCase() === 'true';
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function replaceCollection(Model, docs) {
  await Model.deleteMany({});
  if (docs.length > 0) await Model.insertMany(docs, { ordered: false });
}

function mapRoute(row) {
  return {
    id: toNum(row.id),
    routeId: row.routeId,
    routeName: row.routeName,
    vanId: row.vanId,
    isActive: toBool(row.isActive),
    currentGPS_latitude: toNum(row.currentGPS_latitude),
    currentGPS_longitude: toNum(row.currentGPS_longitude),
    currentGPS_timestamp: toDate(row.currentGPS_timestamp),
    plannedPathJson: row.plannedPathJson || null,
    distanceKm: toNum(row.distanceKm),
    created_at: toDate(row.created_at) || new Date(),
    updated_at: toDate(row.updated_at) || new Date(),
  };
}

function mapSchedule(row) {
  return {
    id: toNum(row.id),
    routeId: toNum(row.routeId),
    vanId: row.vanId,
    session: row.session,
    departureTime: row.departureTime,
    arrivalTime: row.arrivalTime,
    isActive: toBool(row.isActive),
    specialNotes: row.specialNotes || '',
    created_at: toDate(row.created_at) || new Date(),
    updated_at: toDate(row.updated_at) || new Date(),
  };
}

function mapStop(row) {
  return {
    id: toNum(row.id),
    routeDbId: toNum(row.route_db_id),
    sequenceOrder: toNum(row.sequence_order),
    latitude: toNum(row.latitude),
    longitude: toNum(row.longitude),
    stopType: row.stop_type || 'both',
    label: row.label || null,
    assignedStudentIdsJson: row.assigned_student_ids_json || '[]',
    created_at: toDate(row.created_at) || new Date(),
    updated_at: toDate(row.updated_at) || new Date(),
  };
}

function mapBreadcrumb(row) {
  return {
    id: toNum(row.id),
    routeDbId: toNum(row.route_db_id),
    latitude: toNum(row.latitude),
    longitude: toNum(row.longitude),
    recordedAt: toDate(row.recorded_at) || new Date(),
  };
}

async function setCounter(name, maxId) {
  await Counter.findByIdAndUpdate(
    name,
    { seq: maxId || 0 },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function run() {
  await connectDatabase();
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const parsed = JSON.parse(raw);
  const tableMap = new Map(parsed.filter((item) => item.type === 'table').map((t) => [t.name, t.data || []]));

  const routes = (tableMap.get('routes') || []).map(mapRoute).filter((x) => x.id != null);
  const schedules = (tableMap.get('schedules') || []).map(mapSchedule).filter((x) => x.id != null);
  const stops = (tableMap.get('stop_points') || []).map(mapStop).filter((x) => x.id != null);
  const breadcrumbs = (tableMap.get('gps_breadcrumbs') || []).map(mapBreadcrumb).filter((x) => x.id != null);

  await replaceCollection(Route, routes);
  await replaceCollection(Schedule, schedules);
  await replaceCollection(StopPoint, stops);
  await replaceCollection(GpsBreadcrumb, breadcrumbs);

  await setCounter('routes', Math.max(0, ...routes.map((x) => x.id)));
  await setCounter('schedules', Math.max(0, ...schedules.map((x) => x.id)));
  await setCounter('stop_points', Math.max(0, ...stops.map((x) => x.id)));
  await setCounter('gps_breadcrumbs', Math.max(0, ...breadcrumbs.map((x) => x.id)));

  console.log(`Imported routes=${routes.length}, schedules=${schedules.length}, stops=${stops.length}, gps_breadcrumbs=${breadcrumbs.length}`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Import failed:', err);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});
