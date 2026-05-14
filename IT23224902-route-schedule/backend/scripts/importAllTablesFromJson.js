require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDatabase, mongoose } = require('../config/database');

const sourceFile =
  process.argv[2] ||
  path.resolve(__dirname, '../../..', 'school_van_system (1).json');

function normalizeValue(value) {
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (typeof value !== 'string') return value;
  return value;
}

function normalizeRow(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = normalizeValue(value);
  }
  return out;
}

async function importTable(db, tableName, rows) {
  const collection = db.collection(tableName);
  await collection.deleteMany({});
  if (!rows.length) return 0;
  const docs = rows.map(normalizeRow);
  const result = await collection.insertMany(docs, { ordered: false });
  return result.insertedCount || docs.length;
}

async function run() {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`JSON file not found: ${sourceFile}`);
  }

  await connectDatabase();
  const db = mongoose.connection.db;
  const payload = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const tables = payload.filter((entry) => entry.type === 'table');

  let total = 0;
  for (const table of tables) {
    const count = await importTable(db, table.name, table.data || []);
    total += count;
    console.log(`Imported ${count} documents into ${table.name}`);
  }

  console.log(`Import complete. Tables: ${tables.length}, Documents: ${total}`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Import failed:', err.message);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});
