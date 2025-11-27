import { useState, useEffect } from "react";
import { Card, Button, Image } from "react-bootstrap";
import useDeleteEventFeedPost from "../../../queryHooks/event-feed/useDeleteEventFeedPost";
import DeleteButton from "../../../components/DeleteButton";

const EventFeedList = ({ eventOverviewData }) => {
  const feed = eventOverviewData?.feed;
  const totalPosts = feed?.total || 0;
  const limit = feed?.limit || 10;
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const { mutate: deleteEventFeedPost } = useDeleteEventFeedPost();

  // Initial load + update when eventOverviewData changes
  useEffect(() => {
    if (feed?.posts) {
      setAllPosts(feed.posts.slice(0, offset + limit));
    }
  }, [feed, offset, limit]);

  const handleLoadMore = () => setOffset((prev) => prev + limit);

  if (!allPosts.length) return <p>No posts yet.</p>;

  return (
    <div className="mt-4">
      {allPosts.map((post) => (
        <Card key={post.id} className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center mb-2">
              <Image
                src={post.avatar || "https://i.pravatar.cc/60"}
                alt={post.username}
                roundedCircle
                width={50}
                height={50}
                className="me-3 border border-light shadow-sm"
              />
              <div>
                <strong>{post.username}</strong>
                <p className="text-muted mb-0">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-black">{post.content}</p>
            <DeleteButton
              onDelete={() => {
                deleteEventFeedPost({ postId: post.id });
                setAllPosts((prev) => prev.filter((p) => p.id !== post.id));
              }}
            />
          </Card.Body>
        </Card>
      ))}

      {allPosts.length < totalPosts && (
        <div className="text-center">
          <Button variant="primary" onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventFeedList;
