import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ onLogin }) {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await axios.post('http://13.53.212.171:8081/api/auth/login', {
                studentId: loginId, // No Number() conversion
                password: password,
            });

            if (response.status === 200) {
                const userData = response.data;
                onLogin(userData);

                if (String(loginId).length === 4) {
                    navigate('/faculty');
                } else {
                    navigate('/student');
                }
            } else {
                setLoginError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoginError(error.response.data || 'Invalid credentials');
            } else {
                setLoginError('An error occurred during login.');
            }
            console.error('Login error:', error);
        }
    };
    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <input
                    type="text" // Changed type to "text"
                    placeholder="Student ID / Faculty ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="auth-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    required
                />
                {loginError && <p className="error-message">{loginError}</p>}
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="signup-link">
                Don't have an account? <Link to="/signup/student">Signup as Student</Link> / <Link to="/signup/faculty">Signup as Faculty</Link>
            </p>
        </div>
    );
}

export default LoginForm;