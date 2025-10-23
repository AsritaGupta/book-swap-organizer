import express from 'express';
import Book from '../models/Book.js';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({}).populate('owner', 'name email');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, author, genre, condition, availableForSwap } = req.body;
    const owner = req.user;
    const book = new Book({ title, author, genre, condition, owner, availableForSwap });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/swap', auth, async (req, res) => {
  try {
    const { bookId, ownerId } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    owner.notifications.push(`Swap request received for book: ${bookId}`);
    await owner.save();
    res.json({ message: 'Swap request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Could not send swap request' });
  }
});

export default router;
