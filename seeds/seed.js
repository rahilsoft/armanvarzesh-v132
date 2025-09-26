const { Client } = require('pg');

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("INSERT INTO users(email, password_hash) VALUES($1,$2) ON CONFLICT DO NOTHING", ['admin@example.com', 'hashed:changeme']);
    console.log('Seed complete');
  } finally {
    await client.end();
  }
}

run().catch(e => { console.error(e); process.exit(1); });