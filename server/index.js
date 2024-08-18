const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { supabase } = require('./supabase');
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  createProgress,
  getProgress,
  createActivity,
  getActivities,
} = require('./helpers');
const { API_BASE_URL } = require('../utils/constants');
const { authOptions } = require('../pages/api/auth/[...nextauth]');
const { getServerSession } = require('next-auth/next');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrax API',
      version: '1.0.0',
      description: 'API documentation for the FitTrax application',
    },
  },
  apis: ['./server/index.js', '../pages/api/**/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Authentication Middleware
app.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);
  req.user = session?.user;
  next();
});

// Goals API
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await getGoals(req.user?.id);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get goals' });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const newGoal = await createGoal(req.user?.id, req.body);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal' });
  }
});

app.put('/api/goals/:id', async (req, res) => {
  try {
    const updatedGoal = await updateGoal(
      req.user?.id,
      req.params.id,
      req.body
    );
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal' });
  }
});

app.delete('/api/goals/:id', async (req, res) => {
  try {
    await deleteGoal(req.user?.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal' });
  }
});

// Progress API
app.get('/api/progress/:goalId', async (req, res) => {
  try {
    const progress = await getProgress(req.user?.id, req.params.goalId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get progress' });
  }
});

app.post('/api/progress/:goalId', async (req, res) => {
  try {
    const newProgress = await createProgress(
      req.user?.id,
      req.params.goalId,
      req.body
    );
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create progress' });
  }
});

// Activity API
app.get('/api/activity', async (req, res) => {
  try {
    const activities = await getActivities(req.user?.id);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get activities' });
  }
});

app.post('/api/activity', async (req, res) => {
  try {
    const newActivity = await createActivity(req.user?.id, req.body);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create activity' });
  }
});

app.listen(port, () => {
  console.log(`FitTrax API listening at http://localhost:${port}`);
});