import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import AcceptRejectButton from "./AcceptRejectButton";
import useFriends from "../../queryHooks/friends/useFetchFriends";
import useReceivedRequests from "../../queryHooks/friends/useReceivedRequest";

function FriendList() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const loggedInUserId = authData?.userId;

  const {
    data: incomingRequests = [],
    isLoading: loadingRequests,
    isError: errorRequests,
    error: requestsError,
  } = useReceivedRequests(token);

  const {
    data: friends = [],
    isLoading: loadingFriends,
    isError: errorFriends,
    error: friendsError,
  } = useFriends(authData?.userId, authData?.accessToken);

  const isOnline = (lastSeen) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastSeen) > fiveMinutesAgo;
  };

  if (loadingFriends || loadingRequests) {
    return <div>🔄 Laddar vänlista...</div>;
  }

  if (errorFriends || errorRequests) {
    return (
      <div style={{ color: "red" }}>
        ❌ Ett fel inträffade:
        <ul>
          {errorFriends && <li>Vänner: {friendsError.message}</li>}
          {errorRequests && <li>Förfrågningar: {requestsError.message}</li>}
        </ul>
      </div>
    );
  }

  return (
    <Container style={{ color: "white" }}>
      <h2>Your Friend Requests</h2>
      <Row>
        {incomingRequests.length === 0 && <p>No incoming requests</p>}
        {incomingRequests.map((request) => (
          <Col key={request.sender_id} xs={12} md={6}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={request.avatar}
                alt={request.username}
                roundedCircle
                width={50}
                height={50}
              />
              <div>
                <strong>{request.username}</strong>
                <AcceptRejectButton
                  senderId={request.sender_id}
                  receiverId={loggedInUserId}
                  loggedInUserId={loggedInUserId}
                  isFriend={false}
                  isPending={true}
                  incomingRequest={true}
                  avatar={request.avatar}
                  username={request.username}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <h2 className="mt-5">Your Friends</h2>
      <Row>
        {friends.map((friend) => (
          <Col key={friend.id} xs={12} md={4} className="mb-4 text-center">
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
