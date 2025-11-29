import ThreadResponse from "./ThreadResponse";
import ThreadResponseList from "./ThreadResponseList";

export default function ThreadDetail({ thread }) {
  if (!thread) return <p>Thread not found.</p>;

  const responses = thread.responses || [];

  console.log("responses", thread.responses);

  return (
    <div className="m-4">
      <ThreadResponseList responses={responses} threadId={thread.id} />
      <ThreadResponse threadId={thread.id} />
    </div>
  );
}
