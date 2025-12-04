import { useState } from "react";
import { useForumOverview } from "../../../queryHooks/threads/useForumOverview";
import ThreadDetail from "./ThreadDetail";
import "./ThreadList.css";

function ThreadList({ subjectId }) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  const { data, isLoading, error } = useForumOverview({
    page,
    limit: 10,
    sort: sortOrder,
    subjectId,
  });

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const toggleThread = (threadId) => {
    setSelectedThreadId(selectedThreadId === threadId ? null : threadId);
  };

  const totalPages = Math.ceil(data.totalThreads / data.limit);

  return (
    <div className="thread-list-container">
      <div className="thread-list-header">
        <button
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div>

      {data.threads.map((thread) => (
        <div
          key={thread.id}
          className="thread-item"
          role="button"
          tabIndex={0}
          onClick={() => toggleThread(thread.id)}
        >
          <div className="thread-header">
            <img
              src={thread.user.avatar || "/default-avatar.jpg"}
              alt={`${thread.user.username} avatar`}
              className="thread-avatar"
            />
            <h2 className="thread-title">{thread.title}</h2>
          </div>
          <p className="thread-body">{thread.body}</p>
          <p className="thread-date">{thread.total_responses} have responded</p>
          <small className="thread-date">
            Posted {new Date(thread.created_at).toLocaleDateString()}
          </small>

          {thread.last_response && (
            <div className="thread-last-response">
              <strong>Last response:</strong> {thread.last_response.body} by{" "}
              {thread.last_response.user.username}
            </div>
          )}

          {selectedThreadId === thread.id && (
            <div onClick={(e) => e.stopPropagation()}>
              <ThreadDetail thread={thread} />
            </div>
          )}
        </div>
      ))}

      <div className="pagination-controls">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => page < totalPages && setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ThreadList;
