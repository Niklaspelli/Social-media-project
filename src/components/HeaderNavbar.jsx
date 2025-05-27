import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Button, Container, Image } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faComments,
  faSignOutAlt,
  faUser,
  faUserFriends,
  faStream,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar"; // Import the new SearchBar component
import useGetSubjects from "../queryHooks/subjects/useGetSubjects"; // Import your custom hook
import useGetFriendRequestCount from "../queryHooks/friends/useGetFriendRequestCount";

const HeaderNavbar = () => {
  const { isAuthenticated, authData, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const currentUser = authData?.username;
  const NavbarAvatar = authData?.avatar;

  const { data: notificationCountData } = useGetFriendRequestCount(
    authData?.userId,
    authData?.accessToken
  );
  const friendRequestCount = notificationCountData?.count || 0;
  const { data: subjects, isLoading, error } = useGetSubjects(); // Use custom hook to get subjects

  if (isLoading) return <p>Loading subjects...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  // Handle logout
  const handleLogout = () => {
    authLogout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto align-items-center">
            {!isAuthenticated ? (
              <Nav.Link as={Link} to="/">
                Sign In / Sign Up
              </Nav.Link>
            ) : (
              <>
                {currentUser && (
                  <Nav.Item className="d-flex align-items-center ms-3 m-4">
                    <span className="text-success me-2">
                      Welcome, {currentUser}
                    </span>
                    {NavbarAvatar && (
                      <Image
                        src={NavbarAvatar}
                        roundedCircle
                        height="32"
                        width="32"
                        alt={`${currentUser}'s avatar`}
                      />
                    )}
                  </Nav.Item>
                )}
                <Nav.Link as={Link} to={"/feed/:id"}>
                  <FontAwesomeIcon icon={faStream} className="me-1" /> Feed
                </Nav.Link>
                {/* Use the SearchBar component */}
                <SearchBar />
                <NavDropdown
                  icon={faComments}
                  title={
                    <>
                      {" "}
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to={`/user/${authData.userId}`}>
                    View Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/settings/${authData.userId}`}
                  >
                    Settings
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link
                  as={Link}
                  to={`/friends/${authData.userId}`}
                  className="position-relative"
                >
                  <FontAwesomeIcon icon={faUserFriends} className="me-1" />
                  Friends{" "}
                  {friendRequestCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {friendRequestCount}
                    </span>
                  )}
                </Nav.Link>

                <NavDropdown
                  icon={faComments}
                  title={
                    <>
                      <FontAwesomeIcon icon={faComments} className="me-1" />{" "}
                      Forum
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  {subjects.map((subject) => (
                    <NavDropdown.Item
                      key={subject.id}
                      as={Link}
                      to={`/forum/subject/${subject.id}`}
                    >
                      {subject.name}
                    </NavDropdown.Item>
                  ))}{" "}
                </NavDropdown>

                <Button
                  variant="outline-light"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />{" "}
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNavbar;
