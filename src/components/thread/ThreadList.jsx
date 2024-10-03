import React, { useEffect, useState } from "react"; // Importing React, useEffect, useState
import { Link } from "react-router-dom"; // Importing Link for navigation
import { useAuth } from "../../context/AuthContext"; // Adjust the path accordingly

const BackendURL = "http://localhost:3000"; // URL of the backend

function ThreadList() {
  const { authData } = useAuth(); // Get auth data from context
  const { token } = authData; // Extract token from authData (if needed in the future)
  const [threads, setThreads] = useState([]); // State to hold threads
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${BackendURL}/forum/threads`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        }); // Fetch threads
        if (!response.ok) {
          throw new Error("Failed to fetch threads"); // Error handling
        }
        const data = await response.json(); // Parse JSON data
        setThreads(data); // Set fetched threads to state
      } catch (error) {
        console.error("Failed to fetch threads:", error.message); // Log error
        setError("Failed to fetch threads. Please try again later."); // Set error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchThreads(); // Call the fetch function
  }, [token]); // Add token to dependencies in case it changes

  if (loading) {
    return <p>Loading threads...</p>; // Show loading message
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Show error message
  }

  return (
    <div>
      {threads.length > 0 ? (
        threads.map((thread) => (
          <div key={thread.id}>
            <h2>
              <Link to={`/threads/${thread.id}`}>{thread.title}</Link>{" "}
              {/* Link to thread detail */}
            </h2>
            <p>{thread.body}</p>
          </div>
        ))
      ) : (
        <p>No threads available.</p> // Message when there are no threads
      )}
    </div>
  );
}

export default ThreadList; // Export the component
