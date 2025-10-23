import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const loggedIn = !!localStorage.getItem('token');

  return (
    <nav style={{
      background: 'linear-gradient(to right, #5e60ce, #4361ee)',
      padding: '18px 32px',
      boxShadow: '0px 2px 8px rgba(94,96,206,0.07)',
      marginBottom: 36,
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 18 }}>Home</Link>
      <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Login</Link>
      <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Register</Link>
      {loggedIn && (
      <Link to="/sent-requests" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>
        Sent Requests
      </Link>
    )}
    {loggedIn && (
  <Link to="/swap-requests" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>
    Swap Requests
  </Link>
)}
      {loggedIn && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: '#e63946',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

