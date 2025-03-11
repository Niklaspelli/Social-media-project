import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the Auth context
import CreateThread from "../components/thread/CreateThread";

const Forum = () => {
  const navigate = useNavigate();
  const { authData, isAuthenticated } = useAuth(); // Access auth data and authentication status

  const currentUser = authData.username; // Get the username from the auth context

  useEffect(() => {
    // Redirect to signin if user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div style={LoginContainerStyle}>
        {currentUser && (
          <h2>
            Du är inloggad som:
            <div className="username"> {currentUser}</div>
          </h2>
        )}
      </div>
      {/* Pass only currentUser as props */}
      <CreateThread currentUser={currentUser} />
    </>
  );
};

export default Forum;

const LoginContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};
