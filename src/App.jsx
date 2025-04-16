import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import FacultyDashboard from'./FacultyDashboard';
import LoginForm from "./LoginForm";
import FacultySignupForm from "./FacultySignupForm.jsx"; 
import StudentSignupForm from "./SignupForm.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import "./App.css";


function App() {
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogin = (userData) => {
      setUserId(userData.facultyId || userData.studentId);
      setIsLoggedIn(true);
      setUserType(userData.hasOwnProperty("facultyId") ? "faculty" : "student");
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setUserId("");
      setUserType(null);
  };

  return (
      <Router>
          <div className="app-container">
              <h1 className="app-title">KL University Hostel Audio Stream</h1>
              <Routes>
                  <Route
                      path="/login"
                      element={!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <Navigate to={userType === "faculty" ? "/faculty" : "/student"} replace />}
                  />
                  <Route
                      path="/signup/student"
                      element={!isLoggedIn ? <StudentSignupForm onLogin={handleLogin} /> : <Navigate to={userType === "faculty" ? "/faculty" : "/student"} replace />}
                  />
                  <Route
                      path="/signup/faculty"
                      element={!isLoggedIn ? <FacultySignupForm onLogin={handleLogin} /> : <Navigate to={userType === "faculty" ? "/faculty" : "/student"} replace />}
                  />
                  <Route
                      path="/faculty"
                      element={isLoggedIn && userType === "faculty" ? <FacultyDashboard userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                      path="/student"
                      element={isLoggedIn && userType === "student" ? <StudentDashboard userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                  />
                  <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;