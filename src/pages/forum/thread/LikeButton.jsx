import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useToggleLike from "../../../queryHooks/likes/useToggleLike";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const pendingClick = useRef(false);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    setError(null);
    const newStatus = !liked;

    // Optimistisk UI
    setLiked(newStatus);
    setLikeCount((prev) => prev + (newStatus ? 1 : -1));

    if (timeoutRef.current) {
      pendingClick.current = true;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      toggleLike(
        { responseId },
        {
          onSuccess: () => {
            // Uppdatera UI med senaste data från servern
            const key = ["responses", threadId];
            const threadResponses = queryClient.getQueryData(key);
            if (threadResponses) {
              const response = threadResponses.find((r) => r.id === responseId);
              if (response) {
                setLiked(response.userHasLiked);
                setLikeCount(response.likeCount);
              }
            }
          },
          onError: () => {
            // Backa UI
            setLiked(!newStatus);
            setLikeCount((prev) => prev + (newStatus ? -1 : 1));
            setError("Failed to update like");
          },
        }
      );

      if (pendingClick.current) {
        pendingClick.current = false;
        handleClick();
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }, 300); // debounce
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faThumbsUp}
        onClick={handleClick}
        style={{
          cursor: "pointer",
          color: liked ? "green" : "gray",
        }}
      />
      <span style={{ marginLeft: "4px", color: "white" }}>
        {likeCount} likes
      </span>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
