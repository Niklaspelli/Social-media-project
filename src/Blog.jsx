import React, { useState } from "react";
import DOMPurify from "dompurify";

function Blog() {
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    // Here you can handle the submission of the form
    // For now, let's just add the new message to the array of messages
    const newEntry = {
      name: name,
      message: newMessage,
    };
    setMessages([...messages, newEntry]); // Add new message to the array
    setNewMessage(""); // Clear the input field
  };

  const sanitizedData = (message) => ({
    __html: DOMPurify.sanitize(message),
  });

  return (
    <div>
      <h2>Posta ett blogginlägg</h2>
      <label>Namn:</label>
      <input value={name} onChange={handleNameChange} />
      <label>Meddelande:</label>
      <textarea value={newMessage} onChange={handleNewMessageChange} />
      <button onClick={handleSubmit}>Skicka</button>

      {/* Render all messages */}
      {messages.map((entry, index) => (
        <div key={index}>
          <h3>Meddelande postat av {entry.name}:</h3>
          <div dangerouslySetInnerHTML={sanitizedData(entry.message)} />
          {/* <p>{entry.message}</p> */}
        </div>
      ))}
    </div>
  );
}

export default Blog;
