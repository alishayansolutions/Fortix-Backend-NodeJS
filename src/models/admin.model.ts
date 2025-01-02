import pool from '../config/database';
import { Admin } from '../types/admin.types';
import bcrypt from 'bcrypt';

export const findById = async (id: number): Promise<Admin | null> => {
  const query = `
    SELECT *
    FROM admin_users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const findByUsername = async (username: string): Promise<Admin | null> => {
  const query = `
    SELECT *
    FROM admin_users
    WHERE username = $1
  `;

  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

export const updateAdmin2FASecret = async (id: number, secret: string): Promise<void> => {
  const query = `
    UPDATE admin_users
    SET secret_2fa = $1, is_2fa_enabled = true
    WHERE id = $2
  `;

  await pool.query(query, [secret, id]);
};

export const disable2FA = async (id: number): Promise<void> => {
  const query = `
    UPDATE admin_users
    SET secret_2fa = NULL, is_2fa_enabled = false
    WHERE id = $1
  `;

  await pool.query(query, [id]);
};
