/* import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useThreads from "../../queryHooks/threads/useThreads";
import "./ThreadList.css";

function ThreadList() {
  const { authData } = useAuth();
  const { data: threads, isLoading, error } = useThreads();

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <div className="thread-list">
      {threads.length > 0 ? (
        threads.map((thread) => (
          <div key={thread.id} className="thread-item">
            <h2 className="thread-title">
              <Link to={`/threads/${thread.id}`} className="thread-link">
                {thread.title}
              </Link>
            </h2>
            <p className="thread-body">{thread.body}</p>
            <p>
              <strong>Author:</strong> {thread.username}
            </p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              ({new Date(thread.created_at).toLocaleString()})
            </p>
          </div>
        ))
      ) : (
        <p>No threads available.</p>
      )}
    </div>
  );
}

export default ThreadList;
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useThreads from "../../queryHooks/threads/useThreads";
import "./ThreadList.css";

function ThreadList({ subjectId }) {
  const { authData } = useAuth();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    setPage(1); // Reset to first page when subject changes
  }, [subjectId]);

  const { data, isLoading, error, isPreviousData } = useThreads(
    page,
    5,
    sortOrder,
    subjectId
  );

  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const { threads, totalPages } = data;

  return (
    <div className="thread-list">
      <button onClick={handleToggleSort}>
        Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
      </button>
      {threads.length > 0 ? (
        threads.map((thread) => (
          <div key={thread.id} className="thread-item">
            <h2 className="thread-title">
              <Link to={`/threads/${thread.id}`} className="thread-link">
                {thread.title}
              </Link>
            </h2>
            <p className="thread-body">{thread.body}</p>
            <p>
              <strong>Author:</strong> {thread.username}
            </p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              ({new Date(thread.created_at).toLocaleString()})
            </p>
          </div>
        ))
      ) : (
        <p>No threads available.</p>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => {
            if (!isPreviousData && page < totalPages) setPage((p) => p + 1);
          }}
          disabled={isPreviousData || page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ThreadList;
