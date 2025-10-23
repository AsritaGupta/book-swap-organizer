import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Fill all fields' });
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email: email.trim().toLowerCase(), password: hashed });
    await newUser.save();
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json(user.notifications || []);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch notifications' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch profile" });
  }
});
export default router;

