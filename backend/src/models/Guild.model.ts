import mongoose, { Schema, Document } from 'mongoose';

export interface IGuild extends Document {
  name: string;
  description: string;
  leaderWallet: string;
  members: Array<{
    walletAddress: string;
    role: 'Leader' | 'Officer' | 'Member';
    joinedAt: Date;
  }>;
  level: number;
  exp: number;
  maxMembers: number;
  guildHall: {
    level: number;
    bonuses: any;
  };
  treasury: {
    gold: number;
    premium: number;
  };
  isRecruiting: boolean;
  requirements: {
    minLevel: number;
  };
  createdAt: Date;
}

const GuildSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    leaderWallet: {
      type: String,
      required: true,
    },
    members: [{
      walletAddress: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['Leader', 'Officer', 'Member'],
        default: 'Member',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    level: {
      type: Number,
      default: 1,
    },
    exp: {
      type: Number,
      default: 0,
    },
    maxMembers: {
      type: Number,
      default: 20,
    },
    guildHall: {
      level: {
        type: Number,
        default: 1,
      },
      bonuses: Schema.Types.Mixed,
    },
    treasury: {
      gold: {
        type: Number,
        default: 0,
      },
      premium: {
        type: Number,
        default: 0,
      },
    },
    isRecruiting: {
      type: Boolean,
      default: true,
    },
    requirements: {
      minLevel: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGuild>('Guild', GuildSchema);
