import { pool } from '../../config/dbConnection';

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone,role FROM Users
    `);
  return result;
};

const updateUser = async (
  userId: string,
  name: string,
  email: string,
  phone: string,
  role: string
) => {
  const result = await pool.query(
    `
    UPDATE Users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role) WHERE id=$5 RETURNING *
    `,
    [name, email, phone, role, userId]
  );
  delete result.rows[0].password
  return result;
};
export const usersService = {
  getAllUsers,
  updateUser,
};
