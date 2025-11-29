import { useState, useEffect } from "react";
import { useForumOverview } from "../../../queryHooks/threads/useForumOverview";
import { apiFetch } from "../../../api/api";
import ThreadDetail from "./ThreadDetail";
import "./ThreadList.css";

function ThreadList({ subjectId }) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  const { data, isLoading, error } = useForumOverview({
    page,
    limit: 6,
    sort: sortOrder,
    subjectId: subjectId || "",
  });

  useEffect(() => {
    if (data?.threads) setThreads(data.threads);
  }, [data]);

  const toggleThread = (threadId) => {
    setSelectedThreadId(selectedThreadId === threadId ? null : threadId);
  };

  const loadMoreResponses = async (thread) => {
    try {
      const offset = thread.responses.length;
      const data = await apiFetch(
        `/responses/${thread.id}?offset=${offset}&limit=10`
      );

      // Om backend skickar { responses: [...] } eller direkt array
      const newResponsesRaw = data.responses || data;

      // Säkerställ att varje response har ett user-objekt
      const newResponses = newResponsesRaw.map((r) => ({
        ...r,
        user: r.user || {
          id: r.user_id || null,
          username: r.username || "Unknown",
          avatar: r.avatar || "/default-avatar.jpg",
        },
      }));

      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id
            ? { ...t, responses: [...t.responses, ...newResponses] }
            : t
        )
      );
    } catch (err) {
      console.error("Failed to load more responses:", err);
    }
  };

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const totalPages = Math.ceil(data.totalThreads / 6);

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

      {threads.map((thread) => (
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

          {selectedThreadId === thread.id && (
            <div onClick={(e) => e.stopPropagation()}>
              <ThreadDetail thread={thread} />
              {thread.responses.length < thread.total_responses && (
                <button
                  onClick={() => loadMoreResponses(thread)}
                  className="read-more-button"
                >
                  Read more
                </button>
              )}
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
