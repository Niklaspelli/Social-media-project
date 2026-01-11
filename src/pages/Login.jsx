import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../api/api";
import "./waves.css";
import "./logintemplate.css";

const Login = ({ onSwitchToSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      // Login request
      const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response:", data);

      const { userId, avatar, accessToken } = data;

      // Spara inloggning i context + localStorage
      login(username, userId, avatar, accessToken);
      localStorage.setItem("accessToken", accessToken);

      // Uppdatera last seen
      await apiFetch("/friends/last-seen", {
        method: "PUT",
      });

      // Navigera till användarsidan
      navigate(`/user/${userId}`);
    } catch (err) {
      console.error(err);
      setError("Username or password is incorrect!");
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(23px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          zIndex: 2,
          position: "relative",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div className="flipper">
          <div className="login-form-center">
            <div className="login-box">
              <div className="wave-container">
                <div className="wave grey-wave"></div>
                <div className="wave white-wave"></div>
              </div>
              <Row className="justify-content-center">
                <Col md={6} lg={10}>
                  {isLoading && (
                    <div className="alert alert-info">Logging in...</div>
                  )}
                  {error && (
                    <div
                      className="alert alert-danger"
                      ref={errRef}
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <div className="input-box">
                        <div className="input-wrapper">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="input-icon"
                          />
                          <Form.Control
                            id="username"
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                          <label htmlFor="username">Username</label>
                          <div className="b-line"></div>
                        </div>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div className="input-box">
                        <div className="input-wrapper">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="input-icon"
                          />
                          <Form.Control
                            id="password"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <label htmlFor="password">Password</label>
                          <div className="b-line"></div>
                        </div>
                      </div>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="light"
                        className="btn"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>

                      {onSwitchToSignUp && (
                        <Button
                          variant="light"
                          className="btn mt-3"
                          onClick={onSwitchToSignUp}
                        >
                          Sign up
                        </Button>
                      )}
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none mt-2 d-block text-light"
                    >
                      Forgot password?
                    </Link>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
