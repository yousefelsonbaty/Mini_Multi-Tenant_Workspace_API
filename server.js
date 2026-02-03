require('dotenv').config();
const express = require('express');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const workspaceRoutes = require('./routes/workspaces');
const taskRoutes = require('./routes/tasks');
const summaryRoutes = require('./routes/summary');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mini Multi-Tenant Workspace API',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      workspaces: '/workspaces',
      tasks: '/tasks',
      summary: '/summary'
    }
  });
});

// API Routes
app.use('/users', userRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/tasks', taskRoutes);
app.use('/summary', summaryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Mini Multi-Tenant Workspace API');
  console.log('='.repeat(50));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log('  POST   /users');
  console.log('  GET    /users');
  console.log('  POST   /workspaces');
  console.log('  GET    /workspaces');
  console.log('  POST   /workspaces/:id/users');
  console.log('  POST   /tasks');
  console.log('  GET    /tasks?workspaceId=');
  console.log('  PATCH  /tasks/:id');
  console.log('  GET    /summary');
  console.log('='.repeat(50));
});

module.exports = app;
