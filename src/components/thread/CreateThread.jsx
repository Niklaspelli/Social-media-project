import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Make sure the path is correct
import ThreadList from "./ThreadList";

const BackendURL = "http://localhost:5000";

function CreateThread() {
  const { authData } = useAuth(); // Use the custom hook
  const { username } = authData; // Destructure username from authData
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title || !body) {
      setError("Title and content are required");
      return;
    }

    try {
      const response = await fetch(`${BackendURL}/api/auth/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({
          title: title,
          body: body,
          author: username, // Use the username here
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Title and content are required");
        }
        throw new Error("Failed to create thread");
      }

      const createdThread = await response.json();
      console.log("Thread created successfully:", createdThread);

      setTitle("");
      setBody("");
      setSuccess(true);
    } catch (error) {
      console.error("Failed to create thread:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <ThreadList />
      <h1 style={{ textAlign: "center" }}>Skapa ny tråd:</h1>
      <div style={LoginContainerStyle}>
        <form onSubmit={handleSubmit}>
          <input
            maxLength="50"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <textarea
            maxLength="100"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={inputStyle}
          ></textarea>
          <button
            type="submit"
            style={{ backgroundColor: "black", margin: "20px" }}
          >
            Skapa tråd
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>Thread created successfully!</p>
        )}
      </div>
    </>
  );
}

export default CreateThread;

const LoginContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};

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
