/* import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Container, Row, Col, Button } from "react-bootstrap";

const AuthPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Container fluid>
      <Row style={{ height: "100vh", backgroundColor: "black" }}>
        {showSignUp ? (
          <Register />
        ) : (
          <Login onSwitchToSignUp={() => setShowSignUp(true)} />
        )}

        {/* Optional: You could add a button here to switch back */
/*         {showSignUp && (
          <Button
            variant="dark"
            style={{ margin: "20px" }}
            onClick={() => setShowSignUp(false)}
          >
            Tillbaka till inloggning
          </Button>
        )}
      </Row>
    </Container>
  );
};

export default AuthPage; */
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Container, Row, Col, Button } from "react-bootstrap";

const AuthPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        {/* Column: Form Section */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
          // Ensures form takes up full height
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
          style={backgroundImage}
          className="d-flex align-items-center justify-content-center"
        ></Col>
      </Row>
    </Container>
  );
};

export default AuthPage;

const formContainerStyle = {
  width: "100%",
  padding: "20px",
  background: "linear-gradient(rgb(0, 0, 0), rgb(54, 54, 54))",
  backgroundSize: "cover",
  alignItems: "center",
  color: "white",
  height: "100%", // Ensure the image takes up the full height
};

const backgroundImage = {
  backgroundImage: "url('keyboard.jpg')", // Adjust the path to your image file
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "100%", // Ensure the image takes up the full height

  backgroundColor: " hsla(0, 0%, 13%, 0.336)",
  backdropFilter: "blur(8px)",
};
