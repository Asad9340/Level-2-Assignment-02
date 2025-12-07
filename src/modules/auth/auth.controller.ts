import { Request, Response } from 'express';
import { authServices } from './auth.service';

const createUser = async (req: Request, res: Response) => {
  let { name, email, password, phone, role } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 character',
    });
  }
  if (email !== email.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: 'Email must be in lowercase',
    });
  }
  if (!role) {
    role = 'customer';
  }
  if (role !== 'admin' && role !== 'customer') {
    return res.status(400).json({
      success: false,
      message: 'Role must be admin or customer',
    });
  }

  try {
    const result = await authServices.createUsr(
      name,
      email,
      password,
      phone,
      role
    );
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
