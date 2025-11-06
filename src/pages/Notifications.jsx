import { useAuth } from "../context/AuthContext";
import useReceivedRequests from "../queryHooks/friends/useReceivedRequest";
import useInvitationRequests from "../queryHooks/events/useInvitationRequests";
import { Container, Image } from "react-bootstrap";
import AcceptRejectButton from "./userprofile/AcceptRejectButton";

function Notifications() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const loggedInUserId = authData?.userId;

  // Friend requests
  const { data: incomingFriendRequests = [] } = useReceivedRequests(token);

  // Event invitations
  const { data: incomingEventInvitations = [] } = useInvitationRequests(token);

  const hasNotifications =
    incomingFriendRequests.length > 0 || incomingEventInvitations.length > 0;

  return (
    <Container className="mt-4">
      <h1>Notifications</h1>

      {!hasNotifications && <p>No notifications!</p>}

      <div className="d-flex flex-column gap-3">
        {/* Friend requests */}
        {incomingFriendRequests.map((request, index) => (
          <div
            key={`${request.sender_id}-${index}`}
            className="d-flex align-items-center gap-3 p-2 border rounded"
          >
            <Image
              src={request.avatar}
              alt={request.username}
              roundedCircle
              width={50}
              height={50}
            />
            <AcceptRejectButton
              type="friend"
              id={request.sender_id}
              receiverId={loggedInUserId}
              loggedInUserId={loggedInUserId}
              username={request.username}
              avatar={request.avatar}
              isPending={true}
              incomingRequest={true}
            />
          </div>
        ))}

        {/* Event invitations */}
        {incomingEventInvitations.map((invitation, index) => (
          <div
            key={`${invitation.event_id}-${index}`}
            className="d-flex align-items-center gap-3 p-2 border rounded"
          >
            <Image
              src={invitation.creator_avatar}
              alt={invitation.creator_name}
              roundedCircle
              width={50}
              height={50}
            />
            <AcceptRejectButton
              type="event"
              id={invitation.event_id}
              receiverId={loggedInUserId}
              loggedInUserId={loggedInUserId}
              username={invitation.creator_name}
              avatar={invitation.creator_avatar}
              eventTitle={invitation.title}
              isPending={true}
              incomingRequest={true}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Notifications;
