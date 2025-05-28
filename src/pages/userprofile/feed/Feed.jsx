import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import FeedPostForm from "./FeedPostForm";
import { Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import DeleteButton from "../../../components/DeleteButton";

import useUserFeedPosts from "../../../queryHooks/feed/useUserFeedPosts";
import useDeleteFeedPost from "../../../queryHooks/feed/useDeleteFeedPost";

const Feed = () => {
  const { authData } = useAuth();
  const { userId: loggedInUserId, accessToken, csrfToken } = authData;
  const { id: userId } = useParams();
  const isOwnProfile = loggedInUserId === Number(userId);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUserFeedPosts(userId, accessToken);

  const { mutate: deleteFeedPost, isLoading: isDeleting } = useDeleteFeedPost(
    userId,
    accessToken
  );

  // Helper för att extrahera YouTube-ID och rensa bort länken
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

  const parseContent = (content) => {
    const match = content.match(youtubeRegex);
    const videoID = match ? match[1] : null;
    const cleaned = content.replace(youtubeRegex, "").trim();
    return { videoID, cleaned };
  };

  const handlePostCreated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="text-center">
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
    <div>
      {isOwnProfile && <FeedPostForm onPostCreated={handlePostCreated} />}

      <div className="mt-4">
        {posts.length === 0 ? (
          <p>No posts to show.</p>
        ) : (
          posts.map((post) => {
            const { videoID, cleaned } = parseContent(post.content);

            return (
              <Card key={post.id} className="mb-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <strong className="me-2">{post.username}</strong>
                    <p
                      className="text-muted"
                      style={{ fontSize: "0.8em", marginBottom: 0 }}
                    >
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/** Den rensade texten */}
                  {cleaned && (
                    <Card.Text
                      style={{
                        color: "gray",
                        fontSize: "0.9em",
                        lineHeight: "1.6",
                      }}
                    >
                      {cleaned}
                    </Card.Text>
                  )}

                  {/** Iframe-embed om videoID finns */}
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

                  <Button variant="outline-primary" size="sm">
                    Comment
                  </Button>

                  {isOwnProfile && (
                    <DeleteButton
                      onDelete={() => deleteFeedPost({ postId: post.id })}
                      disabled={isDeleting}
                    />
                  )}
                </Card.Body>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;
