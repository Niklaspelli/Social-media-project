import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function AccountDeleted() {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* CSS direkt i komponenten */}
      <style>{`
  .icon-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto 35px auto;
}

.icon {
  position: absolute;
  inset: 0;
  font-size: 130px;
  transition: all 0.7s ease;
}

.trash-icon {
  color: white;
}

.check-icon {
  color: #4ade80;
  opacity: 0;
  transform: scale(0.6);
}

/* Lägg dessa sist */
.fade-in {
  opacity: 1;
  transform: scale(1);
}

.fade-out {
  opacity: 0;
  transform: scale(0.6);
}
      `}</style>

      <Container className="text-center text-white py-5">
        <Row className="justify-content-center">
          <Col md="6">
            <div className="icon-wrapper">
              {/* Papperskorg */}
              <FontAwesomeIcon
                icon={faTrash}
                className={`icon trash-icon ${
                  showCheck ? "fade-out" : "fade-in"
                }`}
              />

              {/* Godkänt-kryss */}
              <FontAwesomeIcon
                icon={faCircleCheck}
                className={`icon check-icon ${
                  showCheck ? "fade-in" : "fade-out"
                }`}
              />
            </div>

            <h2>Your account has been successfully deleted.</h2>
            <p>We’re sorry to see you go.</p>

            <p className="mt-4">
              <a href="/auth" className="text-white text-decoration-underline">
                Go to start
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
