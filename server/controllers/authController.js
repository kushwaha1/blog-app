const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = new User({
      email,
      password,
      profileImage: req.file ? req.file.path : '',
    });

    await user.save();

    res.status(201).json({ message: 'Account created successfully. Please login.' });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { signup, login, getMe };