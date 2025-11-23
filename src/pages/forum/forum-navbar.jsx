import useGetSubjects from "../../queryHooks/subjects/useGetSubjects";
import { Link, useNavigate } from "react-router-dom";

import { Navbar, Nav, Button, Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import "./forum-styling.css";

const ForumNavbar = ({ subjects }) => {
  const { subjectId } = useParams();

  console.log("sub id,", subjectId);

  return (
    <>
      <Navbar expand="lg" sticky="top" className="forum-navbar">
        <Nav>
          <Nav.Item>
            <FontAwesomeIcon icon={faComments} className="me-2" />
          </Nav.Item>
          {subjects.map((subject) => (
            <Nav.Item
              key={subject.subject_id}
              as={Link}
              to={`subject/${subject.subject_id}`}
              className={`nav-link ${
                parseInt(subjectId, 10) === subject.subject_id ? "active" : ""
              }`}
            >
              {subject.title}
            </Nav.Item>
          ))}
        </Nav>
      </Navbar>
    </>
  );
};

export default ForumNavbar;
