import React, { useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext"; // Make sure the path is correct
import ThreadList from "./ThreadList";

const BackendURL = "http://localhost:3000";

function CreateThread() {
  const { authData } = useAuth(); // Use the custom hook
  const { token, username } = authData; // Destructure token and username from authData
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
      const response = await fetch(`${BackendURL}/forum/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token here
        },
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
    <div style={LoginContainerStyle}>
      <h2>Skapa ny tråd:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={inputStyle}
        ></textarea>
        <button type="submit">Skapa tråd</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Thread created successfully!</p>
      )}
      <ThreadList />
    </div>
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
};
