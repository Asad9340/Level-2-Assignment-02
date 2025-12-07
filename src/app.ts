import express, { Request, Response } from 'express';
import dbConnection from './config/dbConnection';
import { authRouter } from './modules/auth/auth.routes';
import { vehiclesRouter } from './modules/vehicles/vehicles.routes';
import { usersRouter } from './modules/users/users.routes';
import { bookingsRouter } from './modules/bookings/bookings.routes';
import cron from 'node-cron';
import { bookingService } from './modules/bookings/bookings.service';

const app = express();
app.use(express.json());

//database connection
dbConnection();
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to Vehicles Booking Assignment Server',
  });
});

// corn router for auto run
cron.schedule('0 0 * * *', async () => {
  await bookingService.cancelExpireBooking();
});

// auth routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/vehicles', vehiclesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});
export default app;
