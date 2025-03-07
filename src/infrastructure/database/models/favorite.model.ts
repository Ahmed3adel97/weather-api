import mongoose, { Schema, Document } from 'mongoose';

export interface IFavoriteCity extends Document {
  user: mongoose.Types.ObjectId;
  cityName: string;
  country: string;
  lat: number;
  lon: number;
}

const FavoriteCitySchema = new Schema<IFavoriteCity>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  { timestamps: true }
);

export const FavoriteCity = mongoose.model<IFavoriteCity>(
  'FavoriteCity',
  FavoriteCitySchema
);
