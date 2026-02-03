const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Task = require('../models/Task');

// Get summary of all entities
exports.getSummary = (req, res) => {
  try {
    // Fetch users
    User.findAll((err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch summary'
        });
      }

      // Fetch workspaces
      Workspace.findAll((err, workspaces) => {
        if (err) {
          console.error('Error fetching workspaces:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch summary'
          });
        }

        // Fetch task statistics
        Task.getStatistics((err, taskStats) => {
          if (err) {
            console.error('Error fetching task statistics:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch summary'
            });
          }

          // Get user count for each workspace
          let processed = 0;
          const workspacesWithDetails = [];

          if (workspaces.length === 0) {
            return sendResponse();
          }

          workspaces.forEach(workspace => {
            Workspace.getUsersInWorkspace(workspace.id, (err, workspaceUsers) => {
              workspacesWithDetails.push({
                ...workspace,
                userCount: workspaceUsers ? workspaceUsers.length : 0
              });

              processed++;
              if (processed === workspaces.length) {
                sendResponse();
              }
            });
          });

          function sendResponse() {
            const summary = {
              users: {
                total: users.length,
                list: users
              },
              workspaces: {
                total: workspaces.length,
                list: workspacesWithDetails.length > 0 ? workspacesWithDetails : workspaces.map(ws => ({
                  ...ws,
                  userCount: 0
                }))
              },
              tasks: {
                total: taskStats.total || 0,
                completed: taskStats.completed || 0,
                pending: taskStats.pending || 0,
                completionRate: taskStats.total > 0 
                  ? `${Math.round((taskStats.completed / taskStats.total) * 100)}%`
                  : '0%'
              }
            };

            res.status(200).json({
              success: true,
              data: summary
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary'
    });
  }
};
