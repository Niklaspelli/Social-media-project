import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import fakeAuth from "../auth/fakeAuth"; // Placeholder for your authentication logic

const SignIn = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [correctCredentials, setCorrectCredentials] = useState(null); // State for tracking login success/failure
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [loggedInUsername, setLoggedInUsername] = useState(""); // State for storing logged-in username
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for accessing location data

  // Effect to check for a previously logged-in username in local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }
  }, []);

  // Function to handle login logic
  const login = async () => {
    setCorrectCredentials(null);
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/forum/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username, // Sending username as 'user'
          pwd: password, // Sending password as 'pwd'
        }),
      });

      const data = await response.json();

      // Check if the response is not ok
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token and username
      const token = data.token;
      const loggedInUsername = data.username;
      setLoggedInUsername(loggedInUsername);
      localStorage.setItem("token", token); // Store token in local storage
      localStorage.setItem("loggedInUsername", loggedInUsername); // Store username in local storage

      // Simulate authentication
      fakeAuth.signIn(() => {
        setCorrectCredentials(true); // Indicate successful login
      });

      // Navigate to the forum page with state
      navigate("/forum", { state: { username: loggedInUsername } });
    } catch (error) {
      setCorrectCredentials(false); // Indicate failed login
      console.error("Login failed:", error.message); // Log error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    login(); // Call login function
  };

  return (
    <div>
      <h2>Sign in!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Sign in"}{" "}
          {/* Conditional button text */}
        </button>
      </form>
      {correctCredentials === false && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">
            Wrong username or password, try again!
          </span>
        </div>
      )}
      {loggedInUsername && (
        <div style={{ color: "red" }}>Welcome, {loggedInUsername}!</div>
      )}
      <Link to="/SignUp">SignUp</Link> {/* Link to sign-up page */}
    </div>
  );
};

export default SignIn; // Export SignIn component
