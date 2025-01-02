import pool from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import bcrypt from 'bcrypt';

export const createUser = async (userData: CreateUserDTO): Promise<Omit<User, 'password'>> => {
  const { username, email, password, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, is_active, created_at, updated_at;
  `;

  const result = await pool.query(query, [username, email, hashedPassword, role]);
  return result.rows[0];
};

export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const query = `
    SELECT id, username, email, role, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updateUser = async (
  id: number,
  updateData: UpdateUserDTO
): Promise<Omit<User, 'password'> | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Build dynamic update query
  if (updateData.username) {
    updates.push(`username = $${paramCount}`);
    values.push(updateData.username);
    paramCount++;
  }
  if (updateData.email) {
    updates.push(`email = $${paramCount}`);
    values.push(updateData.email);
    paramCount++;
  }
  if (updateData.password) {
    updates.push(`password = $${paramCount}`);
    values.push(await bcrypt.hash(updateData.password, 10));
    paramCount++;
  }
  if (updateData.role) {
    updates.push(`role = $${paramCount}`);
    values.push(updateData.role);
    paramCount++;
  }
  if (typeof updateData.is_active === 'boolean') {
    updates.push(`is_active = $${paramCount}`);
    values.push(updateData.is_active);
    paramCount++;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  if (updates.length === 0) return null;

  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, username, email, role, is_active, created_at, updated_at;
  `;

  values.push(id);
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;

    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const query = `
    SELECT *
    FROM users
    WHERE username = $1;
  `;

  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
}; 