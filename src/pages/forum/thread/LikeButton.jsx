import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useToggleLike from "../../../queryHooks/likes/useToggleLike";

export default function LikeButton({
  threadId,
  responseId,
  initialLikeStatus,
  initialLikeCount,
}) {
  const [liked, setLiked] = useState(initialLikeStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState(null);

  const { mutate: toggleLike } = useToggleLike(threadId);

  const handleClick = () => {
    setError(null);

    const newStatus = !liked;

    // Optimistisk UI
    setLiked(newStatus);
    setLikeCount((prev) => prev + (newStatus ? 1 : -1));

    toggleLike(
      { responseId },
      {
        onError: () => {
          // Backa om det failar
          setLiked(liked);
          setLikeCount(initialLikeCount);
          setError("Failed to update like");
        },
      }
    );
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faThumbsUp}
        onClick={handleClick}
        style={{
          cursor: "pointer",
          color: liked ? "green" : "white",
        }}
      />

      <span style={{ marginLeft: "4px", color: "white" }}>
        {likeCount} likes
      </span>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
