import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../auth/fakeAuth";
import CreateThread from "../components/thread/CreateThread";

const Forum = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(
    location.state?.username || localStorage.getItem("loggedInUsername") || ""
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedToken = localStorage.getItem("token");

    // Redirect to signin if no token or username is found
    if (!storedToken || !storedUsername) {
      navigate("/signin");
      return;
    }

    // If token and username exist, set state
    setCurrentUser(storedUsername);
    setToken(storedToken);

    // Set fakeAuth to authenticated
    if (storedToken && fakeAuth.isAuthenticated !== true) {
      fakeAuth.isAuthenticated = true; // Ensure fakeAuth reflects actual state
    }
  }, [navigate]);

  return (
    <>
      {currentUser && (
        <h2>
          Du är inloggad som:
          <div className="username"> {currentUser}</div>
        </h2>
      )}
      <p>Ser du det här, då är du inne innanför protectedroute</p>

      {/* Pass token and currentUser as props */}
      <CreateThread token={token} currentUser={currentUser} />
    </>
  );
};

export default Forum;
