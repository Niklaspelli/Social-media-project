import React, { useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext"; // Make sure the path is correct

const FeedPostForm = ({ onPostCreated }) => {
  const { authData } = useAuth(); // Use the custom hook
  const { username, csrfToken, accessToken, avatar } = authData; // Destructure username from authData
  const [content, setContent] = useState(""); // State to hold the content of the post

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const csrfToken = getCookie("csrfToken"); // You need to implement getCookie

      const response = await fetch("http://localhost:5000/api/auth/feed-post", {
        // Make sure this endpoint is correct
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ Include this

          "CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.message === "Post created successfully") {
        setContent(""); // Reset content after posting
        onPostCreated(); // Call the callback to reload the feed
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <InputGroup>
        <FormControl
          as="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
      </InputGroup>
      <Button variant="primary" type="submit" className="mt-2">
        Post
      </Button>
    </form>
  );
};

export default FeedPostForm;
