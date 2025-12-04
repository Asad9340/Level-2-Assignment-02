import bcrypt from 'bcryptjs';
import { pool } from '../../config/dbConnection';

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

export const authServices = {
  createUsr,
};
