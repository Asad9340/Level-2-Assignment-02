import { Request, Response } from 'express';
import { usersService } from './users.service';
import { JwtPayload } from 'jsonwebtoken';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, phone, role } = req.body;
  const tokenId = (req.user as JwtPayload).id;
  if (role !== 'admin' && tokenId != userId) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin and you can update only your own account',
    });
  }
  try {
    const result = await usersService.updateUser(
      userId!,
      name,
      email,
      phone,
      role
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await usersService.deleteUser(userId!);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const usersController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
