import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import CreateAccountLoader from "../components/CreateAccountLoader";
import "./logintemplate.css";

const USER_REGEX = /^[A-Öa-ö][A-z0-9-_åäöÅÄÖ]{3,23}$/;
const PWD_REGEX =
  /^(?=.*[a-zåäö])(?=.*[A-ÖÅÄÖ])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState(""); // Store the CSRF token
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
  }, [password, matchPwd]);

  const handleSubmit = async (e) => {
    setIsCreating(true);

    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Network error");
      }

      const data = await response.json();
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 6000));

      setSuccess(true);
      setErrMsg("");
    } catch (err) {
      setErrMsg("Registration Failed");
      errRef.current?.focus();
    }
  };

  return (
    <Container fluid>
      <div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(23px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 0,
          position: "fixed", // måste vara positionerad
        }}
      />

      {success ? (
        <section className="text-center text-white fs-4 font-bold">
          <h2>
            Congratulations, your account has been succesfully created, enjoy!{" "}
          </h2>
          <p>
            <a href="/">Login</a>
          </p>
        </section>
      ) : (
        <Form>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
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
                      {/* Username */}
                      <Form.Group className="mb-3">
                        <div className="input-box">
                          {" "}
                          <div className="input-wrapper">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="input-icon"
                            />
                            <Form.Label>
                              <span className={validName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              <span
                                className={
                                  validName || !username ? "hide" : "invalid"
                                }
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </span>
                            </Form.Label>
                            <Form.Control
                              id="register-username"
                              type="text"
                              placeholder="username"
                              ref={userRef}
                              autoComplete="off"
                              onChange={(e) => setUsername(e.target.value)}
                              required
                              aria-invalid={validName ? "false" : "true"}
                              aria-describedby="uidnote"
                              onFocus={() => setUserFocus(true)}
                              onBlur={() => setUserFocus(false)}
                            />
                            <label htmlFor="register-username">Username</label>
                            <div className="b-line"></div>
                          </div>{" "}
                        </div>

                        {userFocus && !validName && (
                          <div className="input-info">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Börjar med en bokstav. Tillåtna: bokstäver, siffror,
                            - och _.
                          </div>
                        )}
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3">
                        <div className="input-box">
                          {" "}
                          <div className="input-wrapper">
                            <FontAwesomeIcon
                              icon={faLock}
                              className="input-icon"
                            />
                            <Form.Label>
                              <span className={validPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              <span
                                className={
                                  validPwd || !password ? "hide" : "invalid"
                                }
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </span>
                            </Form.Label>
                            <Form.Control
                              id="register-password"
                              type="password"
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              aria-invalid={validPwd ? "false" : "true"}
                              aria-describedby="pwdnote"
                              onFocus={() => setPwdFocus(true)}
                              onBlur={() => setPwdFocus(false)}
                            />
                            <label htmlFor="password">Password</label>
                            <div className="b-line"></div>
                          </div>
                          {pwdFocus && !validPwd && (
                            <div className="input-info">
                              <FontAwesomeIcon icon={faInfoCircle} />
                              8–24 tecken. Måste innehålla stora och små
                              bokstäver, en siffra och ett specialtecken
                              (!@#$%).
                            </div>
                          )}
                        </div>
                      </Form.Group>

                      {/* Confirm Password */}
                      <Form.Group className="mb-3">
                        <div className="input-box">
                          {" "}
                          <div className="input-wrapper">
                            <FontAwesomeIcon
                              icon={faLock}
                              className="input-icon"
                            />
                            <Form.Label>
                              <span
                                className={
                                  validMatch && matchPwd ? "valid" : "hide"
                                }
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              <span
                                className={
                                  validMatch || !matchPwd ? "hide" : "invalid"
                                }
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </span>
                            </Form.Label>
                            <Form.Control
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm Password"
                              onChange={(e) => setMatchPwd(e.target.value)}
                              required
                              aria-invalid={validMatch ? "false" : "true"}
                              aria-describedby="confirmnote"
                              onFocus={() => setMatchFocus(true)}
                              onBlur={() => setMatchFocus(false)}
                            />
                            <label htmlFor="confirm-password">
                              Confirm Password
                            </label>
                            <div className="b-line"></div>
                          </div>
                          {/*   <Form.Text
                            id="confirmnote"
                            className={
                              matchFocus && !validMatch
                                ? "instructions"
                                : "offscreen"
                            }
                            style={{ color: "white" }}
                          >
                            <FontAwesomeIcon icon={faInfoCircle} /> Måste matcha
                            lösenordet.
                          </Form.Text> */}
                          {matchFocus && !validMatch && (
                            <div className="input-info">
                              <FontAwesomeIcon icon={faInfoCircle} />
                              Måste matcha lösenordet.
                            </div>
                          )}
                        </div>
                      </Form.Group>

                      {!isCreating ? (
                        <Button
                          variant="light"
                          className="btn mt-3"
                          onClick={handleSubmit}
                          disabled={!validName || !validPwd || !validMatch}
                        >
                          Create Account
                        </Button>
                      ) : (
                        <CreateAccountLoader />
                      )}
                    </Col>
                  </Row>
                </div>{" "}
              </div>{" "}
            </div>
          </div>
        </Form>
      )}
    </Container>
  );
}

export default Register;
