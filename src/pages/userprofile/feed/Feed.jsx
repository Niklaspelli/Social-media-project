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
  const { userId: loggedInUserId, accessToken } = authData;
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

  const handlePostCreated = () => {
    refetch(); // Refresh after a new post is added
  };

  return (
    <div>
      {isOwnProfile && <FeedPostForm onPostCreated={handlePostCreated} />}

      <div className="mt-4">
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading...</p>
          </div>
        ) : isError ? (
          <p style={{ color: "red" }}>Failed to load posts: {error.message}</p>
        ) : posts.length === 0 ? (
          <p>No posts to show.</p>
        ) : (
          posts.map((post) => (
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
                <Card.Text
                  style={{
                    color: "gray",
                    fontSize: "0.9em",
                    lineHeight: "1.6",
                  }}
                >
                  {post.content}
                </Card.Text>
                <Button variant="outline-primary" size="sm">
                  Comment
                </Button>
                <div className="mt-2">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    style={{ cursor: "pointer", color: "black" }}
                    size="1x"
                  />
                  <span style={{ marginLeft: "4px" }}>100000000 likes</span>
                  {isOwnProfile && (
                    <DeleteButton
                      onDelete={() => deleteFeedPost({ postId: post.id })}
                    />
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
