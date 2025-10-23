import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  condition: { type: String, default: "Good" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availableForSwap: { type: Boolean, default: true }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;

