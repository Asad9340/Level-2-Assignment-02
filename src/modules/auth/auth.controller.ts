import { Request, Response } from 'express';
import { authServices } from './auth.service';

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await authServices.createUsr(
      name,
      email,
      password,
      phone,
      role
    );
    if (result.rows.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Required field is missing',
      });
    }
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result.rows[0],
    });
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }
};

const loginUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'User login successfully',
  });
};

export const authController = {
  createUser,
  loginUser,
};
