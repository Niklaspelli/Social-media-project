import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BackendURL = "http://localhost:3000"; // Backend URL

function ThreadDetail() {
  const { threadId } = useParams();
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
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BackendURL}/forum/threads/${threadId}/responses`, // Corrected URL
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
      setResponses((prevResponses) => [newResponse.response, ...prevResponses]); // Prepend the new response
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
      {/* Display thread title and body */}
      <h3>{thread.title}</h3>
      <p>{thread.body}</p>

      {/* Response form */}
      <form onSubmit={handleResponseSubmit}>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Write your response here..."
          required
        ></textarea>
        <button type="submit">Post Response</button>
      </form>

      {/* Display responses */}
      <div>
        {responses.length > 0 ? (
          responses.map((res) => (
            <div key={res.id}>
              <strong>{res.username}</strong> skrev:
              <p>{res.body}</p>
              <p>({new Date(res.created_at).toLocaleString()})</p>
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
