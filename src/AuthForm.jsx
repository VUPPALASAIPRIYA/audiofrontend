// AuthForm.js
import React, { useState } from 'react';

function AuthForm({ onLogin }) {
  const [userId, setUserId] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(userId);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="User ID (4 or 10 digits)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default AuthForm;