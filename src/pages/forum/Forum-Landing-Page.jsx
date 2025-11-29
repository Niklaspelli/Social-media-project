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

  // This hook must ALWAYS run
  const { data, isLoading, error } = useForumOverview({});

  const subjects = data?.subjects || [];

  useEffect(() => {
    if (!isLoading && subjects.length > 0 && location.pathname === "/forum") {
      navigate(`subject/${subjects[0].subject_id}`);
    }
  }, [subjects, navigate, location.pathname, isLoading]);

  return (
    <Container fluid>
      {isLoading && <p>Loading forum...</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      {!isLoading && !error && (
        <>
          <Row className="my-3">
            <Col className="d-flex justify-content-center">
              <ForumNavbar subjects={subjects} />
            </Col>
          </Row>

          <Row className="align-items-start">
            <Col lg={2} md={6} sm={12}>
              <ActivityFeed onSelectThread={setSelectedThreadId} />
            </Col>

            <Col lg={8} md={6} sm={12}>
              <Outlet />
              {selectedThreadId && <ThreadDetail threadId={selectedThreadId} />}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ForumLandingPage;
