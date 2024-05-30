import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import fakeAuth from "./auth/fakeAuth";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }
  }, []);

  const login = async () => {
    setCorrectCredentials(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          pwd: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const token = data.token;
      const loggedInUsername = data.username;
      setLoggedInUsername(loggedInUsername);
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUsername", loggedInUsername);
      fakeAuth.signIn(() => {
        setCorrectCredentials(true);
      });

      navigate("/userprofile", { state: { username: loggedInUsername } });
    } catch (error) {
      setCorrectCredentials(false);
      console.error("Login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign in!</h2>
      <label>Username:</label>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} disabled={isLoading}>
        Sign in
      </button>
      {correctCredentials === false && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">
            Wrong username or password, try again!
          </span>
        </div>
      )}
      {isLoading && <div>Laddar...</div>}
      {location.state && location.state.protectedRoute && (
        <div>Snälla logga in</div>
      )}
      {loggedInUsername && (
        <div style={{ color: "red" }}>Welcome, {loggedInUsername}!</div>
      )}
      <Link to="/SignUp">SignUp</Link>
    </div>
  );
};

export default SignIn;
