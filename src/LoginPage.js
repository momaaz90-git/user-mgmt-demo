import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axiosInstance from './axios';
import './LoginPage.css'; // Link to the CSS file for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error message
    setError('');

    // Simple client-side validation
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    try {
      // Make the API call to authenticate the user
      const response = await axiosInstance.post('/api/login', {
        email,
        password,
      });

      // If successful, store the token and redirect to the Users List page
      localStorage.setItem('authToken', response.data.token);
      navigate('/users'); // Redirect to the Users List page

    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
