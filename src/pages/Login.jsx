import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Login = ({ onSwitchToSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const errRef = useRef();

  const navigate = useNavigate();
  const { login, isAuthenticated, authData, csrfToken, fetchCsrfToken } =
    useAuth();

  // 🔐 Hämta CSRF-token om den inte finns
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/user/${authData.id}`);
      return;
    }
    if (!csrfToken) {
      fetchCsrfToken();
    }
  }, [isAuthenticated, navigate, authData, csrfToken, fetchCsrfToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }

    if (!csrfToken) {
      setError("Missing CSRF token.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { userId, avatar, accessToken, csrfToken: newCsrf } = data;

        login(username, userId, avatar, accessToken);
        localStorage.setItem("accessToken", accessToken);

        // 🔁 Uppdatera CSRF-token från svar om den finns
        if (newCsrf) {
          fetchCsrfToken(); // eller setCsrfToken(newCsrf);
        }

        // Navigera
        navigate(`/user/${userId}`);

        // Uppdatera last seen
        await fetch("http://localhost:5000/api/auth/update-last-seen", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid username or password");
      }
    } catch (err) {
      setError(err.message || "Unexpected error.");
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={7}>
          {isLoading && <div className="alert alert-info">Logging in...</div>}
          {error && (
            <div className="alert alert-danger" ref={errRef} role="alert">
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
