import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Button, Container, Image } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faSignOutAlt,
  faUser,
  faUserFriends,
  faStream,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import useGetSubjects from "../queryHooks/subjects/useGetSubjects";
import useGetFriendRequestCount from "../queryHooks/friends/useGetFriendRequestCount";
import useEventInvitationCount from "../queryHooks/events/useInvitationCount";

const HeaderNavbar = () => {
  const { isAuthenticated, authData, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const currentUser = authData?.username;
  const NavbarAvatar = authData?.avatar;

  const { data: notificationCountData } = useGetFriendRequestCount(
    authData?.userId,
    authData?.accessToken
  );

  const { data: invitationCountData } = useEventInvitationCount(
    authData?.accessToken
  );
  const invitationCount = invitationCountData?.count || 0;

  const friendRequestCount = notificationCountData?.count || 0;
  const { data: subjects, isLoading, error } = useGetSubjects();

  if (isLoading) return <p>Loading subjects...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

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
                <Nav.Link as={Link} to={`/notifications/${authData.userId}`}>
                  <FontAwesomeIcon icon={faBell} className="me-1" />{" "}
                  Notifications
                  {friendRequestCount + invitationCount > 0 && (
                    <span
                      className="badge rounded-pill bg-danger ms-1"
                      style={{ fontSize: "0.75rem", verticalAlign: "middle" }}
                    >
                      {friendRequestCount + invitationCount}
                    </span>
                  )}
                </Nav.Link>
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
                </Nav.Link>
                <NavDropdown title={<> Events</>} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to={`/events/create`}>
                    Create event
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/events/${authData.userId}`}>
                    Your events
                  </NavDropdown.Item>
                </NavDropdown>

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
