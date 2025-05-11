import { useNavigate } from "react-router-dom";
import { Container, Card, Image, Spinner } from "react-bootstrap";
import useFriendsFeed from "../../../queryHooks/feed/useFriendsFeed";

const AllFeed = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const { data: posts = [], isLoading, isError } = useFriendsFeed(accessToken);

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
          posts.map((post) => (
            <Card key={post.id} className="mb-3 p-3 bg-dark text-white">
              <div className="d-flex align-items-center mb-3">
                <Image
                  src={post.avatar || "default-avatar.png"}
                  alt="User Avatar"
                  roundedCircle
                  width={60}
                  height={60}
                  className="mr-3"
                />
                <h5>{post.username || "Unknown User"}</h5>
              </div>
              <p>{post.content}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </Card>
          ))
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
  overflowY: "scroll",
  paddingBottom: "20px",
};
