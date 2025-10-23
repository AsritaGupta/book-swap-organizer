import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState("");
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    condition: 'Good',
    availableForSwap: true,
  });
  const [notifications, setNotifications] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchBooks(token);
      fetchNotifications(token);
      fetchProfile(token);
      fetchSentRequests(token);
    }
    // eslint-disable-next-line
  }, []);

  const fetchBooks = async (token) => {
    try {
      const res = await axios.get('https://book-swap-organizer.onrender.com/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching books:', err.response?.data || err.message);
    }
  };

  const fetchNotifications = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchSentRequests = async (token) => {
  try {
    const res = await axios.get('http://localhost:5000/api/swaps/sent', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSentRequests(res.data);
  } catch (err) {
    console.error('Error fetching sent swap requests:', err);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook({
      ...newBook,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBook({ title: '', author: '', genre: '', condition: 'Good', availableForSwap: true });
      fetchBooks(token);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error adding book:', err.response?.data || err.message);
    }
  };

const handleSwapRequest = async (bookId, owner) => {
  const token = localStorage.getItem('token');
  const ownerId = (owner && owner._id) ? owner._id : owner;
  try {
    await axios.post(
      'http://localhost:5000/api/swaps/request', // <-- changed path!
      { bookId, ownerId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    alert('Swap request sent!');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert("Error: " + err.response.data.message);
    } else {
      alert('Error sending request');
    }
  }
};

const fetchProfile = async (token) => {
  try {
    const res = await axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsername(res.data.name);
  } catch (err) {
    setUsername("Unknown User");
  }
};

  return (
    <div style={{ width: '96%', maxWidth: 900, margin: '44px auto', padding: 30, background: '#f8f9fa', borderRadius: 18, boxShadow: '0px 4px 28px 0 rgba(33,33,71,0.13)' }}>
       <div style={{textAlign:"right", marginBottom: 6, color:"#555", fontWeight:500, fontSize:17}}>
      Logged in as: {username}
    </div>
      <h2 style={{ color: '#4361ee', textAlign: 'center', fontWeight: 700, fontSize: 33, margin: '0 0 32px' }}>Book Swap Organizer</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 15, alignItems: 'center', padding: "24px 18px", background: '#fff', borderRadius: 12, boxShadow: '0 1px 12px 0 rgba(67,97,238,0.09)', marginBottom: 32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
        <input name="title" placeholder="Title" value={newBook.title} onChange={handleChange} required style={{ padding: 12, borderRadius: 5, border: '1px solid #bbb', fontSize: 15, flex: '1 1 140px' }} />
        <input name="author" placeholder="Author" value={newBook.author} onChange={handleChange} required style={{ padding: 12, borderRadius: 5, border: '1px solid #bbb', fontSize: 15, flex: '1 1 140px' }} />
        <input name="genre" placeholder="Genre" value={newBook.genre} onChange={handleChange} style={{ padding: 12, borderRadius: 5, border: '1px solid #bbb', fontSize: 15, flex: '1 1 140px' }} />
        <input name="condition" placeholder="Condition" value={newBook.condition} onChange={handleChange} style={{ padding: 12, borderRadius: 5, border: '1px solid #bbb', fontSize: 15, flex: '1 1 140px' }} />
        <label style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: 14, marginLeft: 6 }}>
          Available:
          <input type="checkbox" name="availableForSwap" checked={newBook.availableForSwap} onChange={handleChange} style={{ marginLeft: 7, width: 20, height: 20 }} />
        </label>
        <button type="submit" style={{ background: 'linear-gradient(to right, #5e60ce, #4361ee)', color: '#fff', borderRadius: 5, border: "none", padding: "14px 26px", fontWeight: 700, fontSize: 17, cursor: "pointer" }}>Add Book</button>
      </form>
      <h3 style={{ color: "#4361ee", fontWeight: 700, marginTop: 22, marginBottom: 16, textAlign: "center", fontSize: 23 }}>Available Books</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 18, marginBottom: 18 }}>
        {books.map((book) => (
          <div key={book._id} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '14px', padding: '18px', margin: '10px', width: '230px', boxShadow: '0 2px 8px 0 rgba(67,97,238,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h4 style={{ marginBottom: 9, color: '#121212', fontSize: 18 }}>{book.title}</h4>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>Author: {book.author}</p>
            <p style={{ margin: "0 0 6px", color: '#555', fontSize: 14 }}>Genre: {book.genre}</p>
            <p style={{ margin: "0 0 6px", color: '#555', fontSize: 14 }}>Condition: {book.condition}</p>
            <p style={book.availableForSwap ? { fontWeight: 700, color: "#198754" } : { fontWeight: 700, color: "#e63946" }}>
              {book.availableForSwap ? 'Available for Swap' : 'Not Available'}
            </p>
            <button
              style={{ background: "#4361ee", color: "#fff", borderRadius: 4, border: 'none', padding: '7px 18px', marginTop: 12, cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleSwapRequest(book._id, (book.owner && book.owner._id) ? book.owner._id : book.owner)}
              disabled={!book.availableForSwap}
            >
              {book.availableForSwap ? "Request Swap" : "Not Available"}
            </button>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 30, color: "#5e60ce" }}>Notifications</h3>
      {notifications.length === 0 ? (
        <p style={{ color: "#555" }}>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx} style={{ color: "#222", margin: "6px 0" }}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
