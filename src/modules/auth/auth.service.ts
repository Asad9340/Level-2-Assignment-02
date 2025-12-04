import bcrypt from 'bcryptjs';
import { pool } from '../../config/dbConnection';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const createUsr = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO Users (name, email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
    [name, email, hashedPassword, phone, role]
  );
  delete result.rows[0].password;
  return result;
};

const loginUser = async (email: string, password: string) => {
  const user = await pool.query(
    `
    SELECT * FROM Users where email=$1
    `,
    [email]
  );
  if (user.rows.length === 0) {
    throw new Error('User not found');
  }
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error('Invalid credentials');
  }
  const jwtPayload = {
    name: user.rows[0].name,
    email: user.rows[0].email,
    phone: user.rows[0].phone,
    role: user.rows[0].role,
  } as JwtPayload;
  const token = jwt.sign(jwtPayload, config.jwtSecret!, {
    expiresIn: '7d',
  });
  delete user.rows[0].password;
  return { token, user };
};

export const authServices = {
  createUsr,
  loginUser,
};
