import { useState, useEffect } from "react";
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

  console.log("data", data);

  const toggleThread = (threadId) => {
    setSelectedThreadId(selectedThreadId === threadId ? null : threadId);
  };

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const { threads, totalPages } = data;

  return (
    <div className="thread-list-container">
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
      </button>

      {threads.map((thread) => (
        <div key={thread.id} className="thread-item">
          <h2
            onClick={() => toggleThread(thread.id)}
            style={{ cursor: "pointer" }}
          >
            {thread.title}
          </h2>

          {selectedThreadId === thread.id && (
            <ThreadDetail threadId={thread.id} />
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
