import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://book-swap-organizer.onrender.com/api/users/login', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Invalid credentials");
      } else {
        setMessage("Invalid credentials");
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
      <h2 style={{textAlign: "center", color: "#5e60ce", marginBottom: 30}}>Login</h2>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap: 15}}>
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
          Login
        </button>
      </form>
      <p style={{
        color: message === "Login successful!" ? "#198754" : "#e63946",
        margin: "20px 0 0", minHeight: 24, textAlign: "center",
        fontWeight:"bold"
      }}>{message}</p>
      <p style={{textAlign:"center", marginTop: 16}}>
        Don't have an account? <Link to="/register" style={{color: "#4361ee"}}>Register here</Link>
      </p>
    </div>
  );
}
