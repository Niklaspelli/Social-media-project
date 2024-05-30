import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

const BackendURL = "http://localhost:3000";

const BlogList = ({ posts, onDelete }) => {
  const { postId } = useParams();

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
          console.error("Failed to delete post");
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
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <div className="chat-bg">
              <p>{post.content}</p>
            </div>
            <p>
              User: <div className="username">{post.author}</div>
            </p>
            <p>Date: {new Date(post.date).toLocaleString()}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
