/* import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useLikeCount } from "../../queryHooks/likes/useLikeCount";
import { useToggleLike } from "../../queryHooks/likes/useToggleLike";

function LikeButton({ threadId, responseId }) {
  const [error, setError] = useState(null);

  // Hämta aktuell like-status och count
  const { data = { liked: false, likeCount: 0 }, isLoading } = useLikeCount({
    threadId,
    responseId,
  });

  const toggleLikeMutation = useToggleLike({ threadId, responseId });

  if (isLoading) return <span>Loading...</span>;

  const handleClick = () => {
    if (toggleLikeMutation.isLoading) return;

    // Skicka motsatt status → toggla like/unlike
    toggleLikeMutation.mutate(!data.liked, {
      onError: (err) => setError(err.message),
    });
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faThumbsUp}
        onClick={handleClick}
        style={{ cursor: "pointer", color: data.liked ? "blue" : "gray" }}
      />
      <span style={{ marginLeft: "4px" }}>{data.likeCount} likes</span>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LikeButton;
 */

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useLikeCount } from "../../../queryHooks/likes/useLikeCount";
import { useLikeResponse } from "../../../queryHooks/likes/useLikeResponse";
import { useUnlikeResponse } from "../../../queryHooks/likes/useUnlikeResponse";

function LikeButton({ responseId }) {
  const [error, setError] = useState(null);

  // Hämta likes och status
  const { data = { liked: false, likeCount: 0 }, isLoading } = useLikeCount({
    responseId,
  });

  const likeMutation = useLikeResponse(responseId);
  const unlikeMutation = useUnlikeResponse(responseId);

  if (isLoading) return <span>Loading...</span>;

  const handleClick = () => {
    setError(null);
    if (likeMutation.isLoading || unlikeMutation.isLoading) return;

    if (data.liked) {
      unlikeMutation.mutate(undefined, {
        onError: (err) => setError(err.message),
      });
    } else {
      likeMutation.mutate(undefined, {
        onError: (err) => setError(err.message),
      });
    }
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faThumbsUp}
        onClick={handleClick}
        style={{ cursor: "pointer", color: data.liked ? "green" : "white" }}
      />
      <span style={{ marginLeft: "4px", color: "white" }}>
        {data.likeCount} likes
      </span>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LikeButton;
