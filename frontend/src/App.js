// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppointmentProvider } from './contexts/AppointmentContext'; // Import the provider
import ChatWindow from './components/chatWindow';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <AppointmentProvider>
      <Router>
        <div style={styles.navbar}>
          <Link to="/" style={styles.link}>
            Chat
          </Link>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<ChatWindow />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppointmentProvider>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    gap: '20px',
    padding: '10px',
    backgroundColor: '#007BFF',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default App;
