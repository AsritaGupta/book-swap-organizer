import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

dotenv.config();
const app = express();
app.use(cors({ origin: 'https://book-swap-organizer-1.onrender.com', credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/swaps', swapRoutes);

app.get('/', (req, res) => res.send('Book Swap API running...'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('MongoDB connected'); })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
