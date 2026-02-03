const db = require('./database');

class Task {
  static create(title, description, workspaceId, assignedTo = null, callback) {
    db.run(
      'INSERT INTO tasks (title, description, workspace_id, assigned_to) VALUES (?, ?, ?, ?)',
      [title, description, workspaceId, assignedTo],
      function(err) {
        if (err) return callback(err);
        Task.findById(this.lastID, callback);
      }
    );
  }

  static findAll(callback) {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM tasks WHERE id = ?', [id], callback);
  }

  static findByWorkspace(workspaceId, callback) {
    db.all(`
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.workspace_id = ?
      ORDER BY t.created_at DESC
    `, [workspaceId], callback);
  }

  static markComplete(id, callback) {
    db.run(
      'UPDATE tasks SET completed = 1, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', id],
      (err) => {
        if (err) return callback(err);
        Task.findById(id, callback);
      }
    );
  }

  static getStatistics(callback) {
    db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
      FROM tasks
    `, [], callback);
  }
}

module.exports = Task;
