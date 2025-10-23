import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import SentRequests from './pages/SentRequests';
import SwapRequests from './pages/SwapRequests';

export default function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sent-requests" element={<SentRequests />} />
        <Route path="/swap-requests" element={<SwapRequests />} />
      </Routes>
    </Router>
  );
}

