import { Request, Response } from 'express';
import { vehiclesServices } from './vehicles.service';

const createVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const result = await vehiclesServices.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (result.rows.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Required field is missing',
      });
    }
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }
};

export const vehiclesController = {
  createVehicle,
};
