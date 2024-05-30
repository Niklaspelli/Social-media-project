import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "./auth/fakeAuth";
import Blog from "./NewBlog/Blog";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(username || "");
  const [token, setToken] = useState(localStorage.getItem("token")); // Use state for token

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const isAuthenticated = location.state?.isAuthenticated;

    if (!token || !storedUsername) {
      navigate("/signin");
      return;
    }

    setIsAuthenticated(fakeAuth.isAuthenticated);
    setCurrentUsername(storedUsername);
    setToken(localStorage.getItem("token")); // Update token state
  }, [navigate, location.state, token]);

  return (
    <>
      <h2>
        Du är inne i userProfilen{" "}
        {currentUsername && (
          <p>
            Du är inloggad som:
            <div className="username"> {currentUsername}</div>{" "}
          </p>
        )}
      </h2>
      <p>Ser du det här, då är du inne innanför protectedroute</p>
      <Blog token={token} currentUsername={currentUsername} />{" "}
      {/* Pass token and currentUsername as props */}
    </>
  );
};

export default UserProfile;
