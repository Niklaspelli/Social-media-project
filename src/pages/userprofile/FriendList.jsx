import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import useFriends from "../../queryHooks/friends/useFetchFriends";
import { useUserProfile } from "../../queryHooks/users/useUserProfile";

function FriendList() {
  const { authData } = useAuth();
  const { id } = useParams();

  // FIX 1: Definiera token så att useFriends inte kraschar
  const token = authData?.accessToken;
  const targetUserId = id || authData?.userId;
  const isOwnProfile = !id || Number(id) === Number(authData?.userId);

  // Hämtar namnet för rubriken
  const { data: profile } = useUserProfile(targetUserId);

  // Hämtar vännerna - nu med en definierad 'token'
  const {
    data: friends = [],
    isLoading,
    isError,
    error,
  } = useFriends(targetUserId, token);

  const isOnline = (lastSeen) => {
    if (!lastSeen) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastSeen) > fiveMinutesAgo;
  };

  if (isLoading)
    return (
      <div className="text-white text-center mt-5">🔄 Laddar vänlista...</div>
    );
  if (isError)
    return (
      <div style={{ color: "red" }}>❌ Ett fel inträffade: {error.message}</div>
    );

  return (
    <Container style={{ color: "white" }}>
      {/* FIX 2: Dynamisk rubrik */}
      <h2 className="mt-4 text-center">
        {isOwnProfile
          ? "Your Friends"
          : profile?.username
            ? `${profile.username}'s Friends`
            : "Friends"}
      </h2>

      <Row>
        {friends.map((friend, index) => (
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
                style={{ objectFit: "cover" }}
              />
              <p className="mb-0 mt-2">{friend.username}</p>
              <small
                style={{
                  color: isOnline(friend.last_seen) ? "lightgreen" : "gray",
                }}
              >
                {isOnline(friend.last_seen)
                  ? "Online"
                  : `Last seen ${new Date(friend.last_seen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </small>
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "8px",
                  width: 12,
                  height: 12,
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
