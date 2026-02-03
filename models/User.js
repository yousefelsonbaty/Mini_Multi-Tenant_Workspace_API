const db = require('./database');

class User {
  static create(name, email, callback) {
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
      if (err) return callback(err);
      User.findById(this.lastID, callback);
    });
  }

  static findAll(callback) {
    db.all('SELECT * FROM users ORDER BY created_at DESC', [], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }

  static findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }
}

module.exports = User;
