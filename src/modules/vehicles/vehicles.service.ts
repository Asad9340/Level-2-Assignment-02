import { pool } from '../../config/dbConnection';

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `
    INSERT INTO Vehicles( vehicle_name, type, registration_number, daily_rent_price, availability_status ) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`
    SELECT * FROM Vehicles
    `);
  return result;
};

const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `
    SELECT * FROM Vehicles WHERE id=$1
    `,
    [vehicleId]
  );
  return result;
};

const updateVehicle = async (
  vehicleId: string,
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `
    UPDATE Vehicles SET
      vehicle_name = COALESCE($1, vehicle_name), type = COALESCE($2, type), registration_number = COALESCE($3, registration_number), daily_rent_price = COALESCE($4, daily_rent_price), availability_status = COALESCE($5, availability_status) WHERE id = $6 RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result;
};

const deleteVehicle = async (vehicleId: string) => {
  const bookingStatus = await pool.query(
    `
    SELECT * FROM Bookings WHERE vehicle_id=$1 AND status='active'
    `,
    [vehicleId]
  );
  if (bookingStatus.rows.length > 0) {
    throw new Error('Cannot delete vehicle: Vehicle has existing bookings');
  }
  const result = await pool.query(
    `
    DELETE FROM Vehicles WHERE id=$1
    `,
    [vehicleId]
  );

  return result;
};

export const vehiclesServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
