// FacultySignupForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function FacultySignupForm({ onLogin }) {
    const [facultyId, setFacultyId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://13.53.212.171:8081/api/auth/signup/faculty', {
                facultyId: facultyId,
                name: name,
                password: password,
            });

            if (response.status === 201) {
                onLogin({ facultyId: facultyId });
                navigate('/faculty');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred during signup.');
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Faculty Signup</h2>
            <form onSubmit={handleSignupSubmit}>
                <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button">Signup</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default FacultySignupForm;