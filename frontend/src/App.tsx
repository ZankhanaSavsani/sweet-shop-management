import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import SweetList from './components/SweetList';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'sweets'>('login');

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="sweet-list-container">
        <h2>🍭 Sweet Shop Management</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          Welcome back, {user.username}! Manage your sweet inventory below.
        </p>
        <SweetList />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
