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
    if (!vehicle_name || !registration_number) {
      return res.status(400).json({
        success: false,
        message:
          'vehicle_name and registration_number and daily_rent_price are required',
      });
    }
    if (type !== 'car' && type !== 'bike' && type !== 'van' && type !== 'SUV') {
      return res.status(400).json({
        success: false,
        message: 'type  must be car, bike, van, or SUV',
      });
    }
    if (
      availability_status !== 'available' &&
      availability_status !== 'booked'
    ) {
      return res.status(400).json({
        success: false,
        message: 'availability_status  must be available or booked',
      });
    }
    if (daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'daily_rent_price  must be greater than 0',
      });
    }

    const result = await vehiclesServices.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicles found',
        data: result.rows,
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehiclesServices.getSingleVehicle(vehicleId!);
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicle found',
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
    const { vehicleId } = req.params;
    if (daily_rent_price && daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'daily_rent_price  must be greater than 0',
      });
    }
    const result = await vehiclesServices.updateVehicle(
      vehicleId!,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehiclesServices.deleteVehicle(vehicleId!);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
