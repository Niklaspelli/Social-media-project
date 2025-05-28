import React from "react";
import { Link } from "react-router-dom";
import { Container, Card, Image, Spinner } from "react-bootstrap";
import useFriendsFeed from "../../../queryHooks/feed/useFriendsFeed";

const AllFeed = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { data: posts = [], isLoading, isError } = useFriendsFeed(accessToken);

  // Regex för både att extrahera videoID och plocka bort länken
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Dra ut ID och rensa texten på länken
  const parseContent = (content) => {
    const match = content.match(youtubeRegex);
    const videoID = match ? match[1] : null;
    // Ta bort hela URL:en från texten
    const cleaned = content.replace(youtubeRegex, "").trim();
    return { videoID, cleaned };
  };

  return (
    <Container style={LoginContainerStyle}>
      <h2 className="text-center text-white mb-4">Feed</h2>

      <div style={scrollContainerStyle}>
        {isLoading ? (
          <div className="text-center text-white">
            <Spinner animation="border" /> <p>Loading...</p>
          </div>
        ) : isError ? (
          <p className="text-white">Failed to load feed</p>
        ) : posts.length === 0 ? (
          <p className="text-white">No posts to show</p>
        ) : (
          posts.map((post) => {
            const { videoID, cleaned } = parseContent(post.content);
            return (
              <Card key={post.id} className="mb-3 p-3 bg-dark text-white">
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src={post.avatar || "default-avatar.png"}
                    alt="User Avatar"
                    roundedCircle
                    width={60}
                    height={60}
                    className="me-3"
                  />
                  <Link
                    to={`/user/${post.userId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {" "}
                    <h5>{post.username || "Unknown User"}</h5>
                  </Link>
                </div>
                {/** Den rensade texten */}
                {cleaned && (
                  <Card.Text
                    style={{
                      color: "white",
                      fontSize: "0.9em",
                      lineHeight: "1.6",
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

                <small className="text-muted-white">
                  {new Date(post.created_at).toLocaleString()}
                </small>
              </Card>
            );
          })
        )}
      </div>
    </Container>
  );
};

export default AllFeed;

const LoginContainerStyle = {
  marginTop: "20px",
  marginBottom: "30px",
};

const scrollContainerStyle = {
  maxHeight: "80vh",
  overflowY: "auto",
  paddingBottom: "20px",
};
