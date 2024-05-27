import React, { useState, useEffect } from "react";
import Blog from "./Blog";
import BlogList from "./BlogList";

const BackendURL = "http://localhost:3000";

const BlogSection = ({ token }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BackendURL}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <Blog token={token} refreshPosts={fetchPosts} />
      <BlogList posts={posts} />
    </div>
  );
};

export default BlogSection;
