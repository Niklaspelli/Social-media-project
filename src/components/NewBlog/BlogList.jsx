import React, { useCallback } from "react";

const BackendURL = "http://localhost:3000";

const BlogList = ({ posts, onDelete, currentUser }) => {
  const handleDelete = useCallback(
    async (postId) => {
      try {
        const response = await fetch(`${BackendURL}/posts/${postId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          onDelete(postId);
        } else {
          console.error("Failed to delete post, status code:", response.status);
          const errorData = await response.json();
          console.error("Error message:", errorData.error);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [onDelete]
  );

  return (
    <div>
      <h2>All Posts</h2>
      {posts.map((post) => (
        <li key={post.id} className="message-border">
          <p>
            <span className="username">{post.author}</span> skrev:
          </p>
          <p>Datum: {new Date(post.date).toLocaleString()}</p>
          <h3>{post.title}</h3>
          <div className="chat-bg">
            <p>{post.content}</p>
          </div>

          {currentUser === post.author && (
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          )}
        </li>
      ))}{" "}
    </div>
  );
};

export default BlogList;
