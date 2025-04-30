import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../index.css";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [error, setError] = useState(null); // Define error state
  const [csrfToken, setCsrfToken] = useState(""); // New state for CSRF token
  const errRef = useRef();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Fetch CSRF token once when the component is mounted
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/forum");
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
    setError(null);

    // Ensure CSRF token is available before sending the request
    if (!csrfToken) {
      setError("CSRF Token is missing!");
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
          navigate("/forum"); // Navigate to the forum page
        } else {
          setError("Authentication failed. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid username or password");
      }
    } catch (err) {
      setError(err.message);
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div className="background-image">
        <h1 className="heavyforum">Heavy Forum</h1>
        <div style={LoginContainerStyle}>
          <div className="glass-container">
            <h2 style={{ textAlign: "center" }}>Logga in:</h2>
            <Container>
              <Row className="justify-content-center align-items-center h-100">
                <Col md={8} lg={4} className="justify-content-center">
                  {isLoading && (
                    <div className="alert alert-info">Loading...</div>
                  )}
                  {loginError && (
                    <div
                      className="alert alert-danger"
                      ref={errRef}
                      role="alert"
                    >
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
                      <Form.Label htmlFor="floatingInputCustom1">
                        Användarnamn:
                      </Form.Label>
                      <Form.Control
                        id="floatingInputCustom1"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        placeholder="Ange ditt användarnamn"
                        aria-label="Username"
                        aria-required="true"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="floatingInputCustom2">
                        Lösenord:
                      </Form.Label>
                      <Form.Control
                        id="floatingInputCustom2"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Ange ditt lösenord"
                        aria-label="Password"
                        aria-required="true"
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        className="bn31"
                        type="submit"
                        disabled={isLoading}
                      >
                        <span className="bn31span">
                          {isLoading ? "Loggar in..." : "Logga in"}
                        </span>
                      </Button>
                    </div>
                  </Form>

                  <div className="text-center mt-3">
                    <p>Inget konto?</p>
                    <Link to="/signup">Registrera dig</Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

const LoginContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

const inputStyle = {
  width: "90%",
  maxWidth: "400px",
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
  backgroundColor: "grey",
  color: "white",
  border: "none",
};
