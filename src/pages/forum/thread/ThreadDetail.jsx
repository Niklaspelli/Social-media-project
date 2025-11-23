import ThreadResponse from "./ThreadResponse";
import ThreadResponseList from "./ThreadResponseList";
import useThreadDetail from "../../../queryHooks/threads/useThreadDetail";

export default function ThreadDetail({ threadId }) {
  const { data, isLoading, error } = useThreadDetail(threadId);

  if (isLoading) return <p>Loading thread...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const thread = data.thread;
  const responses = data.responses || []; // <--- Viktigt!

  console.log("id", threadId);

  return (
    <div className="thread-detail-card">
      <p>{thread.body}</p>
      <p>
        <strong>Author:</strong> {thread.username}
      </p>
      <ThreadResponseList responses={responses} threadId={thread.id} />
      <ThreadResponse threadId={thread.id} />
    </div>
  );
}
