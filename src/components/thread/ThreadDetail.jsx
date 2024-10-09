import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path accordingly

const BackendURL = "http://localhost:3000";

function ThreadDetail() {
  const { threadId } = useParams();
  const { authData } = useAuth();
  const { token } = authData;
  const [thread, setThread] = useState({});
  const [responses, setResponses] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State to store deletion errors for specific responses
  const [deleteErrors, setDeleteErrors] = useState({});

  // Fetch thread details and responses
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) return;

      setLoading(true);
      try {
        const response = await fetch(`${BackendURL}/forum/threads/${threadId}`);
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
    e.preventDefault();

    try {
      const response = await fetch(
        `${BackendURL}/forum/threads/${threadId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        `${BackendURL}/forum/responses/${responseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
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
      <h1 style={{ textAlign: "center" }}>{thread.title}</h1>
      <p style={{ textAlign: "center", background: "grey", padding: "10px" }}>
        {thread.body}
      </p>
      <div>
        {responses.length > 0 ? (
          responses.map((res) => (
            <div style={StyleContainer}>
              <div style={RespContainer} key={res.id}>
                <img
                  src={res.avatar}
                  alt="avatar"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <div style={textContent}>
                  {/* Use Link to navigate to the user profile */}
                  <Link to={`/user/${res.user_id}`}>
                    <strong>{res.username}</strong>
                  </Link>{" "}
                  wrote:
                  <p>{res.body}</p>
                  <p style={{ fontSize: "0.8em", color: "#999" }}>
                    ({new Date(res.created_at).toLocaleString()})
                  </p>
                  {/* Add the delete button */}
                  {res.userId === authData.id && (
                    <div>
                      <button
                        onClick={() => handleDeleteResponse(res.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                      {/* Show deletion error for this specific response if it exists */}
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
      </div>{" "}
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
  width: "90%",
  maxWidth: "400px",
  padding: "10px",
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
  background: "hsla(0, 1%, 13%, 0.781)", // Fully transparent background

  backdropFilter: "blur(8px)", // Blur the background content behind the element
  overflowWrap: "break-word", // Ensure long words break
};

// Example of how the text container could look
const textContent = {
  width: "100%",
  wordWrap: "break-word",
  marginBottom: "10px",
};
