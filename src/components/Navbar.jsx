import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fakeAuth from "../auth/fakeAuth";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // Assuming you want to store userId
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(fakeAuth.isAuthenticated);
    const storedUserId = localStorage.getItem("Id"); // Assuming you store userId in localStorage
    setUserId(storedUserId);
  }, []);

  const logout = () => {
    fakeAuth.signOut(() => {
      navigate("/");
    });
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          {!fakeAuth.isAuthenticated ? (
            <Link to={"/login"}>Sign In/ Sign Up</Link>
          ) : (
            <span onClick={logout}>Logout</span>
          )}
        </li>
        <li>
          <Link to="/forum">Forum {isAuthenticated ? "" : "🔒"}</Link>
        </li>
        {isAuthenticated &&
          userId && ( // Check if authenticated and userId exists
            <li>
              <Link to={`/profile/${userId}`}>Go to Profile</Link>
            </li>
          )}
      </ul>
    </nav>
  );
};

export default Navbar;
