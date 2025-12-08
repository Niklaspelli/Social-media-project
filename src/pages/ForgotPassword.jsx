import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { apiFetch } from "../api/api";
import "./logintemplate.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <Container fluid className="login-page">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={10} sm={8} md={6} lg={4}>
          <div className="login-box p-4">
            <h2 className="text-center mb-4">Forgot Password</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="light" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
