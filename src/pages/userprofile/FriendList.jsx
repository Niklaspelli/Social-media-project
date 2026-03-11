import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import useFriends from "../../queryHooks/friends/useFetchFriends";
import { useUserProfile } from "../../queryHooks/users/useUserProfile";

function FriendList() {
  const { authData } = useAuth();
  const { id } = useParams();

  const token = authData?.accessToken;
  const targetUserId = id || authData?.userId;
  const isOwnProfile = !id || Number(id) === Number(authData?.userId);

  const { data: profile } = useUserProfile(targetUserId);
  const {
    data: allConnections = [],
    isLoading,
    isError,
    error,
  } = useFriends(targetUserId, token);

  console.log("all connections:", allConnections);

  // 🔥 FIX: Filtrera så att endast faktiska vänner visas i listan
  const friends = allConnections.filter((f) => f.status === "accepted");

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
      <h2 className="mt-4 text-center">
        {isOwnProfile
          ? "Your Friends"
          : profile?.username
            ? `${profile.username}'s Friends`
            : "Friends"}
        {/* Valfritt: Visa antal vänner */}
        <span style={{ fontSize: "0.5em", color: "gray", marginLeft: "10px" }}>
          ({friends.length})
        </span>
      </h2>

      <Row>
        {friends.length === 0 ? (
          <p className="text-center mt-4 text-muted">No friends found yet.</p>
        ) : (
          friends.map((friend, index) => (
            <Col
              key={`${friend.id}-${index}`}
              xs={12}
              md={4}
              className="mb-4 text-center"
            >
              {/* Din befintliga Link och profil-kod här... */}
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
                  {isOnline(friend.last_seen) ? "Online" : "Offline"}
                </small>
              </Link>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default FriendList;
