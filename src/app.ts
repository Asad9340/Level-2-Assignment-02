import express, { Request, Response } from 'express';
import dbConnection from './config/dbConnection';
import { authRouter } from './modules/auth/auth.routes';

const app = express();
app.use(express.json());

//database connection
dbConnection();
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Assignment Server',
  });
});

// auth routes
app.use('/api/v1/auth',authRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});
export default app;
