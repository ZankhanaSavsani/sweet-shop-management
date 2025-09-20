import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validateField = (name: string, value: string) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'username':
        if (!value) {
          errors.username = 'Username is required';
        } else if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else {
          delete errors.username;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleInputChange = (name: string, value: string) => {
    validateField(name, value);
    
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'username':
        setUsername(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate all fields
    validateField('email', email);
    validateField('password', password);
    if (!isLogin) {
      validateField('username', username);
    }
    
    // Check if there are any validation errors
    if (Object.keys(fieldErrors).length > 0) {
      setLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? '🍭 Welcome Back!' : '🍬 Join Our Sweet Shop!'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>👤 Username</label>
            <div className={`input-container ${fieldErrors.username ? 'error' : username && !fieldErrors.username ? 'success' : ''}`}>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
              <span className="input-icon">👤</span>
            </div>
            {fieldErrors.username && (
              <div className="error-message">{fieldErrors.username}</div>
            )}
          </div>
        )}
        
        <div className="form-group">
          <label>📧 Email</label>
          <div className={`input-container ${fieldErrors.email ? 'error' : email && !fieldErrors.email ? 'success' : ''}`}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            <span className="input-icon">📧</span>
          </div>
          {fieldErrors.email && (
            <div className="error-message">{fieldErrors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label>🔒 Password</label>
          <div className={`input-container ${fieldErrors.password ? 'error' : password && !fieldErrors.password ? 'success' : ''}`}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          {fieldErrors.password && (
            <div className="error-message">{fieldErrors.password}</div>
          )}
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      
      <button 
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '15px', background: 'linear-gradient(135deg, #ffd93d, #ffb347)' }}
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};

export default Login;