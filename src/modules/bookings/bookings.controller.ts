import { Request, Response } from 'express';
import { bookingService } from './bookings.service';
import { JwtPayload } from 'jsonwebtoken';

const createBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    return res.status(400).json({
      success: false,
      message:
        'customer_id, vehicle_id, rent_start_date and rent_end_date are required',
    });
  }

  const startDate = new Date(rent_start_date).getTime();
  const endDate = new Date(rent_end_date).getTime();
  if (endDate < startDate) {
    return res.status(400).json({
      success: false,
      message: 'rent_end_date must be greater than rent_start_date',
    });
  }
  try {
    const { vehiclesCollection, result } = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...result.rows[0],
        vehicle: {
          vehicle_name: vehiclesCollection.rows[0].vehicle_name,
          daily_rent_price: vehiclesCollection.rows[0].daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const { role } = req.user as JwtPayload;
    const name = req.user!.name;
    const email = req.user!.email;
    const id = req.user!.id;

    await bookingService.cancelExpireBooking();
    const result = await bookingService.getAllBooking(role, id, name, email);

    if (role === 'admin') {
      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: result,
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Your bookings retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const role = req.user!.role;
  const { result, updateVehicleStatus } = await bookingService.updateBooking(
    bookingId!,
    status,
    role
  );
  try {
    if (role === 'customer') {
      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result.rows[0],
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Booking marked as returned. Vehicle is now available',
      data: {
        ...result.rows[0],
        vehicle: {
          availability_status: updateVehicleStatus.rows[0].availability_status,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBooking,
  updateBooking,
};
