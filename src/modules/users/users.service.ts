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
  delete result.rows[0].password;
  return result;
};

const deleteUser = async (userId: string) => {
  console.log(userId);
  const bookingStatus = await pool.query(
    `
    SELECT * FROM Bookings WHERE customer_id=$1 AND status='active'
    `,
    [userId]
  );
  if (bookingStatus.rows.length > 0) {
    throw new Error('Cannot delete user: User has existing bookings');
  }
  const result = await pool.query(`
    DELETE FROM Users WHERE id=$1
    `, [userId])
  return result;
};

export const usersService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
