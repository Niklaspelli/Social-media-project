import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Adjust path as needed
import { useParams } from "react-router-dom"; // We'll use this to get the profile's userId
import FeedPostForm from "./FeedPostForm"; // Form to create a new post

const Feed = () => {
  const { authData } = useAuth(); // Get the logged-in user's data
  const { userId: loggedInUserId, accessToken } = authData; // Get the logged-in user's ID and access token

  const { id: userId } = useParams(); // Get the userId from URL params (for other profiles)

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine if the current profile is the logged-in user's profile or someone else's
  const isOwnProfile = loggedInUserId === Number(userId);

  // Fetch feed posts for the logged-in user or for another user
  const fetchUserFeedPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/feed-post/user/${userId}`, // Make sure this fetches the correct user's posts
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching feed posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feed posts for logged-in user's profile or another user's profile
  useEffect(() => {
    if (userId) {
      fetchUserFeedPosts();
    }
  }, [userId]);

  // Callback to refresh the feed when a new post is created
  const handlePostCreated = () => {
    fetchUserFeedPosts(); // Refresh feed after a post is created
  };

  return (
    <div>
      {/* Only show the FeedPostForm if this is the logged-in user's profile */}
      {isOwnProfile && <FeedPostForm onPostCreated={handlePostCreated} />}

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts to show.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="mb-3">
              <div>
                <strong>{post.username}</strong> ({post.created_at})
              </div>
              <div>{post.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
