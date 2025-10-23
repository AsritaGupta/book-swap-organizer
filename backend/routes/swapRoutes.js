import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new swap request
router.post('/request', auth, async (req, res) => {
  try {
    const { bookId, ownerId } = req.body;
    const requesterUser = await User.findById(req.user);
    const bookDoc = await Book.findById(bookId);

    const swap = new SwapRequest({
      book: bookId,
      requester: req.user,
      owner: ownerId
    });
    await swap.save();

    // Add improved notification to owner
    const owner = await User.findById(ownerId);
    owner.notifications.push(
      `Swap requested for your book "${bookDoc.title}" by user "${requesterUser.name}" (${requesterUser.email})`
    );
    await owner.save();

    res.json({ message: 'Swap request sent' });
  } catch (e) {
    res.status(500).json({ message: 'Error creating swap request' });
  }
});

// Get swap requests received (for book owner)
router.get('/received', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ owner: req.user })
      .populate('book requester owner');
    res.json(swaps);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching received swaps' });
  }
});

// Get swap requests sent (for requester)
router.get('/sent', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user })
      .populate('book requester owner');
    res.json(swaps);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching sent swaps' });
  }
});

// Accept swap
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id).populate('book requester owner');
    if (!swap || swap.owner._id.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    swap.status = 'accepted';
    await swap.save();

    // Notify the requester
    const requester = await User.findById(swap.requester._id);
    requester.notifications.push(
      `Your swap request for "${swap.book.title}" was accepted!`
    );
    await requester.save();

    res.json({ message: 'Swap accepted' });
  } catch (e) {
    res.status(500).json({ message: 'Error accepting swap' });
  }
});

// Reject swap
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id).populate('book requester owner');
    if (!swap || swap.owner._id.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    swap.status = 'rejected';
    await swap.save();

    // Notify the requester
    const requester = await User.findById(swap.requester._id);
    requester.notifications.push(
      `Your swap request for "${swap.book.title}" was rejected.`
    );
    await requester.save();

    res.json({ message: 'Swap rejected' });
  } catch (e) {
    res.status(500).json({ message: 'Error rejecting swap' });
  }
});

export default router;
