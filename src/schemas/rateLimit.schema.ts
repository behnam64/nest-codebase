import * as mongoose from 'mongoose';

export interface RateLimitDocument extends mongoose.Document {
  key: string;
  points: number;
  updatedAt: Date;
}

const RateLimitSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    points: { type: Number, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: false }
);

export const RateLimitModel = mongoose.model<RateLimitDocument>('RateLimit', RateLimitSchema);