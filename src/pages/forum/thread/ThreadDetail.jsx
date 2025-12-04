import ThreadResponse from "./ThreadResponse";
import ThreadResponseList from "./ThreadResponseList";
import useResponses from "../../../queryHooks/threads/useResponses";

export default function ThreadDetail({ thread }) {
  if (!thread) return <p>Thread not found.</p>;

  // Hook: starta med de 5 första svaren
  const { responses, loadMore, hasMore, isLoading, isFetching } = useResponses({
    threadId: thread.id,
    initialLimit: 5,
  });

  /*   console.log("resp:", responses);
   */
  if (isLoading) return <p>Loading responses...</p>;

  return (
    <div className="m-4" onClick={(e) => e.stopPropagation()}>
      {/* Lista alla responses hittills */}
      <ThreadResponseList responses={responses} threadId={thread.id} />

      {/* Lägg till möjlighet att skriva nytt svar */}
      <ThreadResponse threadId={thread.id} />

      {/* "Load more" knapp */}
      {hasMore && (
        <button
          className="load-more-button"
          onClick={(e) => {
            e.stopPropagation();
            loadMore(); // hämtar nästa batch
          }}
          disabled={isFetching}
        >
          {isFetching ? "Loading..." : "Read more responses"}
        </button>
      )}
    </div>
  );
}
