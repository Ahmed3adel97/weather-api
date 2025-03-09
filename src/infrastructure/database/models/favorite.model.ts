import mongoose, { Schema, Document } from 'mongoose';

// Define Weather Summary Schema
const WeatherSummarySchema = new Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  condition: { type: String, required: true },
});

// Define Favorite Document Interface
export interface IFavoriteDocument extends Document {
  userId: mongoose.Types.ObjectId;
  city: string;
  country: string;
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
  };
  _id: mongoose.Types.ObjectId;
}

// Define Mongoose Schema
const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: { type: String, required: true },
    country: { type: String, required: true },
    weather: { type: WeatherSummarySchema, required: true }, // ✅ Embedded weather object
  },
  { timestamps: true }
);

// Mongoose Model
export const FavoriteModel = mongoose.model<IFavoriteDocument>(
  'Favorite',
  FavoriteSchema
);
