import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path accordingly

const BackendURL = "http://localhost:3000"; // Backend URL

function ThreadDetail() {
  const { threadId } = useParams();
  const { authData } = useAuth(); // Get auth data from context
  const { token } = authData; // Extract token from authData
  const [thread, setThread] = useState({});
  const [responses, setResponses] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error("Failed to post response:", error.message);
      setError("Failed to post response. Please try again later.");
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
      <h3>{thread.title}</h3>
      <p>{thread.body}</p>

      <form onSubmit={handleResponseSubmit}>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Write your response here..."
          required
        ></textarea>
        <button type="submit">Post Response</button>
      </form>

      <div>
        {responses.length > 0 ? (
          responses.map((res) => (
            <div
              key={res.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={res.avatar} // Use the avatar URL from the response
                alt="avatar"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div>
                <strong>{res.username}</strong> skrev:
                <p>{res.body}</p>
                <p>({new Date(res.created_at).toLocaleString()})</p>
              </div>
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>
    </div>
  );
}

export default ThreadDetail;
