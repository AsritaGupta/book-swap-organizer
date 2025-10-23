import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://book-swap-organizer.onrender.com/api/users/register', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Registration successful! You may now login.');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Unable to register user");
      } else {
        setMessage("Unable to register user");
      }
    }
  };

  return (
    <div style={{
      maxWidth: 350,
      margin: '40px auto',
      padding: 30,
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 0 22px 0 rgba(33,33,71,0.08)'
    }}>
      <h2 style={{textAlign: "center", color: "#5e60ce", marginBottom: 30}}>Register</h2>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap: 15}}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: 10, borderRadius: 5, border: "1px solid #bbb", fontSize: 15
          }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: 10, borderRadius: 5, border: "1px solid #bbb", fontSize: 15
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: 10, borderRadius: 5, border: "1px solid #bbb", fontSize: 15
          }}
        />
        <button
          type="submit"
          style={{
            background: 'linear-gradient(to right, #5e60ce, #4361ee)',
            color: '#fff',
            borderRadius: 5,
            border: "none",
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer"
          }}>
          Register
        </button>
      </form>
      <p style={{
        color: message === "Registration successful! You may now login." ? "#198754" : "#e63946",
        margin: "20px 0 0", minHeight: 24, textAlign: "center",
        fontWeight:"bold"
      }}>{message}</p>
      <p style={{textAlign:"center", marginTop: 16}}>
        Already have an account? <Link to="/login" style={{color: "#4361ee"}}>Login here</Link>
      </p>
    </div>
  );
}
