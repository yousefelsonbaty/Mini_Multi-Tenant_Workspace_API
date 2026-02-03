const User = require('./models/User');
const Workspace = require('./models/Workspace');
const Task = require('./models/Task');

console.log('Starting database seed...\n');

// Create users
console.log('Creating users...');
User.create('Alice Johnson', 'alice@example.com', (err, user1) => {
  if (err) return handleError(err);
  
  User.create('Bob Smith', 'bob@example.com', (err, user2) => {
    if (err) return handleError(err);
    
    User.create('Carol Williams', 'carol@example.com', (err, user3) => {
      if (err) return handleError(err);
      
      User.create('David Brown', 'david@example.com', (err, user4) => {
        if (err) return handleError(err);
        
        console.log(`Created 4 users\n`);
        
        // Create workspaces
        console.log('Creating workspaces...');
        Workspace.create('Marketing Team', 'Workspace for marketing campaigns and content', (err, workspace1) => {
          if (err) return handleError(err);
          
          Workspace.create('Development Team', 'Workspace for software development projects', (err, workspace2) => {
            if (err) return handleError(err);
            
            Workspace.create('Design Team', 'Workspace for design and creative work', (err, workspace3) => {
              if (err) return handleError(err);
              
              console.log(`Created 3 workspaces\n`);
              
              // Add users to workspaces
              console.log('Adding users to workspaces...');
              Workspace.addUser(workspace1.id, user1.id, 'admin', (err) => {
                if (err) return handleError(err);
                
                Workspace.addUser(workspace1.id, user2.id, 'member', (err) => {
                  if (err) return handleError(err);
                  
                  Workspace.addUser(workspace1.id, user3.id, 'member', (err) => {
                    if (err) return handleError(err);
                    
                    Workspace.addUser(workspace2.id, user2.id, 'admin', (err) => {
                      if (err) return handleError(err);
                      
                      Workspace.addUser(workspace2.id, user4.id, 'member', (err) => {
                        if (err) return handleError(err);
                        
                        Workspace.addUser(workspace3.id, user3.id, 'admin', (err) => {
                          if (err) return handleError(err);
                          
                          Workspace.addUser(workspace3.id, user1.id, 'member', (err) => {
                            if (err) return handleError(err);
                            
                            console.log('Added users to workspaces\n');
                            
                            // Create tasks
                            console.log('Creating tasks...');
                            createTasks(workspace1, workspace2, workspace3, user1, user2, user3, user4);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

function createTasks(workspace1, workspace2, workspace3, user1, user2, user3, user4) {
  // Marketing Team tasks
  Task.create('Create Q1 Marketing Strategy', 'Develop comprehensive marketing strategy for Q1 2026', workspace1.id, user1.id, (err) => {
    if (err) return handleError(err);
    
    Task.create('Social Media Campaign', 'Launch new social media campaign across all platforms', workspace1.id, user2.id, (err) => {
      if (err) return handleError(err);
      
      Task.create('Email Newsletter', 'Design and send monthly email newsletter', workspace1.id, user3.id, (err) => {
        if (err) return handleError(err);
        
        Task.create('Market Research', 'Conduct competitor analysis', workspace1.id, user1.id, (err, completedTask1) => {
          if (err) return handleError(err);
          
          Task.markComplete(completedTask1.id, (err) => {
            if (err) return handleError(err);
            
            // Development Team tasks
            Task.create('API Development', 'Build RESTful API for workspace management', workspace2.id, user2.id, (err) => {
              if (err) return handleError(err);
              
              Task.create('Database Optimization', 'Optimize database queries for better performance', workspace2.id, user4.id, (err) => {
                if (err) return handleError(err);
                
                Task.create('Code Review', 'Review pull requests from last sprint', workspace2.id, user2.id, (err, completedTask2) => {
                  if (err) return handleError(err);
                  
                  Task.markComplete(completedTask2.id, (err) => {
                    if (err) return handleError(err);
                    
                    Task.create('Unit Tests', 'Write unit tests for user authentication', workspace2.id, user4.id, (err, completedTask3) => {
                      if (err) return handleError(err);
                      
                      Task.markComplete(completedTask3.id, (err) => {
                        if (err) return handleError(err);
                        
                        // Design Team tasks
                        Task.create('UI Mockups', 'Create UI mockups for new dashboard', workspace3.id, user3.id, (err) => {
                          if (err) return handleError(err);
                          
                          Task.create('Brand Guidelines', 'Update brand guidelines document', workspace3.id, user1.id, (err) => {
                            if (err) return handleError(err);
                            
                            Task.create('Icon Set Design', 'Design custom icon set for application', workspace3.id, user3.id, (err) => {
                              if (err) return handleError(err);
                              
                              console.log(`Created 11 tasks (3 completed, 8 pending)\n`);
                              console.log('Database seeding completed successfully!\n');
                              console.log('Summary:');
                              console.log('- 4 users created');
                              console.log('- 3 workspaces created');
                              console.log('- 11 tasks created (3 completed, 8 pending)');
                              console.log('- Users assigned to multiple workspaces\n');
                              
                              process.exit(0);
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function handleError(error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
