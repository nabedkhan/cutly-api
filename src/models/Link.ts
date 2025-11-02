import { Document, Schema, model } from "mongoose";

export interface LinkDocument extends Document {
  title: string;
  backHalf: string;
  shortUrl: string;
  destinationUrl: string;
  totalVisits: number;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<LinkDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 55
    },
    destinationUrl: {
      type: String,
      required: true,
      trim: true
    },
    backHalf: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true
    },
    totalVisits: {
      type: Number,
      default: 0
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Link = model<LinkDocument>("Link", linkSchema);
