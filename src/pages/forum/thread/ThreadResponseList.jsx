import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteResponse from "../../../queryHooks/threads/useDeleteResponse";
import DeleteButton from "../../../components/DeleteButton";
import LikeButton from "./LikeButton";
import useThreadDetail from "../../../queryHooks/threads/useThreadDetail";
import "../forum-styling.css";

export default function ThreadResponseList({ responses = [], threadId }) {
  const { authData } = useAuth();
  const { userId } = authData;
  const queryClient = useQueryClient();
  const { mutateAsync: deleteResponse } = useDeleteResponse();
  const [deleteErrors, setDeleteErrors] = useState({});

  // Hämta tråd + responses
  const { data, isLoading, error } = useThreadDetail(threadId);

  if (isLoading) return <p>Loading responses...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const handleDelete = async (responseId) => {
    try {
      await deleteResponse({ responseId });
      queryClient.invalidateQueries(["threadDetail", threadId]);
      setDeleteErrors((prev) => ({ ...prev, [responseId]: null }));
    } catch (err) {
      setDeleteErrors((prev) => ({
        ...prev,
        [responseId]: "Failed to delete response",
      }));
    }
  };

  return (
    <div className="thread-response-list">
      {responses.map((res) => (
        <div key={res.id} className="response-card">
          <img
            src={res.avatar || "/default-avatar.jpg"}
            alt="avatar"
            className="response-avatar"
          />
          <div className="response-content">
            <strong>{res.username}</strong>
            <p>{res.body}</p>
            <small>{new Date(res.created_at).toLocaleString()}</small>
            <div className="response-actions">
              {res.user_id === userId && (
                <DeleteButton onDelete={() => handleDelete(res.id)} />
              )}
              <LikeButton
                threadId={threadId}
                responseId={res.id}
                initialLikeStatus={res.userHasLiked}
                initialLikeCount={res.likeCount}
              />
              {deleteErrors?.[res.id] && (
                <p style={{ color: "red" }}>{deleteErrors[res.id]}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
