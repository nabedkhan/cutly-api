import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  totalVisits: number;
  phone?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 100
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    },
    totalVisits: {
      type: Number,
      default: 0
    },
    phone: {
      type: String,
      trim: true,
      index: true,
      max: 16
    },
    photoUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    methods: {
      comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
      }
    }
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<UserDocument>("User", userSchema);
