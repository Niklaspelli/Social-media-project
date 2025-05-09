import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Image } from "react-bootstrap";

const AllFeed = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken"); // or however you store it

  useEffect(() => {
    const fetchFriendFeed = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/friends-feed", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      }
    };

    fetchFriendFeed();
  }, [accessToken]);

  return (
    <Container style={LoginContainerStyle}>
      <h2 className="text-center text-white mb-4">Feed</h2>

      <div style={scrollContainerStyle}>
        {posts.length === 0 ? (
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
  maxHeight: "80vh", // Adjust the max height as needed
  overflowY: "scroll", // Enables scrolling
  paddingBottom: "20px", // Add some padding to avoid the last post being cut off
};
