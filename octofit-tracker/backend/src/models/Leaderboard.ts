import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    rank: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Leaderboard = mongoose.model<LeaderboardDocument>('Leaderboard', leaderboardSchema);

export default Leaderboard;
