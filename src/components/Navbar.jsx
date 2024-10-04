import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path accordingly
import "../index.css";

const Navbar = () => {
  const { isAuthenticated, authData, logout: authLogout } = useAuth(); // Access auth state from context
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
              <Link to={"/"}>Sign In/ Sign Up</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to={`/profile/${authData.userId}`}>Profile</Link>
              </li>
              <li>
                <Link to={"/forum"}>Forum</Link>
              </li>
              <li>
                <div
                  onClick={logout}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    position: "relative",
                    left: "30px",
                  }}
                >
                  Logout
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
