import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/arcademmo'
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool
};
