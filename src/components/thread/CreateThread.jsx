import React, { useState } from "react";
import ThreadList from "./ThreadList";

const BackendURL = "http://localhost:3000";

function CreateThread({ token, currentUser }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false); // Reset success message on each new submit

    // Ensure that both title and body are not empty
    if (!title || !body) {
      setError("Title and content are required");
      return;
    }

    try {
      const response = await fetch(`${BackendURL}/forum/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          body: body,
          author: currentUser, // Include the current username or user ID
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

      // Clear input fields after successful thread creation
      setTitle("");
      setBody("");
      setSuccess(true); // Show success message

      // Optionally, you can add logic here to refresh the list of threads in the parent component
    } catch (error) {
      console.error("Failed to create thread:", error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit">Create Thread</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Thread created successfully!</p>
      )}{" "}
      <ThreadList currentUser={currentUser} />
    </div>
  );
}

export default CreateThread;
