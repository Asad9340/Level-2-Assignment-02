import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
  connectionString: config.connectionString,
});

const dbConnection = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) NOT NULL,
      email VARCHAR(250) NOT NULL UNIQUE CHECK (email = LOWER(email)),
      password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
      )
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(250) NOT NULL,
      type VARCHAR(50) NOT NULL  CHECK (type IN ('car', 'bike','van','SUV')),
      registration_number VARCHAR(50) NOT NULL UNIQUE,
      daily_rent_price INT NOT NULL CHECK (daily_rent_price >= 0),
      availability_status VARCHAR(20) NOT NULL  CHECK (availability_status IN ('available', 'booked'))
      )
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES Users(id) ON DELETE CASCADE,
      vehicle_id INT REFERENCES Vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
      total_price INT NOT NULL CHECK (total_price >= 0),
      status VARCHAR(20) NOT NULL  CHECK (status IN ('active', 'cancelled','returned'))
      )
      `);
  } catch (error: any) {
    console.log('Error creating table', error.message);
  }
};

export default dbConnection;
