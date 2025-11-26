import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import usePostResponse from "../../../queryHooks/threads/usePostResponse";
import SuccessDialog from "../../../components/SuccessDialog";
import "../forum-styling.css";

function ThreadResponse({ threadId }) {
  const queryClient = useQueryClient();
  const [responseText, setResponseText] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    mutateAsync: postResponse,
    isLoading: postLoading,
    error: postError,
  } = usePostResponse(threadId);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      await postResponse({ responseText }); // <-- bara responseText
      setResponseText("");
      setSuccess(true);
      queryClient.invalidateQueries(["threadDetail", threadId]);
    } catch (err) {
      setSubmitError("Failed to post response. Please try again.");
    }
  };

  return (
    <div className="thread-response-container">
      {success && (
        <SuccessDialog message="Response posted successfully!" delay={2000} />
      )}

      <form onSubmit={handleResponseSubmit} className="thread-response-form">
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Write your response here..."
          required
        />
        <button type="submit" disabled={postLoading}>
          {postLoading ? "Posting..." : "Post Response"}
        </button>

        {submitError && <p className="error-text">{submitError}</p>}
        {postError && (
          <p className="error-text">Failed to post response. Try again.</p>
        )}
      </form>
    </div>
  );
}

export default ThreadResponse;
