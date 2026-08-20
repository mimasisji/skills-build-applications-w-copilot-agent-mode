import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['cardio', 'strength', 'mobility', 'recovery'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Workout = mongoose.model<WorkoutDocument>('Workout', workoutSchema);

export default Workout;
