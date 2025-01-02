import pool from '../config/database';
import bcrypt from 'bcrypt';

export const tableExists = async (tableName: string): Promise<boolean> => {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `;

  const result = await pool.query(query, [tableName]);
  return result.rows[0].exists;
};

export const createTable = async (tableName: string, tableQuery: string): Promise<void> => {
  try {
    await pool.query(tableQuery);
    console.log(`${tableName} table created successfully`);
  } catch (error) {
    console.error(`Error creating ${tableName} table:`, error);
    throw error;
  }
};

export const insertInitialData = async (
  tableName: string,
  checkQuery: string,
  insertQuery: string,
  values: any[],
  needsPasswordHash = false
): Promise<void> => {
  try {
    const exists = await pool.query(checkQuery);
    
    if (!exists.rows[0].exists) {
      let finalValues = [...values];
      
      // Hash password if needed (for tables with password fields)
      if (needsPasswordHash) {
        const passwordIndex = values.findIndex(v => typeof v === 'string' && v.includes('123')); // assuming default passwords end with 123
        if (passwordIndex !== -1) {
          finalValues[passwordIndex] = await bcrypt.hash(values[passwordIndex], 10);
        }
      }

      const result = await pool.query(insertQuery, finalValues);
      console.log(`Initial data inserted into ${tableName}:`, result.rows[0]);
    } else {
      console.log(`Initial data already exists in ${tableName}`);
    }
  } catch (error) {
    console.error(`Error inserting initial data into ${tableName}:`, error);
    throw error;
  }
}; 