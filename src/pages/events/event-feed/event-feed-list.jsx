/* import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Card, Button, Spinner, Image } from "react-bootstrap";
import useEventFeedPosts from "../../../queryHooks/event-feed/useEventFeedPosts";
import useDeleteEventFeedPost from "../../../queryHooks/event-feed/useDeleteEventFeedPost";

import DeleteButton from "../../../components/DeleteButton";

const EventFeedList = () => {
  const { id: eventId } = useParams();
  const { authData } = useAuth();
  const { accessToken } = authData;

  const limit = 4;
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState([]);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useEventFeedPosts(eventId, accessToken, limit, offset);

   const { mutate: deleteEventFeedPost, isLoading: isDeleting } = useDeleteEventFeedPost();

  // När data ändras från queryn, lägg till i vår samlade lista
  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prev) => {
        // undvik dubbletter
        const newPosts = posts.filter(
          (p) => !prev.some((prevP) => prevP.id === p.id)
        );
        return [...prev, ...newPosts];
      });
    }
  }, [posts]);

  const handleLoadMore = () => setOffset((prev) => prev + limit);

  if (isLoading && offset === 0) return <Spinner animation="border" />;

  if (isError)
    return (
      <p style={{ color: "red" }}>Failed to load posts: {error.message}</p>
    );

  return (
    <div className="mt-4">
      {allPosts.map((post) => (
        <Card key={post.id} className="mb-4 shadow-sm">
          <Card.Body>
            <Image
              src={post.avatar || "https://i.pravatar.cc/60"}
              alt={post.username}
              roundedCircle
              width={80}
              height={80}
              className="me-3 border border-light shadow-sm"
            />
            <strong>{post.username}</strong>
            <p className="text-black">
              {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="text-black">{post.content}</p>
          </Card.Body>
        </Card>
      ))}

      {posts.length === limit && (
        <Button variant="primary" onClick={handleLoadMore}>
          See more
        </Button>
      )}
       {isOwnPost && (
                    <DeleteButton
                      onDelete={() => deleteEventFeedPost({ postId: post.id })}
                      disabled={isDeleting}
                    />
                  )}
    </div>
  );
};

export default EventFeedList;
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Card, Button, Spinner, Image } from "react-bootstrap";
import useEventFeedPosts from "../../../queryHooks/event-feed/useEventFeedPosts";
import useDeleteEventFeedPost from "../../../queryHooks/event-feed/useDeleteEventFeedPost";
import DeleteButton from "../../../components/DeleteButton";

const EventFeedList = () => {
  const { id: eventId } = useParams();
  const { authData } = useAuth();
  const { accessToken, userId } = authData || {};

  const limit = 4;
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState([]);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useEventFeedPosts(eventId, accessToken, limit, offset);

  const { mutate: deleteEventFeedPost, isLoading: isDeleting } =
    useDeleteEventFeedPost();

  // Uppdatera lokala posts när queryn ändras
  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prev) => {
        const newPosts = posts.filter(
          (p) => !prev.some((prevP) => prevP.id === p.id)
        );
        return [...prev, ...newPosts];
      });
    }
  }, [posts]);

  const handleLoadMore = () => setOffset((prev) => prev + limit);

  if (isLoading && offset === 0) return <Spinner animation="border" />;
  if (isError)
    return (
      <p style={{ color: "red" }}>Failed to load posts: {error.message}</p>
    );

  return (
    <div className="mt-4">
      {allPosts.map((post) => {
        const isOwnPost = post.user_id === userId;

        return (
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

              {isOwnPost && (
                <DeleteButton
                  onDelete={() =>
                    deleteEventFeedPost(
                      { postId: post.id },
                      {
                        onSuccess: () =>
                          setAllPosts((prev) =>
                            prev.filter((p) => p.id !== post.id)
                          ),
                      }
                    )
                  }
                  disabled={isDeleting}
                />
              )}
            </Card.Body>
          </Card>
        );
      })}

      {posts.length === limit && (
        <Button variant="primary" onClick={handleLoadMore}>
          See more
        </Button>
      )}
    </div>
  );
};

export default EventFeedList;

/* Att titta på senare:

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery(
  ["eventFeedPosts", eventId],
  ({ pageParam = 0 }) => fetchEventFeedPosts({ eventId, accessToken, offset: pageParam, limit }),
  {
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === limit ? pages.length * limit : undefined,
  }
); */
