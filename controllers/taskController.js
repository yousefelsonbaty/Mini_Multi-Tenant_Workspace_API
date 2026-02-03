const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// Create a new task
exports.createTask = (req, res) => {
  try {
    const { title, description, workspaceId, assignedTo } = req.body;

    // Validation
    if (!title || !workspaceId) {
      return res.status(400).json({
        success: false,
        error: 'Title and workspaceId are required'
      });
    }

    // Check if workspace exists
    Workspace.findById(workspaceId, (err, workspace) => {
      if (err) {
        console.error('Error fetching workspace:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch workspace'
        });
      }

      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: 'Workspace not found'
        });
      }

      // If assignedTo is provided, check if user exists
      if (assignedTo) {
        User.findById(assignedTo, (err, user) => {
          if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch user'
            });
          }

          if (!user) {
            return res.status(404).json({
              success: false,
              error: 'Assigned user not found'
            });
          }

          createTaskHelper();
        });
      } else {
        createTaskHelper();
      }

      function createTaskHelper() {
        Task.create(title, description, workspaceId, assignedTo, (err, task) => {
          if (err) {
            console.error('Error creating task:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to create task'
            });
          }

          res.status(201).json({
            success: true,
            data: task
          });
        });
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
};

// Get all tasks or filter by workspaceId
exports.getTasks = (req, res) => {
  try {
    const { workspaceId } = req.query;

    if (workspaceId) {
      // Check if workspace exists
      Workspace.findById(workspaceId, (err, workspace) => {
        if (err) {
          console.error('Error fetching workspace:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch workspace'
          });
        }

        if (!workspace) {
          return res.status(404).json({
            success: false,
            error: 'Workspace not found'
          });
        }

        Task.findByWorkspace(workspaceId, (err, tasks) => {
          if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch tasks'
            });
          }

          res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
          });
        });
      });
    } else {
      Task.findAll((err, tasks) => {
        if (err) {
          console.error('Error fetching tasks:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch tasks'
          });
        }

        res.status(200).json({
          success: true,
          count: tasks.length,
          data: tasks
        });
      });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};

// Mark task as complete
exports.markTaskComplete = (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    Task.findById(id, (err, existingTask) => {
      if (err) {
        console.error('Error fetching task:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch task'
        });
      }

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      // Check if already completed
      if (existingTask.completed) {
        return res.status(400).json({
          success: false,
          error: 'Task is already completed'
        });
      }

      Task.markComplete(id, (err, task) => {
        if (err) {
          console.error('Error marking task complete:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to mark task as complete'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Task marked as complete',
          data: task
        });
      });
    });
  } catch (error) {
    console.error('Error marking task complete:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark task as complete'
    });
  }
};
