import Book from 'backend/models/Book.js';

export const addBook = async (req, res) => {
  const { title, author, owner } = req.body;
  const book = new Book({ title, author, owner });
  await book.save();
  res.json(book);
};

export const getBooks = async (req, res) => {
  const books = await Book.find().populate('owner', 'name email');
  res.json(books);
};
