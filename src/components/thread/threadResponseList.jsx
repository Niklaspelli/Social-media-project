import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import LikeButton from "./LikeButton";
import useDeleteResponse from "../../queryHooks/threads/useDeleteResponse";
import DeleteButton from "../DeleteButton";

const ThreadResponseList = ({ responses = [] }) => {
  const { threadId } = useParams();
  const { authData } = useAuth();
  const { userId } = authData;

  const queryClient = useQueryClient();
  const { mutateAsync: deleteResponse, isLoading: deleteLoading } =
    useDeleteResponse();
  const [deleteErrors, setDeleteErrors] = useState({});

  if (!responses.length) return <p>No responses yet.</p>;

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
    <>
      {responses.map((res) => (
        <div key={res.id} style={responseCard}>
          <img
            src={res.avatar || "/default-avatar.jpg"}
            alt="avatar"
            style={avatarStyle}
          />
          <div style={{ flex: 1 }}>
            <Link to={`/user/${res.user_id}`}>
              <strong>{res.username}</strong>
            </Link>
            <p>wrote:</p>
            <p>{res.body}</p>
            <small style={{ color: "#999" }}>
              {new Date(res.created_at).toLocaleString()}
            </small>
            <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
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
    </>
  );
};

export default ThreadResponseList;

// --- Styles ---
const avatarStyle = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  marginRight: "10px",
};
const responseCard = {
  display: "flex",
  alignItems: "flex-start",
  padding: "15px",
  borderRadius: "10px",
  background: "rgba(50,50,50,0.7)",
  marginBottom: "15px",
};
