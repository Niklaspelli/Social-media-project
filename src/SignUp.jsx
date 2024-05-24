import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const USER_REGEX = /^[A-Öa-ö][A-z0-9-_åäöÅÄÖ]{3,23}$/;
const PWD_REGEX =
  /^(?=.*[a-zåäö])(?=.*[A-ÖÅÄÖ])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/users";

function SignUp() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //om knappen är eneblad med JS hackning
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, pwd }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrMsg("Registration Failed");
      errRef.current.focus();
    }
  };

  return (
    <Container>
      {success ? (
        <section>
          <h1>Lyckad registrering!</h1>
          <p>
            <a href="/login">Logga in</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Row className="justify-content-center align-items-center h-100">
            <h2>Skapa Konto</h2>
            <Col md={6} lg={4} className="justify-content-center">
              <label htmlFor="floatingInputCustom">
                Användarnamn:
                <span className={validName ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !user ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <Form.Floating
                className="mb-1"
                inline
                style={{ width: "400px", display: "justify-content-center" }}
              >
                <Form.Control
                  type="text"
                  id="floatingInputCustom"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                  }}
                />
              </Form.Floating>
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 till 24 tecken.
                <br />
                Måste börja med en bokstav.
                <br />
                Bokstäver, nummer, understreck, bindesstreck är tillåtet.
              </p>
              <label htmlFor="floatingInputCustom">
                Lösenord:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !validPwd ? "hide" : "invalid"}
                />
              </label>
              <Form.Floating
                className="mb-1"
                inline
                style={{ width: "400px", display: "justify-content-center" }}
              >
                <Form.Control
                  type="password"
                  id="floatingInputCustom"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                  }}
                />
              </Form.Floating>
              <p
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 till 24 tecken.
                <br />
                Måste inkludera både stora och små bokstäver, en siffra och ett
                specialtecken.
                <br />
                Tillåtna specialtecken är:
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
              <label htmlFor="floatingInputCustom">
                Upprepa Lösenord:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPwd ? "hide" : "invalid"}
                />
              </label>
              <Form.Floating
                className="mb-1"
                inline
                style={{ width: "400px", display: "justify-content-center" }}
              >
                <Form.Control
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                  }}
                />
              </Form.Floating>
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Måste vara samma som första lösenordet
              </p>
            </Col>{" "}
          </Row>
          <Button
            style={{ backgroundColor: "black" }}
            disabled={!validName || !validPwd || !validMatch ? true : false}
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Registrera
          </Button>
        </section>
      )}
    </Container>
  );
}

export default SignUp;
