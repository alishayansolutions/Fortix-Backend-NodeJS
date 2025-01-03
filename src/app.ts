import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db-init';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  try {
    await initializeDatabase();

    // Routes
    app.use('/api', routes);

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ 
        message: 'Something went wrong!',
        error: err?.message
      });
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 