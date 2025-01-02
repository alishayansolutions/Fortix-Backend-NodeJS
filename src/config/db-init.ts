import { tables, initialData } from './tables';
import { tableExists, createTable, insertInitialData } from '../utils/table-utils';

const createTables = async () => {
  try {
    // Create all tables
    for (const [tableName, tableQuery] of Object.entries(tables)) {
      const exists = await tableExists(tableName);
      
      if (!exists) {
        await createTable(tableName, tableQuery);
      } else {
        console.log(`${tableName} table already exists`);
      }
    }

    // Insert initial data
    for (const [tableName, data] of Object.entries(initialData)) {
      await insertInitialData(
        tableName,
        data.check,
        data.insert,
        data.values,
        tableName === 'admin_users' // specify which tables need password hashing
      );
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}; 