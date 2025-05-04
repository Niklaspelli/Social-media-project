import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path accordingly
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faComments,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../index.css";

const Navbar = () => {
  const { isAuthenticated, authData, logout: authLogout } = useAuth(); // Access auth state from context
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const currentUser = authData?.username;
  const NavbarAvatar = authData?.avatar;

  const toggleSidenav = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout using the Auth context
  const logout = () => {
    authLogout(); // Call the logout function from context
    navigate("/"); // Navigate to home after logging out
  };

  return (
    <div className={`sidenav ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidenav}>
        ☰
      </button>
      <nav className="nav">
        <ul>
          {!isAuthenticated ? (
            <li>
              <Link to={"/"}>Sign In / Sign Up</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to={`/user/${authData.userId}`}>
                  {" "}
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li>
                <Link to={`/settings/${authData.userId}`}>
                  <FontAwesomeIcon icon={faUserEdit} /> Settings
                </Link>
              </li>
              <li>
                <Link to={"/forum"}>
                  <FontAwesomeIcon icon={faComments} /> Forum
                </Link>
              </li>
              <li>
                <button onClick={logout} className="logout-btn">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </li>
              {currentUser && (
                <div className="user-info">
                  <p className="user-greeting">Logged in as:</p>
                  <p className="username">{currentUser}</p>
                  {NavbarAvatar && (
                    <img
                      src={NavbarAvatar}
                      className="user-avatar"
                      alt={`${currentUser}'s avatar`}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
