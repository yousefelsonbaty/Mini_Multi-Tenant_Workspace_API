const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

// POST /workspaces - Create a new workspace
router.post('/', workspaceController.createWorkspace);

// GET /workspaces - Get all workspaces
router.get('/', workspaceController.getAllWorkspaces);

// GET /workspaces/:id - Get workspace by ID
router.get('/:id', workspaceController.getWorkspaceById);

// POST /workspaces/:id/users - Add user to workspace
router.post('/:id/users', workspaceController.addUserToWorkspace);

module.exports = router;
