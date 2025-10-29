import db from '../db/pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function createUser(username: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const res = await db.query('INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id', [username, hash]);
  return res.rows[0];
}

export async function authenticate(username: string, password: string) {
  const res = await db.query('SELECT id, password_hash FROM users WHERE username=$1', [username]);
  if (!res.rowCount) return null;
  const user = res.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return { token, userId: user.id };
}
