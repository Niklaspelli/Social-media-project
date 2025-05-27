import React, { useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext"; // import auth context
import useCreateFeedPost from "../../../queryHooks/feed/useCreateFeedPost";

const FeedPostForm = ({ onPostCreated }) => {
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {}; // get tokens safely

  const [content, setContent] = useState("");
  const { mutate: createPost, isLoading, isError, error } = useCreateFeedPost();

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost(
      { content, accessToken, csrfToken }, // pass tokens here
      {
        onSuccess: () => {
          setContent("");
          onPostCreated?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <InputGroup>
        <FormControl
          as="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="mt-4"
        />
      </InputGroup>
      <Button
        variant="primary"
        type="submit"
        className="mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
      {isError && <p style={{ color: "red" }}>{error.message}</p>}
    </form>
  );
};

export default FeedPostForm;
