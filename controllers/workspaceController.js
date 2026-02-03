const Workspace = require('../models/Workspace');
const User = require('../models/User');

// Create a new workspace
exports.createWorkspace = (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Workspace name is required'
      });
    }

    Workspace.create(name, description, (err, workspace) => {
      if (err) {
        console.error('Error creating workspace:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to create workspace'
        });
      }

      res.status(201).json({
        success: true,
        data: workspace
      });
    });
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create workspace'
    });
  }
};

// Get all workspaces
exports.getAllWorkspaces = (req, res) => {
  try {
    Workspace.findAll((err, workspaces) => {
      if (err) {
        console.error('Error fetching workspaces:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch workspaces'
        });
      }

      // Get user count for each workspace
      let processed = 0;
      const workspacesWithDetails = [];

      if (workspaces.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }

      workspaces.forEach(workspace => {
        Workspace.getUsersInWorkspace(workspace.id, (err, users) => {
          workspacesWithDetails.push({
            ...workspace,
            userCount: users ? users.length : 0
          });

          processed++;
          if (processed === workspaces.length) {
            res.status(200).json({
              success: true,
              count: workspacesWithDetails.length,
              data: workspacesWithDetails
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workspaces'
    });
  }
};

// Get workspace by ID
exports.getWorkspaceById = (req, res) => {
  try {
    const { id } = req.params;

    Workspace.findById(id, (err, workspace) => {
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

      Workspace.getUsersInWorkspace(id, (err, users) => {
        if (err) {
          console.error('Error fetching workspace users:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch workspace users'
          });
        }

        res.status(200).json({
          success: true,
          data: {
            ...workspace,
            users
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workspace'
    });
  }
};

// Add user to workspace
exports.addUserToWorkspace = (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if workspace exists
    Workspace.findById(id, (err, workspace) => {
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

      // Check if user exists
      User.findById(userId, (err, user) => {
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
            error: 'User not found'
          });
        }

        // Check if user is already in workspace
        Workspace.isUserInWorkspace(id, userId, (err, isAlreadyMember) => {
          if (err) {
            console.error('Error checking workspace membership:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to check workspace membership'
            });
          }

          if (isAlreadyMember) {
            return res.status(409).json({
              success: false,
              error: 'User is already a member of this workspace'
            });
          }

          Workspace.addUser(id, userId, role, (err, users) => {
            if (err) {
              console.error('Error adding user to workspace:', err);
              return res.status(500).json({
                success: false,
                error: 'Failed to add user to workspace'
              });
            }

            res.status(200).json({
              success: true,
              message: 'User added to workspace successfully',
              data: users
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add user to workspace'
    });
  }
};
