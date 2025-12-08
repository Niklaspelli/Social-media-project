import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./logintemplate.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const PWD_REGEX =
    /^(?=.*[a-zåäö])(?=.*[A-ÖÅÄÖ])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!PWD_REGEX.test(password)) {
      return setError(
        "Lösenordet måste vara 8–24 tecken och innehålla stora, små bokstäver, siffra och specialtecken (!@#$%)."
      );
    }
    if (password !== confirmPassword) {
      return setError("Lösenorden matchar inte.");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ett fel uppstod.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("Ett fel uppstod.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
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
                <Col md={6} lg={7}>
                  <Form onSubmit={handleSubmit}>
                    {/* Password */}
                    <Form.Group className="mb-3">
                      <div className="input-box">
                        <div className="input-wrapper">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="input-icon"
                          />
                          <Form.Control
                            type="password"
                            placeholder="Nytt lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                          />
                          <label>Nytt lösenord</label>
                          <div className="b-line"></div>
                        </div>
                        {pwdFocus && !validPwd && (
                          <div className="input-info">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8–24 tecken. Måste innehålla stora och små
                            bokstäver, en siffra och specialtecken (!@#$%).
                          </div>
                        )}
                      </div>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                      <div className="input-box">
                        <div className="input-wrapper">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="input-icon"
                          />
                          <Form.Control
                            type="password"
                            placeholder="Bekräfta lösenord"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                          />
                          <label>Bekräfta lösenord</label>
                          <div className="b-line"></div>
                        </div>
                        {matchFocus && !validMatch && (
                          <div className="input-info">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Måste matcha lösenordet.
                          </div>
                        )}
                      </div>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        className="btn text-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Återställer..." : "Återställ lösenord"}
                      </Button>
                    </div>

                    {error && <p className="errmsg mt-2">{error}</p>}
                    {message && (
                      <p className="success-message mt-2">{message}</p>
                    )}
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
