import { Router } from 'express';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const router = Router();

router.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api' });
});

router.get('/api/users', async (_request, response) => {
  try {
    const users = await User.find().populate('team');
    response.json(users);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch users', error });
  }
});

router.post('/api/users', async (request, response) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    response.status(400).json({ message: 'Failed to create user', error });
  }
});

router.get('/api/teams', async (_request, response) => {
  try {
    const teams = await Team.find().populate('members');
    response.json(teams);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch teams', error });
  }
});

router.post('/api/teams', async (request, response) => {
  try {
    const team = await Team.create(request.body);
    response.status(201).json(team);
  } catch (error) {
    response.status(400).json({ message: 'Failed to create team', error });
  }
});

router.get('/api/activities', async (_request, response) => {
  try {
    const activities = await Activity.find().populate('user');
    response.json(activities);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch activities', error });
  }
});

router.post('/api/activities', async (request, response) => {
  try {
    const activity = await Activity.create(request.body);
    response.status(201).json(activity);
  } catch (error) {
    response.status(400).json({ message: 'Failed to create activity', error });
  }
});

router.get('/api/workouts', async (_request, response) => {
  try {
    const workouts = await Workout.find();
    response.json(workouts);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch workouts', error });
  }
});

router.post('/api/workouts', async (request, response) => {
  try {
    const workout = await Workout.create(request.body);
    response.status(201).json(workout);
  } catch (error) {
    response.status(400).json({ message: 'Failed to create workout', error });
  }
});

router.get('/api/leaderboard', async (_request, response) => {
  try {
    const leaderboard = await Leaderboard.find().populate(['user', 'team']);
    response.json(leaderboard);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
});

router.post('/api/leaderboard', async (request, response) => {
  try {
    const score = await Leaderboard.create(request.body);
    response.status(201).json(score);
  } catch (error) {
    response.status(400).json({ message: 'Failed to create leaderboard entry', error });
  }
});

export default router;
