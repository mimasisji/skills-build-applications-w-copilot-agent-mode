import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});

    const redTeam = await Team.create({
      name: 'Red Falcons',
      color: '#ef4444',
    });

    const blueTeam = await Team.create({
      name: 'Blue Sharks',
      color: '#3b82f6',
    });

    const users = await User.insertMany([
      {
        name: 'Ava Parker',
        email: 'ava@example.com',
        grade: '9th',
        team: redTeam._id,
        points: 180,
        badges: ['Streak Starter', 'Sprint Queen'],
      },
      {
        name: 'Noah Lee',
        email: 'noah@example.com',
        grade: '10th',
        team: redTeam._id,
        points: 145,
        badges: ['Distance Runner'],
      },
      {
        name: 'Mila Chen',
        email: 'mila@example.com',
        grade: '11th',
        team: blueTeam._id,
        points: 210,
        badges: ['Team Captain', 'Power Lifter'],
      },
    ]);

    await Team.updateMany({}, { $set: { members: users.map((user) => user._id) } });

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'running',
        durationMinutes: 35,
        distanceMiles: 4.2,
        caloriesBurned: 420,
        points: 90,
        date: new Date('2026-08-15'),
      },
      {
        user: users[2]._id,
        type: 'strength',
        durationMinutes: 40,
        distanceMiles: 0,
        caloriesBurned: 360,
        points: 110,
        date: new Date('2026-08-16'),
      },
    ]);

    await Workout.insertMany([
      {
        title: 'Cardio Blast',
        category: 'cardio',
        difficulty: 'intermediate',
        durationMinutes: 25,
        description: 'High-energy interval run for endurance.',
      },
      {
        title: 'Core Power',
        category: 'strength',
        difficulty: 'beginner',
        durationMinutes: 20,
        description: 'Ab and posture routine designed for stability.',
      },
    ]);

    await Leaderboard.insertMany([
      {
        user: users[2]._id,
        team: blueTeam._id,
        totalPoints: 210,
        streak: 7,
        badges: ['Team Captain'],
        rank: 1,
      },
      {
        user: users[0]._id,
        team: redTeam._id,
        totalPoints: 180,
        streak: 5,
        badges: ['Streak Starter'],
        rank: 2,
      },
      {
        user: users[1]._id,
        team: redTeam._id,
        totalPoints: 145,
        streak: 3,
        badges: ['Distance Runner'],
        rank: 3,
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
