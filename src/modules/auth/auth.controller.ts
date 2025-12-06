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
     return res.status(400).json({
        success: false,
        message: 'Required field is missing',
      });
    }
   return res.status(201).json({
     success: true,
     message: 'User registered successfully',
     data: result.rows[0],
   });
  } catch (error: any) {
   return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.loginUser(email, password);
   return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user.rows[0],
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
