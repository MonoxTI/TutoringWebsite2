// src/lib/db/connect.ts
import mongoose from 'mongoose';
import { IUser, IAppointment, IAppointmentDetails } from '../types';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not set in .env');
    }

    mongoose.connection.on('connected', () =>
      console.log('MongoDB connected')
    );
    mongoose.connection.on('error', (err) =>
      console.error(`MongoDB connection error: ${err}`)
    );
    mongoose.connection.on('disconnected', () =>
      console.log('MongoDB disconnected')
    );

    await mongoose.connect(mongoUri, {
      dbName: 'MERN',
      autoIndex: true,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};