import mongoose from 'mongoose';

jest.mock('./src/infrastructure/database/mongo.connection', () => ({
  connectDB: jest.fn(() => Promise.resolve()),
}));

afterAll(async () => {
  await mongoose.connection.close(); // ✅ Ensures MongoDB connection is closed
});
