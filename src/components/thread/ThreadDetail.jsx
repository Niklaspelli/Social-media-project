import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path accordingly

const BackendURL = "http://localhost:5000";

function ThreadDetail() {
  const { threadId } = useParams();
  const { authData } = useAuth();
  const { username, avatar, accessToken, csrfToken } = authData;
  const [thread, setThread] = useState({});
  const [responses, setResponses] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State to store deletion errors for specific responses
  const [deleteErrors, setDeleteErrors] = useState({});

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetch thread details and responses
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${BackendURL}/api/auth/threads/${threadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch thread");
        }
        const data = await response.json();
        setThread(data.thread);
        setResponses(data.responses);
      } catch (error) {
        console.error("Failed to fetch thread:", error.message);
        setError("Failed to fetch thread. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  // Handle submitting a new response
  const handleResponseSubmit = async (e) => {
    const csrfToken = getCookie("csrfToken"); // You need to implement getCookie

    e.preventDefault();

    try {
      const response = await fetch(
        `${BackendURL}/api/auth/threads/${threadId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "CSRF-TOKEN": csrfToken,
          },
          credentials: "include", // Include cookies in the request

          body: JSON.stringify({ body: responseText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post response");
      }

      const newResponse = await response.json();
      setResponses((prevResponses) => [newResponse.response, ...prevResponses]);
      setResponseText("");
      setSuccess(true);
    } catch (error) {
      console.error("Failed to post response:", error.message);
      setError("Failed to post response. Please try again later.");
    }
  };

  // Handle deleting a response
  const handleDeleteResponse = async (responseId) => {
    try {
      const response = await fetch(
        `${BackendURL}/api/auth/responses/${responseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete response");
      }

      // Update the responses state to remove the deleted response
      setResponses((prevResponses) =>
        prevResponses.filter((res) => res.id !== responseId)
      );

      // Clear the error for this response if deletion was successful
      setDeleteErrors((prevErrors) => ({
        ...prevErrors,
        [responseId]: null,
      }));
    } catch (error) {
      console.error("Failed to delete response:", error.message);
      // Set the error for this specific response
      setDeleteErrors((prevErrors) => ({
        ...prevErrors,
        [responseId]: "Failed to delete response. Please try again later.",
      }));
    }
  };

  if (loading) {
    return <p>Loading thread details...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      {/* Thread Title and Body with Username */}
      <h1 style={{ textAlign: "center" }}>{thread.title}</h1>
      <div style={StyleContainer}>
        <div style={RespContainer}>
          <img
            src={thread.avatar || "default-avatar.jpg"} // Avatar of the thread creator
            alt="avatar"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <div style={textContent}>
            <Link to={`/user/${thread.user_id}`}>
              <strong>{thread.username}</strong>
            </Link>
            <p>{thread.body}</p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              ({new Date(thread.created_at).toLocaleString()})
            </p>
          </div>
        </div>
      </div>

      {/* Responses */}
      <div>
        {responses.length > 0 ? (
          responses.map((res) => (
            <div style={StyleContainer} key={res.id}>
              <div style={threadCreator}>
                <img
                  src={res.avatar || "default-avatar.jpg"} // Avatar for the response poster
                  alt="avatar"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <div style={textContent}>
                  <Link to={`/user/${res.user_id}`}>
                    <strong>{res.username}</strong>
                  </Link>{" "}
                  wrote:
                  <p>{res.body}</p>
                  <p style={{ fontSize: "0.8em", color: "#999" }}>
                    ({new Date(res.created_at).toLocaleString()})
                  </p>
                  {res.userId === authData.id && (
                    <div>
                      <button
                        onClick={() => handleDeleteResponse(res.id)}
                        style={{
                          color: "white",
                          cursor: "pointer",
                          backgroundColor: "red",
                        }}
                      >
                        Delete
                      </button>
                      {deleteErrors[res.id] && (
                        <p style={{ color: "red" }}>{deleteErrors[res.id]}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>

      {/* Response Form */}
      <div style={StyleContainer}>
        <form onSubmit={handleResponseSubmit}>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            style={inputStyle}
            placeholder="Write your response here..."
            required
          ></textarea>
          <button
            type="submit"
            style={{ backgroundColor: "black", margin: "20px" }}
          >
            Post Response
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green" }}>Response posted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ThreadDetail;

const inputStyle = {
  width: "500px",
  height: "200px",

  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
  backgroundColor: "grey",
  color: "white",
  border: "none",
};

const StyleContainer = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};

const threadCreator = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  marginBottom: "15px",
  margin: "5px",

  width: "100%", // Full width of the parent
  maxWidth: "500px", // Limit the max width
  borderRadius: "20px",
  padding: "15px",
  boxSizing: "border-box",
  boxShadow: "2px 2px 0px black",
  backgroundColor: "white",
  background: "hsla(0, 2.70%, 50.00%, 0.78)", // Fully transparent background

  backdropFilter: "blur(8px)", // Blur the background content behind the element
  overflowWrap: "break-word", // Ensure long words break
};

const RespContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  marginBottom: "15px",
  margin: "5px",

  width: "100%", // Full width of the parent
  maxWidth: "500px", // Limit the max width
  borderRadius: "20px",
  padding: "15px",
  boxSizing: "border-box",
  boxShadow: "2px 2px 0px black",
  backgroundColor: "white",
  background: "hsla(0, 0.90%, 22.50%, 0.78)", // Fully transparent background

  backdropFilter: "blur(8px)", // Blur the background content behind the element
  overflowWrap: "break-word", // Ensure long words break
};

// Example of how the text container could look
const textContent = {
  width: "100%",
  wordWrap: "break-word",
  marginBottom: "10px",
};
