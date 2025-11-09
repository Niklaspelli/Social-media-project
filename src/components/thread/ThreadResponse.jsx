import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import usePostResponse from "../../queryHooks/threads/usePostResponse";
import SuccessDialog from "../SuccessDialog";

function ThreadResponse() {
  const { threadId } = useParams();

  const queryClient = useQueryClient();
  const [responseText, setResponseText] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    mutateAsync: postResponse,
    isLoading: postLoading,
    error: postError,
  } = usePostResponse(threadId);

  // --- Handlers ---
  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      await postResponse({ responseText });
      setResponseText("");
      setSuccess(true);
      queryClient.invalidateQueries(["threadDetail", threadId]);
    } catch (err) {
      setSubmitError("Failed to post response. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "100%", margin: "40px auto" }}>
      {success && (
        <SuccessDialog message="Response posted successfully!" delay={2000} />
      )}

      {/* Response Form */}
      <form onSubmit={handleResponseSubmit} style={formStyle}>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Write your response here..."
          required
          style={textareaStyle}
        />
        <button type="submit" disabled={postLoading} style={submitBtnStyle}>
          {postLoading ? "Posting..." : "Post Response"}
        </button>
        {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        {postError && (
          <p style={{ color: "red" }}>Failed to post response. Try again.</p>
        )}
      </form>
    </div>
  );
}

export default ThreadResponse;

const formStyle = {
  display: "flex",
  flexDirection: "column",
  marginTop: "20px",
};
const textareaStyle = {
  width: "100%",
  height: "120px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  marginBottom: "10px",
  backgroundColor: "#333",
  color: "white",
  fontSize: "14px",
  resize: "none",
};
const submitBtnStyle = {
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: "black",
  color: "white",
  cursor: "pointer",
};
