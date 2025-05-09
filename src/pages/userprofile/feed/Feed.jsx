import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Adjust path as needed
import { useParams } from "react-router-dom"; // We'll use this to get the profile's userId
import FeedPostForm from "./FeedPostForm"; // Form to create a new post
import { Card, Button, Spinner } from "react-bootstrap"; // Import Bootstrap components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"; // solid version
import DeleteButton from "../../../components/DeleteButton";

const Feed = () => {
  const { authData } = useAuth(); // Get the logged-in user's data
  const { userId: loggedInUserId, accessToken } = authData; // Get the logged-in user's ID and access token

  const { id: userId } = useParams(); // Get the userId from URL params (for other profiles)

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine if the current profile is the logged-in user's profile or someone else's
  const isOwnProfile = loggedInUserId === Number(userId);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

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

  const deleteFeedPost = async (postId) => {
    const csrfToken = getCookie("csrfToken"); // Ensure getCookie is implemented

    if (!csrfToken) {
      console.error("CSRF Token is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/feed-post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure accessToken is correctly set
            "CSRF-TOKEN": csrfToken,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Optimistic UI update
      } else {
        // Handle different errors based on response status
        if (response.status === 404) {
          console.error("Post not found or unauthorized");
        } else if (response.status === 403) {
          console.error("Unauthorized action");
        } else {
          console.error("Delete failed:", data.error);
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      {/* Only show the FeedPostForm if this is the logged-in user's profile */}
      {isOwnProfile && <FeedPostForm onPostCreated={handlePostCreated} />}

      {/* Display posts in a responsive grid */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <p>No posts to show.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">{post.username}</strong>
                  <p
                    className="text-muted"
                    style={{ fontSize: "0.8em", marginBottom: 0 }}
                  >
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
                <Card.Text
                  style={{
                    color: "gray",
                    fontSize: "0.9em",
                    lineHeight: "1.6",
                  }}
                >
                  {post.content}
                </Card.Text>
                <Button variant="outline-primary" size="sm">
                  Comment
                </Button>
                <div>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                    size="1x"
                  />
                  <span style={{ marginLeft: "4px" }}>
                    {" "}
                    100000000000000000 likes
                  </span>
                  {isOwnProfile && (
                    <DeleteButton onDelete={() => deleteFeedPost(post.id)} />
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
