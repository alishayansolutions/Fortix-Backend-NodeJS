export const tables = {
  admin_users: `
    CREATE TABLE admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_2fa_enabled BOOLEAN DEFAULT false,
      secret_2fa VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `,
  users: `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'client',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
};

export const initialData = {
  admin_users: {
    check: `
      SELECT EXISTS (
        SELECT FROM admin_users 
        WHERE username = 'admin'
      );
    `,
    insert: `
      INSERT INTO admin_users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `,
    values: ['admin', 'admin@example.com', 'admin123']
  }
}; 