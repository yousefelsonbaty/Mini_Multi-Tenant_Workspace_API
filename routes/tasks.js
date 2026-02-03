const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /tasks - Create a new task
router.post('/', taskController.createTask);

// GET /tasks - Get all tasks (with optional workspaceId query param)
router.get('/', taskController.getTasks);

// PATCH /tasks/:id - Mark task as complete
router.patch('/:id', taskController.markTaskComplete);

module.exports = router;
