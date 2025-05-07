import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an AuthContext
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"; // solid version

const BackendURL = "http://localhost:5000";

function LikeButton({
  threadId,
  responseId,
  initialLikeStatus,
  initialLikeCount,
}) {
  const { authData } = useAuth(); // Access the auth context to get the token
  const { accessToken } = authData; // Destructure accessToken from context

  const [liked, setLiked] = useState(initialLikeStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);

  // Function to get the CSRF token from cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetch like count when the component mounts
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const url = `${BackendURL}/api/auth/responses/${responseId}/like-count`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch like count");
        }

        const data = await response.json();
        setLikeCount(data.likeCount); // Set the like count state
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLikeCount();
  }, [responseId]); // Run when responseId changes

  // Toggle like/unlike action
  const toggleLike = async () => {
    try {
      const csrfToken = getCookie("csrfToken");

      if (!accessToken) {
        throw new Error("Access token is missing. Please log in again.");
      }

      const url = `${BackendURL}/api/auth/${
        responseId ? `responses/${responseId}/like` : `threads/${threadId}/like`
      }`;

      const response = await fetch(url, {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      // ✅ Handle known error
      if (!response.ok) {
        const errData = await response.json();
        if (errData?.error === "You have already liked this response.") {
          setLiked(true); // Reflect actual server state
          return;
        }
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      setLiked(!liked); // Toggle like status
      setLikeCount(data.likeCount); // Update count from backend
    } catch (error) {
      console.error("Error during like/unlike:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faThumbsUp}
        onClick={toggleLike}
        style={{ cursor: "pointer", color: liked ? "white" : "white" }}
        size="1x"
      />
      <span style={{ marginLeft: "4px" }}>{likeCount} likes</span>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LikeButton;
