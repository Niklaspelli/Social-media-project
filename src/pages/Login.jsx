import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Login = ({ onSwitchToSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [error, setError] = useState(null); // Define error state
  const [csrfToken, setCsrfToken] = useState(""); // New state for CSRF token
  const errRef = useRef();
  const navigate = useNavigate();
  const { login, isAuthenticated, authData } = useAuth();

  // Fetch CSRF token once when the component is mounted
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(`/user/${authData.id}`);
      return; // 🛑 Stop here, don't fetch CSRF token
    }

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/csrf-token",
          {
            method: "GET",
            credentials: "include", // Include cookies for session management
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken); // Store CSRF token in state
        } else {
          setError("Failed to fetch CSRF token.");
        }
      } catch (error) {
        setError("Error fetching CSRF token.");
      }
    };

    fetchCsrfToken();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null); // Reset any previous login error
    setError(null); // Reset general error state

    // Basic form validation
    if (!username || !password) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }

    // Ensure CSRF token is available before sending the request
    if (!csrfToken) {
      setError("CSRF Token is missing!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-TOKEN": csrfToken, // Send CSRF token in the headers
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        const data = await response.json();
        const { userId, avatar, accessToken } = data;

        if (accessToken) {
          // Successful login
          login(username, userId, avatar, accessToken);
          localStorage.setItem("accessToken", accessToken); // Store access token
          navigate(`/user/${userId}`);

          // **Update last_seen time after login**
          const lastSeenResponse = await fetch(
            "http://localhost:5000/api/auth/update-last-seen",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Pass the JWT token in Authorization header
              },
            }
          );

          if (!lastSeenResponse.ok) {
            console.error("Failed to update last seen time");
          } else {
            console.log("Last seen time updated successfully");
          }
        } else {
          setError("Authentication failed. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid username or password");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={7}>
          {isLoading && <div className="alert alert-info">Logging in...</div>}
          {loginError && (
            <div className="alert alert-danger" ref={errRef} role="alert">
              {loginError}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="floatingInputCustom1">Username</Form.Label>
              <Form.Control
                id="floatingInputCustom1"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
                aria-required="true"
                required
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  border: "2px solid white",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="floatingInputCustom2">Password</Form.Label>
              <Form.Control
                id="floatingInputCustom2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                aria-required="true"
                required
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  border: "2px solid white",
                }}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="dark" type="submit" disabled={isLoading}>
                <span className="bn31span">
                  {isLoading ? "Logging in..." : "Login"}
                </span>
              </Button>

              <Button
                variant="dark"
                className="mt-4"
                onClick={onSwitchToSignUp}
              >
                Sign up
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
