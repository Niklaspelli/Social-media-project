import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ActivityFeed from "./ActivityFeed";
import ForumNavbar from "./forum-navbar";
import ThreadDetail from "./thread/ThreadDetail";
import useGetSubjects from "../../queryHooks/subjects/useGetSubjects";
import "./forum-styling.css";

const ForumLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: subjects, isLoading, error } = useGetSubjects();
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  if (isLoading) return <p>Loading subjects...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  // Navigera automatiskt till första subject **endast om vi är på /forum**
  useEffect(() => {
    if (subjects?.length > 0 && location.pathname === "/forum") {
      navigate(`subject/${subjects[0].subject_id}`);
    }
  }, [subjects, navigate, location.pathname]);

  return (
    <Container fluid>
      <ForumNavbar subjects={subjects} />

      <Row>
        {/* Vänster: ActivityFeed */}
        <Col lg={3} md={12}>
          <ActivityFeed onSelectThread={setSelectedThreadId} />
        </Col>

        {/* Höger: Navbar + SubjectPage via Outlet */}
        <Col lg={9} md={12}>
          <Outlet />
          {selectedThreadId && <ThreadDetail threadId={selectedThreadId} />}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumLandingPage;
