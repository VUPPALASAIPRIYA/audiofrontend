import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignupForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        hostelName: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const hostels = [
        "Himalaya",
        "Kanchanaganga",
        "Tulips",
        "Vindhya",
        "Aravalli",
        "Staff-Quarters",
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when user starts editing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate studentId (must be exactly 10 digits)
        if (!/^\d{10}$/.test(formData.studentId)) {
            setError("Student ID must be exactly 10 digits.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://13.53.212.171:8081/api/auth/signup/student",
                formData
            );
            if (response.status === 201) {
                alert("Signup successful! Please log in.");
                navigate("/login");
            }
        } catch (error) {
            const errMsg =
                error.response?.data?.message ||
                "Signup failed. Please try again.";
            setError(errMsg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Student ID:</label>
                <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                />

                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Hostel Name:</label>
                <select
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Hostel</option>
                    {hostels.map((hostel) => (
                        <option key={hostel} value={hostel}>
                            {hostel}
                        </option>
                    ))}
                </select>

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default SignupForm;