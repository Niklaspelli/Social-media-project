import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Card, Button, Spinner, Image } from "react-bootstrap";
import DeleteButton from "../../../components/DeleteButton";
import useEventFeedPosts from "../../../queryHooks/event-feed/useEventFeedPosts";
import useDeleteEventFeedPost from "../../../queryHooks/event-feed/useDeleteEventFeedPost";

const EventFeedList = () => {
  const { id: eventId } = useParams();

  const { authData } = useAuth();
  const { accessToken, userId } = authData;

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useEventFeedPosts(eventId, accessToken);

  const { mutate: deletePost, isLoading: isDeleting } =
    useDeleteEventFeedPost(eventId);

  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

  const parseContent = (content) => {
    const match = content.match(youtubeRegex);
    const videoID = match ? match[1] : null;
    const cleaned = content.replace(youtubeRegex, "").trim();
    return { videoID, cleaned };
  };

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" /> <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <p style={{ color: "red" }}>Failed to load posts: {error.message}</p>
    );
  }

  return (
    <div className="mt-4">
      {posts.length === 0 ? (
        <p>No posts to show.</p>
      ) : (
        posts.map((post) => {
          const { videoID, cleaned } = parseContent(post.content);
          const isOwnPost = post.user_id === userId;

          return (
            <Card key={post.id} className="mb-4 shadow-sm">
              <Card.Body>
                <Image
                  src={post.avatar || "https://i.pravatar.cc/60"}
                  alt={post.username || "Creator"}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3 border border-light shadow-sm"
                />
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">{post.username}</strong>
                  <p
                    className="text-muted"
                    style={{ fontSize: "0.8em", marginBottom: 0 }}
                  >
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>

                {cleaned && (
                  <Card.Text
                    style={{
                      color: "#555",
                      fontSize: "0.95em",
                      lineHeight: "1.5",
                    }}
                  >
                    {cleaned}
                  </Card.Text>
                )}

                {videoID && (
                  <div className="mb-3">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoID}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    Comment
                  </Button>

                  {isOwnPost && (
                    <DeleteButton
                      onDelete={() => deletePost({ postId: post.id })}
                      disabled={isDeleting}
                    />
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default EventFeedList;
