import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap"; // Importing Bootstrap components
import "../index.css";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(true);
  const errRef = useRef();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/forum/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: username, pwd: password }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the entire response

      if (!response.ok) {
        setCorrectCredentials(false);
        throw new Error(data.error || "Login failed");
      }

      const token = data.token;
      const loggedInUsername = data.username;
      const userId = data.id;
      const avatar = data.avatar;

      login(token, loggedInUsername, userId, avatar);
      navigate("/forum");
    } catch (error) {
      setLoginError(error.message);
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false);
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
                        /* style={{ backgroundColor: "black", margin: "20px" }} */
                        type="submit"
                        disabled={isLoading}
                      >
                        <span className="bn31span">
                          {isLoading ? "Loggar in..." : "Logga in"}
                        </span>
                      </Button>
                    </div>

                    {correctCredentials === false && (
                      <div role="alert" className="alert alert-danger mt-4">
                        <span>
                          Fel användarnamn eller lösenord. Försök igen!
                        </span>
                      </div>
                    )}
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
