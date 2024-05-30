import React, { useState, useEffect } from "react";
import BlogList from "./BlogList";

const BackendURL = "http://localhost:3000";

const Blog = ({ token, currentUsername }) => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BackendURL}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const response = await fetch(`${BackendURL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          author: currentUsername, // Include the username
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Title and content are required");
        }
        throw new Error("Failed to create post");
      }
      const createdPost = await response.json();
      console.log("Post created successfully:", createdPost);
      // Clear input fields after successful post creation
      setNewPostTitle("");
      setNewPostContent("");
      // Refresh posts or handle the new post addition
      setPosts([createdPost, ...posts]); // Optionally, prepend the new post
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setError(error.message);
    }
  };

  const handleDelete = (postId) => {
    // Update the state to remove the deleted post
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      ></textarea>
      <button onClick={handleCreatePost}>Create Post</button>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <BlogList posts={posts} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Blog;
