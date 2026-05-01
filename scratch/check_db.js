const { neon } = require('@neondatabase/serverless');

const sql = neon("postgresql://neondb_owner:npg_qSTkY2vyPn5p@ep-hidden-art-ao1eleir-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function check() {
  try {
    const columns = await sql(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'applications'
    `);
    console.log('Applications Columns:', columns);
    
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables);
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
