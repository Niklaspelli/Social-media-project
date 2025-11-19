import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Container fluid style={logoMaskContainer}>
      <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
        {/* Flip container */}
        <motion.div
          className="flip-container"
          animate={{
            rotateY: showSignUp ? 180 : 0,
            boxShadow: showSignUp
              ? "0 20px 50px rgba(251,50,164,0.4)"
              : "0 20px 50px rgba(0,0,0,0.4)",
          }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          style={{
            margin: "auto",
            perspective: 1600,
            width: "620px",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          <div
            className="flipper"
            style={{
              width: "100%",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            {/* FRONT – Login */}
            <div
              className="front"
              style={{
                backfaceVisibility: "hidden",
                position: "absolute",
                inset: 0,
                pointerEvents: showSignUp ? "none" : "auto", // <-- här
              }}
            >
              <Login onSwitchToSignUp={() => setShowSignUp(true)} />
            </div>

            {/* BACK – Register */}
            <div
              className="back"
              style={{
                backfaceVisibility: "hidden",
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                pointerEvents: showSignUp ? "auto" : "none", // <-- här
              }}
            >
              <Register />
              <Button
                variant="light"
                className="mt-3"
                onClick={() => setShowSignUp(false)}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default AuthPage;

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
  fontSize: "10vw",
  fontWeight: "bold",
  textTransform: "uppercase",
  textAlign: "center",
  width: "100%",
  backgroundImage: "url('/keyboard.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  margin: 0,
};
