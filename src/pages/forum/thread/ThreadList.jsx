/* import { useState, useEffect } from "react";
import useThreads from "../../../queryHooks/threads/useThreads";
import ThreadDetail from "./ThreadDetail"; // vi använder denna inline
import "./ThreadList.css";

function ThreadList({ subjectId }) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    setPage(1);
    setSelectedThreadId(null);
  }, [subjectId]);

  const { data, isLoading, error, isPreviousData } = useThreads({
    page,
    limit: 10,
    sort: sortOrder,
    subjectId,
    shared: false,
  });

  const toggleThread = (threadId) => {
    setSelectedThreadId(selectedThreadId === threadId ? null : threadId);
  };

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const { threads, totalPages } = data;

  return (
    <div className="thread-list-container">
      <div className="thread-list-header">
        <button
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label={`Sort threads by ${
            sortOrder === "asc" ? "newest" : "oldest"
          }`}
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
          onKeyPress={(e) => e.key === "Enter" && toggleThread(thread.id)}
          aria-expanded={selectedThreadId === thread.id}
        >
          <div className="thread-header">
            <img
              src={thread.avatar || "/default-avatar.jpg"}
              alt={`${thread.username || "User"} avatar`}
              className="thread-avatar"
            />
            <h2 className="thread-title">{thread.title}</h2>
          </div>
          <p className="thread-body">{thread.body}</p>
          <small className="thread-date">
            Posted {new Date(thread.created_at).toLocaleDateString()}
          </small>

          {selectedThreadId === thread.id && (
            <div onClick={(e) => e.stopPropagation()}>
              <ThreadDetail threadId={thread.id} />
            </div>
          )}
        </div>
      ))}

      <div className="pagination-controls">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => {
            if (!isPreviousData && page < totalPages) setPage((p) => p + 1);
          }}
          disabled={isPreviousData || page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ThreadList;
 */

import { useState, useEffect } from "react";
import { useForumOverview } from "../../../queryHooks/threads/useForumOverview"; // ✅ nytt hook
import ThreadDetail from "./ThreadDetail";
import "./ThreadList.css";

function ThreadList({ subjectId }) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    setPage(1);
    setSelectedThreadId(null);
  }, [subjectId]);

  // Använd nya hooket
  const { data, isLoading, error, isPreviousData } = useForumOverview(
    page,
    10,
    sortOrder
  );

  console.log("data från useforumoverview:", data);

  const toggleThread = (threadId) => {
    setSelectedThreadId(selectedThreadId === threadId ? null : threadId);
  };

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  // Filtrera trådar på valt subjectId
  const threads = data.threads.filter((t) => t.subject_id === subjectId);
  const totalPages = data.totalPages; // Antag att API skickar totalPages

  return (
    <div className="thread-list-container">
      <div className="thread-list-header">
        <button
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label={`Sort threads by ${
            sortOrder === "asc" ? "newest" : "oldest"
          }`}
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
          onKeyPress={(e) => e.key === "Enter" && toggleThread(thread.id)}
          aria-expanded={selectedThreadId === thread.id}
        >
          <div className="thread-header">
            <img
              src={thread.user.avatar || "/default-avatar.jpg"}
              alt={`${thread.user.username || "User"} avatar`}
              className="thread-avatar"
            />
            <h2 className="thread-title">{thread.title}</h2>
          </div>
          <p className="thread-body">{thread.body}</p>
          <small className="thread-date">
            Posted {new Date(thread.created_at).toLocaleDateString()}
          </small>
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
          aria-label="Previous page"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => {
            if (!isPreviousData && page < totalPages) setPage((p) => p + 1);
          }}
          disabled={isPreviousData || page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ThreadList;
