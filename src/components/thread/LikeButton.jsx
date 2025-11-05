import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const BackendURL = "http://localhost:5000";

function LikeButton({
  threadId,
  responseId,
  initialLikeStatus,
  initialLikeCount,
}) {
  const { authData } = useAuth();
  const { accessToken } = authData;

  const [liked, setLiked] = useState(initialLikeStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const url = `${BackendURL}/api/responses/${responseId}/like-count`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch like count");
        }

        const data = await response.json();
        setLikeCount(data.likeCount);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLikeCount();
  }, [responseId]);

  const toggleLike = async () => {
    try {
      const csrfToken = getCookie("csrfToken");

      if (!accessToken) {
        throw new Error("Access token is missing. Please log in again.");
      }

      const url = `${BackendURL}/api/${
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

      if (!response.ok) {
        const errData = await response.json();
        if (errData?.error === "You have already liked this response.") {
          setLiked(true);
          return;
        }
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      setLiked(!liked);
      setLikeCount(data.likeCount);
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
