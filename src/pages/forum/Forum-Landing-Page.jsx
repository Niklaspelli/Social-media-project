import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ActivityFeed from "./ActivityFeed";
import ForumNavbar from "./forum-navbar";
import ThreadDetail from "./thread/ThreadDetail";
import { useForumOverview } from "../../queryHooks/threads/useForumOverview";
import "./forum-styling.css";

const ForumLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  // Hämta forum overview (inklusive subjects och threads)
  const { data, isLoading, error } = useForumOverview();
  if (isLoading) return <p>Loading forum...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;
  const subjects = data?.subjects || [];

  // Navigera automatiskt till första subject om vi är på /forum
  /*   useEffect(() => {
    if (subjects?.length > 0 && location.pathname === "/forum") {
      navigate(`subject/${subjects[0].subject_id}`);
    }
  }, [subjects, navigate, location.pathname]); */

  return (
    <Container fluid>
      {/* NAVBAR */}
      <Row className="my-3">
        <Col className="d-flex justify-content-center">
          <ForumNavbar subjects={subjects} />
        </Col>
      </Row>

      {/* MAIN LAYOUT – ActivityFeed + ThreadDetail bredvid varandra */}
      <Row className="align-items-start">
        {/* Left: ActivityFeed */}
        <Col lg={2} md={6} sm={12}>
          <ActivityFeed onSelectThread={setSelectedThreadId} />
        </Col>

        {/* Right: Main content + Thread detail */}
        <Col lg={8} md={6} sm={12}>
          <Outlet />
          {selectedThreadId && <ThreadDetail threadId={selectedThreadId} />}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumLandingPage;
