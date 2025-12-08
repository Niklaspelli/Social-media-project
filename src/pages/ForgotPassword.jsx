import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCheck,
  faTimes,
  faInfoCircle,
  faLock,
  faUser,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../api/api";
import "./logintemplate.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [matchFocus, setMatchFocus] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email }),
      });
      setMessage(
        res.message || "If the account exists, a reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center vh-200">
        <Col xs={10} sm={8} md={6} lg={5}>
          <div className="login-box">
            <h2 className="text-center mb-4">Forgot Password</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              {" "}
              <div className="input-box">
                {" "}
                <div className="input-wrapper">
                  <Form.Group className="mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <label htmlFor="register-email">Email</label>
                    <div className="b-line"></div>

                    <Form.Control
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="d-grid gap-2">
                <Button type="submit" variant="light" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </Form>
          </div>
          <Button
            variant="light"
            className="btn mt-3"
            onClick={() => {
              navigate("/auth", { replace: true });
            }}
          >
            Back to Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
