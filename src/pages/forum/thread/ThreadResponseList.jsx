import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useDeleteResponse from "../../../queryHooks/threads/useDeleteResponse";
import DeleteButton from "../../../components/DeleteButton";
import LikeButton from "./LikeButton";
import "../forum-styling.css";

export default function ThreadResponseList({ responses = [], threadId }) {
  const { authData } = useAuth();
  const { userId } = authData;
  const { mutateAsync: deleteResponse } = useDeleteResponse(threadId);

  const [allResponses, setAllResponses] = useState(responses);
  const [deleteErrors, setDeleteErrors] = useState({});
  const [loadingResponses, setLoadingResponses] = useState({}); // track which responses are loading

  // Synca initial props
  useEffect(() => {
    setAllResponses(responses);
  }, [responses]);

  const handleDelete = async (responseId) => {
    const deletedResponseBackup = allResponses.find((r) => r.id === responseId);

    // Optimistisk UI: ta bort direkt och markera som loading
    setAllResponses((prev) => prev.filter((r) => r.id !== responseId));
    setLoadingResponses((prev) => ({ ...prev, [responseId]: true }));
    setDeleteErrors((prev) => ({ ...prev, [responseId]: null }));

    try {
      await deleteResponse({ responseId });
    } catch (err) {
      // Återställ backup vid fel
      setAllResponses((prev) => [...prev, deletedResponseBackup]);
      setDeleteErrors((prev) => ({
        ...prev,
        [responseId]: "Failed to delete response",
      }));
      console.error("Failed to delete response", err);
    } finally {
      setLoadingResponses((prev) => ({ ...prev, [responseId]: false }));
    }
  };

  return (
    <div className="thread-response-list">
      {allResponses.map((res) => {
        const user = res.user || {
          id: res.user_id,
          username: res.username || "Unknown",
          avatar: res.avatar || "/default-avatar.jpg",
        };

        const isLoading = loadingResponses[res.id];

        return (
          <div key={res.id} className="response-card">
            <img src={user.avatar} alt="avatar" className="response-avatar" />
            <div className="response-content">
              <strong>{user.username}</strong>
              <p>{res.body}</p>
              <small>{new Date(res.created_at).toLocaleString()}</small>
              <div className="response-actions">
                {user.id === userId && (
                  <DeleteButton
                    onDelete={() => handleDelete(res.id)}
                    disabled={isLoading} // disable button while loading
                  />
                )}
                <LikeButton
                  threadId={threadId}
                  responseId={res.id}
                  initialLikeStatus={res.userHasLiked}
                  initialLikeCount={res.likeCount}
                />
                {isLoading && <span style={{ marginLeft: 8 }}>⏳</span>}
                {deleteErrors?.[res.id] && (
                  <p style={{ color: "red" }}>{deleteErrors[res.id]}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {allResponses.length === 0 && <p>No responses yet.</p>}
    </div>
  );
}
