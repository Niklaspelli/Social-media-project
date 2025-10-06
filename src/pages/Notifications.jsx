import { useAuth } from "../context/AuthContext";
import useReceivedRequests from "../queryHooks/friends/useReceivedRequest";
import useInvitationRequests from "../queryHooks/events/useInvitationRequests";
import { Container, Row, Col, Image } from "react-bootstrap";
import AcceptRejectButton from "./userprofile/AcceptRejectButton";

function Notifications() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const loggedInUserId = authData?.userId;

  // Friend requests
  const { data: incomingFriendRequests = [] } = useReceivedRequests(token);

  // Event invitations
  const { data: incomingEventInvitations = [] } = useInvitationRequests(token);

  return (
    <Container>
      <h1>Notifications</h1>

      {/* Friend Requests */}
      <h2>Your Friend Requests</h2>
      <Row>
        {incomingFriendRequests.length === 0 && (
          <p>No incoming friend requests</p>
        )}
        {incomingFriendRequests.map((request) => (
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
                <AcceptRejectButton
                  type="friend"
                  id={request.sender_id} // senderId
                  receiverId={loggedInUserId}
                  loggedInUserId={loggedInUserId}
                  username={request.username}
                  avatar={request.avatar}
                  isPending={true}
                  incomingRequest={true}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Event Invitations */}
      <h2>Your Event Invitations</h2>
      <Row>
        {incomingEventInvitations.length === 0 && (
          <p>No incoming event invitations</p>
        )}
        {incomingEventInvitations.map((invitation) => (
          <Col key={invitation.event_id} xs={12} md={6}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={invitation.creator_avatar}
                alt={invitation.creator_name}
                roundedCircle
                width={50}
                height={50}
              />
              <div>
                <AcceptRejectButton
                  type="event"
                  id={invitation.event_id} // eventId
                  receiverId={loggedInUserId} // invitedUserId
                  loggedInUserId={loggedInUserId}
                  username={invitation.creator_name}
                  avatar={invitation.creator_avatar}
                  isPending={true}
                  incomingRequest={true}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Notifications;
