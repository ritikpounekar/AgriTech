import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  enrollmentNumber: user.enrollmentNumber,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const register = async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password } = req.body;
    if (
      typeof name !== 'string' ||
      typeof enrollmentNumber !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !enrollmentNumber.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const normalizedEnrollmentNumber = enrollmentNumber.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { enrollmentNumber: normalizedEnrollmentNumber },
      ],
    });
    if (exists) {
      const message = exists.enrollmentNumber === normalizedEnrollmentNumber
        ? 'Enrollment number already registered.'
        : 'Email already registered.';
      return res.status(409).json({ message });
    }

    const user = await User.create({
      name: name.trim(),
      enrollmentNumber: normalizedEnrollmentNumber,
      email: normalizedEmail,
      password,
    });
    const token = signToken(user._id);
    res.status(201).json({ token, user: userResponse(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email or enrollment number already registered.' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = signToken(user._id);
    res.json({ token, user: userResponse(user) });
  } catch {
    res.status(500).json({ message: 'Login failed.' });
  }
};

export const getProfile = async (req, res) => {
  res.json(userResponse(req.user));
};
