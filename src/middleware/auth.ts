import { NextFunction, Request, Response } from 'express';
import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import config from '../config';

type Role = 'admin' | 'customer';
const auth = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: true,
          message: 'Unauthorized access!',
        });
      }
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;
      req.user = decoded;
      if (roles.length > 0 && !roles.includes(decoded.role as Role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied',
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      return;
    }
  };
};
export default auth;
