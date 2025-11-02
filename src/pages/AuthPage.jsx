import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Container, Row, Col, Button } from "react-bootstrap";

const AuthPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Container fluid>
      <Row>
        {/* Column: Form Section */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div style={formContainerStyle}>
            {showSignUp ? (
              <Register />
            ) : (
              <Login onSwitchToSignUp={() => setShowSignUp(true)} />
            )}

            {showSignUp && (
              <Button
                variant="dark"
                style={{ margin: "20px" }}
                onClick={() => setShowSignUp(false)}
              >
                Back to login
              </Button>
            )}
          </div>
        </Col>

        {/* Column: Background Image */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div style={logoMaskContainer}>
            <h1 style={logoMaskedText}>Heavy Forum</h1>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;

const formContainerStyle = {
  width: "100%",
  backgroundSize: "cover",
  alignItems: "center",
  color: "white",
};

const logoMaskContainer = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const logoMaskedText = {
  fontSize: "10vw", // responsive, scales with screen width
  fontWeight: "bold",
  textTransform: "uppercase",
  textAlign: "center",
  width: "100%",
  backgroundImage: "url('keyboard.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  margin: 0,
};
