const db = require('./database');

class Workspace {
  static create(name, description, callback) {
    db.run('INSERT INTO workspaces (name, description) VALUES (?, ?)', [name, description || null], function(err) {
      if (err) return callback(err);
      Workspace.findById(this.lastID, callback);
    });
  }

  static findAll(callback) {
    db.all('SELECT * FROM workspaces ORDER BY created_at DESC', [], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM workspaces WHERE id = ?', [id], callback);
  }

  static addUser(workspaceId, userId, role = 'member', callback) {
    db.run(
      'INSERT INTO workspace_users (workspace_id, user_id, role) VALUES (?, ?, ?)',
      [workspaceId, userId, role],
      (err) => {
        if (err) return callback(err);
        Workspace.getUsersInWorkspace(workspaceId, callback);
      }
    );
  }

  static getUsersInWorkspace(workspaceId, callback) {
    db.all(`
      SELECT u.id, u.name, u.email, wu.role, wu.added_at
      FROM users u
      INNER JOIN workspace_users wu ON u.id = wu.user_id
      WHERE wu.workspace_id = ?
      ORDER BY wu.added_at DESC
    `, [workspaceId], callback);
  }

  static isUserInWorkspace(workspaceId, userId, callback) {
    db.get(
      'SELECT 1 FROM workspace_users WHERE workspace_id = ? AND user_id = ?',
      [workspaceId, userId],
      (err, row) => {
        if (err) return callback(err);
        callback(null, row !== undefined);
      }
    );
  }
}

module.exports = Workspace;
