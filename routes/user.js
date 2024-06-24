require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); 
const router = express.Router();

const secretKey = process.env.SECRET_KEY;

// Users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal Server Error: " + error.message
        });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstname, lastname, mobile } = req.body;
        const user = new User({ email, password, firstname, lastname, mobile });
        await user.save();
        const token = jwt.sign({ id: user._id }, secretKey);
        res.status(200).json({
            message: 'User created successfully',
            data: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                token: token
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, secretKey);
        res.status(200).json({
            message: 'User logged-in successfully',
            data: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                token: token
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Middleware to protect routes
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied' });
  }
  const token = authHeader.split(' ')[1]; // Get the token from the header
  if (!token) {
      return res.status(401).json({ message: 'Access denied' });
  }
  try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};

// Logout route with authentication middleware
router.post('/logout', auth, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});



// Protected route example
router.get('/protected', auth, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;
