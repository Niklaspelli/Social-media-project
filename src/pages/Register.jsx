import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import CreateAccountLoader from "../components/CreateAccountLoader";

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

  // Fetch CSRF token when the component is mounted
  useEffect(() => {
    userRef.current.focus();

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/csrf-token", {
          method: "GET",
          credentials: "include", // To include cookies
        });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        } else {
          setErrMsg("Failed to fetch CSRF token.");
        }
      } catch (error) {
        setErrMsg("Error fetching CSRF token.");
      }
    };

    fetchCsrfToken();
  }, []);

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

    if (!csrfToken) {
      setErrMsg("CSRF Token is missing!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-TOKEN": csrfToken, // Send CSRF token in the headers
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies for session management
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
    <Container className="mt-5">
      {success ? (
        <section className="text-center">
          <h2>Lyckad registrering!</h2>
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

          <Row className="justify-content-center">
            <Col md={6} lg={7}>
              {/* Username */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Username
                  <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validName || !username ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "2px solid white",
                  }}
                />
                <Form.Text
                  id="uidnote"
                  className={
                    userFocus && username && !validName
                      ? "instructions"
                      : "offscreen"
                  }
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> 4–24 tecken. Börjar
                  med en bokstav. Tillåtna: bokstäver, siffror, - och _.
                </Form.Text>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Password
                  <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validPwd || !password ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "2px solid white",
                  }}
                />
                <Form.Text
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd ? "instructions" : "offscreen"
                  }
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> 8–24 tecken. Måste
                  innehålla stora och små bokstäver, en siffra och ett
                  specialtecken (!@#$%).
                </Form.Text>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Repeat password
                  <span className={validMatch && matchPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={validMatch || !matchPwd ? "hide" : "invalid"}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "2px solid white",
                  }}
                />
                <Form.Text
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch ? "instructions" : "offscreen"
                  }
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> Måste matcha
                  lösenordet.
                </Form.Text>
              </Form.Group>

              {/*   <Button
                variant="dark"
                className="mt-4"
                width={100}
                disabled={!validName || !validPwd || !validMatch}
                type="submit"
              >
                <span className="bn31span">Register</span>
              </Button> */}
              {!isCreating ? (
                <Button
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
        </Form>
      )}
    </Container>
  );
}

export default Register;
