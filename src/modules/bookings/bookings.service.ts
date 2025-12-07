import { pool } from '../../config/dbConnection';

const cancelExpireBooking = async () => {
  const result = await pool.query(
    `
    UPDATE Bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date <  CURRENT_DATE RETURNING *
    `
  );
  if (result.rows.length === 0) return;
  await pool.query(
    `
    UPDATE Vehicles SET availability_status = 'available' WHERE id = ANY($1)
    `,
    [result.rows.map(b => b.vehicle_id)]
  );
};

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: Date,
  rent_end_date: Date
) => {
  const startDate = new Date(rent_start_date).getTime();
  const endDate = new Date(rent_end_date).getTime();

  const userCollection = await pool.query(
    `
    SELECT * FROM Users WHERE id=$1
    `,
    [customer_id]
  );
  if (userCollection.rows.length === 0) {
    throw new Error('User not found');
  }

  const vehiclesCollection = await pool.query(
    `
    SELECT * FROM Vehicles WHERE id=$1
    `,
    [vehicle_id]
  );
  if (vehiclesCollection.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const totalDay = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const perDayPrice = vehiclesCollection.rows[0].daily_rent_price;
  const totalPrice = totalDay * perDayPrice;

  // update vehicle status
  const updateStatus = await pool.query(
    `
    UPDATE Vehicles SET availability_status='booked' WHERE id=$1
    `,
    [vehicle_id]
  );

  const result = await pool.query(
    `
    INSERT INTO Bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES ($1,$2,$3,$4,$5,'active') RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  return { vehiclesCollection, result };
};

const getAllBooking = async (
  role: string,
  id: number,
  name: string,
  email: string
) => {
  const finalResult = [];
  if (role === 'admin') {
    const result = await pool.query(`
    SELECT * FROM Bookings
    `);
    for (const booking of result.rows) {
      const vehicleId = booking.vehicle_id;
      const vehicleCollection = await pool.query(
        `SELECT vehicle_name, registration_number FROM Vehicles WHERE id=$1`,
        [vehicleId]
      );
      finalResult.push({
        ...booking,
        customer: {
          name: name,
          email: email,
        },
        vehicle: {
          vehicle_name: vehicleCollection.rows[0].vehicle_name,
          registration_number: vehicleCollection.rows[0].registration_number,
        },
      });
    }
    return finalResult;
  } else {
    const result = await pool.query(
      `
    SELECT * FROM Bookings WHERE customer_id=$1
    `,
      [id]
    );
    for (const booking of result.rows) {
      const vehicleId = booking.vehicle_id;
      const vehicleCollection = await pool.query(
        `SELECT vehicle_name, registration_number FROM Vehicles WHERE id=$1`,
        [vehicleId]
      );
      finalResult.push({
        ...booking,
        vehicle: {
          vehicle_name: vehicleCollection.rows[0].vehicle_name,
          registration_number: vehicleCollection.rows[0].registration_number,
          type: vehicleCollection.rows[0].type,
        },
      });
    }
    return finalResult;
  }
};

const updateBooking = async (
  bookingId: string,
  status: string,
  role: string
) => {
  if (role === 'customer' && status === 'cancelled') {
    console.log(bookingId, status, role);
    const result = await pool.query(
      `
      UPDATE Bookings SET status='cancelled' WHERE id=$1 RETURNING *
      `,
      [bookingId]
    );

    const vehicleId = result.rows[0].vehicle_id;
    const updateVehicleStatus = await pool.query(
      `
      UPDATE Vehicles SET availability_status='available' WHERE id=$1 RETURNING *
      `,
      [vehicleId]
    );
    return { result, updateVehicleStatus };
  } else if (role === 'admin' && status === 'returned') {
    const result = await pool.query(
      `
      UPDATE Bookings SET status= 'returned' WHERE id=$1 RETURNING *
      `,
      [bookingId]
    );
    const vehicleId = result.rows[0].vehicle_id;
    const updateVehicleStatus = await pool.query(
      `
      UPDATE Vehicles SET availability_status= 'available' WHERE id=$1 RETURNING *
      `,
      [vehicleId]
    );
    return { result, updateVehicleStatus };
  } else {
    throw new Error('Wrong status or role');
  }
};

export const bookingService = {
  createBooking,
  getAllBooking,
  updateBooking,
  cancelExpireBooking,
};
