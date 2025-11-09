import { useState, useEffect } from "react";
import { useAuth, getCsrfToken } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const BackendURL = "http://localhost:5000";

function LikeButton({
  threadId,
  responseId,
  initialLikeStatus,
  initialLikeCount,
}) {
  const { accessToken } = useAuth().authData;

  const [liked, setLiked] = useState(initialLikeStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);

  // Hämta aktuell like count
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const url = `${BackendURL}/api/forum/responses/${responseId}/like-count`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch like count");
        const data = await response.json();
        setLikeCount(data.likeCount);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchLikeCount();
  }, [responseId]);

  const toggleLike = async () => {
    try {
      if (!accessToken) throw new Error("Access token missing. Please log in.");

      // Optimistisk uppdatering
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);

      const csrfToken = await getCsrfToken();

      const url = `${BackendURL}/api/${
        responseId
          ? `forum/responses/${responseId}/like`
          : `threads/${threadId}/like`
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
        throw new Error("Failed to update like");
      }

      // valfritt: uppdatera likeCount från servern
      const data = await response.json();
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // rollback om request misslyckas
      setLiked(liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
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
