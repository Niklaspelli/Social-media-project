import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import useFriends from "../../queryHooks/friends/useFetchFriends";

function FriendList() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const userId = authData?.userId;

  const {
    data: friends = [],
    isLoading,
    isError,
    error,
  } = useFriends(userId, token);

  console.log("vänner:", friends);

  const isOnline = (lastSeen) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastSeen) > fiveMinutesAgo;
  };

  const acceptedFriends = friends.filter((f) => f.status === "accepted");

  if (isLoading) return <div>🔄 Laddar vänlista...</div>;
  if (isError)
    return (
      <div style={{ color: "red" }}>❌ Ett fel inträffade: {error.message}</div>
    );

  // Remove duplicates just in case
  const uniqueFriends = Array.from(
    new Map(friends.map((f) => [f.id, f])).values()
  );

  return (
    <Container style={{ color: "white" }}>
      <h2 className="mt-4 text-center">Your Friends</h2>
      <Row>
        {uniqueFriends.map((friend, index) => (
          <Col
            key={`${friend.id}-${index}`}
            xs={12}
            md={4}
            className="mb-4 text-center"
          >
            <Link
              to={`/user/${friend.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Image
                src={friend.avatar}
                alt={friend.username}
                roundedCircle
                width={100}
                height={100}
              />
              <p>{friend.username}</p>
              <small
                style={{
                  color: isOnline(friend.last_seen) ? "lightgreen" : "gray",
                }}
              >
                {isOnline(friend.last_seen)
                  ? "Online"
                  : `Last seen ${new Date(
                      friend.last_seen
                    ).toLocaleTimeString()}`}
              </small>
              <span
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: isOnline(friend.last_seen)
                    ? "limegreen"
                    : "gray",
                  border: "2px solid white",
                }}
              ></span>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FriendList;
