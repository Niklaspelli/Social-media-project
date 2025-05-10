import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LikeButton from "./LikeButton";
import useThreadDetail from "../../queryHooks/threads/useThreadDetail";
import usePostResponse from "../../queryHooks/threads/usePostResponse";
import useDeleteResponse from "../../queryHooks/threads/useDeleteResponse";
import { useQueryClient } from "@tanstack/react-query";

const BackendURL = "http://localhost:5000";

function ThreadResponse() {
  const { threadId } = useParams();
  const { authData } = useAuth();
  const { username, avatar, accessToken } = authData;

  const { data, isLoading, error } = useThreadDetail(threadId);
  const queryClient = useQueryClient();

  const {
    mutate: postResponse,
    isLoading: postLoading,
    error: postError,
  } = usePostResponse();
  const {
    mutate: deleteResponse,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteResponse();

  const [responseText, setResponseText] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [deleteErrors, setDeleteErrors] = useState({});

  const thread = data?.thread;
  const responses = data?.responses || [];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCookie("csrfToken");

    try {
      await postResponse({
        threadId,
        responseText,
        accessToken,
        csrfToken,
      });
      setResponseText("");
      setSubmitError(null);
      // Optionally refetch thread detail after posting a response
      queryClient.invalidateQueries(["threadDetail", threadId]);
    } catch (error) {
      setSubmitError("Failed to post response. Please try again.");
    }
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      await deleteResponse({
        responseId,
        accessToken,
      });
      // Optionally refetch thread detail after deleting a response
      queryClient.invalidateQueries(["threadDetail", threadId]);
    } catch (error) {
      setDeleteErrors((prev) => ({
        ...prev,
        [responseId]: "Failed to delete response.",
      }));
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{thread.title}</h1>
      <div style={StyleContainer}>
        <div style={RespContainer}>
          <img
            src={thread.avatar || "default-avatar.jpg"}
            alt="avatar"
            style={avatarStyle}
          />
          <div style={textContent}>
            <Link to={`/user/${thread.user_id}`}>
              <strong>{thread.username}</strong>
            </Link>
            <p>{thread.body}</p>
            <p style={timestampStyle}>
              {new Date(thread.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Responses */}
      <div>
        {responses.length ? (
          responses.map((res) => (
            <div key={res.id} style={StyleContainer}>
              <div style={threadCreator}>
                <img
                  src={res.avatar || "default-avatar.jpg"}
                  alt="avatar"
                  style={avatarStyle}
                />
                <div style={textContent}>
                  <Link to={`/user/${res.user_id}`}>
                    <strong>{res.username}</strong>
                  </Link>{" "}
                  wrote:
                  <p>{res.body}</p>
                  <p style={timestampStyle}>
                    {new Date(res.created_at).toLocaleString()}
                  </p>
                  {res.user_id === authData.id && (
                    <>
                      <button
                        onClick={() => handleDeleteResponse(res.id)}
                        style={deleteBtnStyle}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                      {deleteErrors[res.id] && (
                        <p style={{ color: "red" }}>{deleteErrors[res.id]}</p>
                      )}
                    </>
                  )}
                  <LikeButton
                    threadId={threadId}
                    responseId={res.id}
                    initialLikeStatus={res.userHasLiked}
                    initialLikeCount={res.likeCount}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>

      {/* Response Form */}
      <div style={StyleContainer}>
        <form onSubmit={handleResponseSubmit}>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            style={inputStyle}
            placeholder="Write your response here..."
            required
          />
          <button
            type="submit"
            style={{ backgroundColor: "black", color: "white", margin: "20px" }}
            disabled={postLoading}
          >
            {postLoading ? "Posting..." : "Post Response"}
          </button>
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
          {postError && (
            <p style={{ color: "red" }}>
              Failed to post response. Try again later.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ThreadResponse;

// --- STYLING ---
const avatarStyle = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  marginRight: "10px",
};

const timestampStyle = {
  fontSize: "0.8em",
  color: "#999",
};

const deleteBtnStyle = {
  color: "white",
  cursor: "pointer",
  backgroundColor: "red",
};

const inputStyle = {
  width: "500px",
  height: "200px",
  borderRadius: "20px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  fontSize: "16px",
  backgroundColor: "grey",
  color: "white",
  border: "none",
  padding: "10px",
};

const StyleContainer = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};

const threadCreator = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "500px",
  borderRadius: "20px",
  padding: "15px",
  boxShadow: "2px 2px 0px black",
  background: "hsla(0, 2.70%, 50.00%, 0.78)",
  backdropFilter: "blur(8px)",
  overflowWrap: "break-word",
};

const RespContainer = {
  ...threadCreator,
  background: "hsla(0, 0.90%, 22.50%, 0.78)",
};

const textContent = {
  width: "100%",
  wordWrap: "break-word",
  marginBottom: "10px",
};
