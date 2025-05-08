import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Button, Container, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faComments,
  faSignOutAlt,
  faUser,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar"; // Import the new SearchBar component

const HeaderNavbar = () => {
  const { isAuthenticated, authData, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const currentUser = authData?.username;
  const NavbarAvatar = authData?.avatar;

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
                    <span className="text-success me-2">Hi, {currentUser}</span>
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

                {/* Use the SearchBar component */}
                <SearchBar />

                <Nav.Link as={Link} to={`/user/${authData.userId}`}>
                  <FontAwesomeIcon icon={faUser} className="me-1" /> Profile
                </Nav.Link>
                <Nav.Link as={Link} to={`/friends/${authData.userId}`}>
                  <FontAwesomeIcon icon={faUserFriends} className="me-1" />{" "}
                  Friends
                </Nav.Link>
                <Nav.Link as={Link} to={`/settings/${authData.userId}`}>
                  <FontAwesomeIcon icon={faUserEdit} className="me-1" />{" "}
                  Settings
                </Nav.Link>
                <Nav.Link as={Link} to="/forum">
                  <FontAwesomeIcon icon={faComments} className="me-1" /> Forum
                </Nav.Link>
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
