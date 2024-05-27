import React from "react";

const BlogList = ({ posts, onDelete }) => {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/posts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(id);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Author: {post.author}</p>
            <p>Date: {new Date(post.date).toLocaleString()}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
