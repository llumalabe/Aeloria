import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username: string;
  email?: string;
  gold: number;
  premium: number;
  tokens: number;
  level: number;
  exp: number;
  energy: number;
  maxEnergy: number;
  lastEnergyReset: Date;
  lastLoginDate: Date;
  loginStreak: number;
  totalPlayTime: number;
  referralCode: string;
  referredBy?: string;
  achievements: string[];
  seasonPassLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      sparse: true,
    },
    gold: {
      type: Number,
      default: 1000,
      min: 0,
    },
    premium: {
      type: Number,
      default: 0,
      min: 0,
    },
    tokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    exp: {
      type: Number,
      default: 0,
      min: 0,
    },
    energy: {
      type: Number,
      default: 30,
      min: 0,
    },
    maxEnergy: {
      type: Number,
      default: 30,
    },
    lastEnergyReset: {
      type: Date,
      default: Date.now,
    },
    lastLoginDate: {
      type: Date,
      default: Date.now,
    },
    loginStreak: {
      type: Number,
      default: 1,
    },
    totalPlayTime: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      required: false,
      unique: true,
    },
    referredBy: {
      type: String,
    },
    achievements: [{
      type: String,
    }],
    seasonPassLevel: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique referral code
UserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
