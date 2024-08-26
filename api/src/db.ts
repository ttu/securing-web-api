import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  password: process.env.PG_PASSWORD || 'mysecretpassword',
  database: process.env.PG_DATABASE || 'securing-api',
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

export default pool;
