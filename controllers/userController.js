const User = require('../models/User');

// Create a new user
exports.createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if email already exists
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to check email'
        });
      }

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      User.create(name, email, (err, user) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to create user'
          });
        }

        res.status(201).json({
          success: true,
          data: user
        });
      });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

// Get all users
exports.getAllUsers = (req, res) => {
  try {
    User.findAll((err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch users'
        });
      }

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get user by ID
exports.getUserById = (req, res) => {
  try {
    const { id } = req.params;
    
    User.findById(id, (err, user) => {
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

      res.status(200).json({
        success: true,
        data: user
      });
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};
