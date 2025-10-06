import { useAuth } from "../context/AuthContext";
import useInvitationRequests from "../queryHooks/events/useInvitationRequests";
import { Container, Row, Col, Image } from "react-bootstrap";
import AcceptRejectButton from "./userprofile/AcceptRejectButton";

function EventInvitations() {
  const { authData } = useAuth();
  const token = authData?.accessToken;

  const { data: invitations = [] } = useInvitationRequests(token);

  return (
    <Container>
      <h1>Event Invitations</h1>
      <Row>
        {invitations.length === 0 && <p>No incoming event invitations</p>}
        {invitations.map((invite) => (
          <Col key={invite.event_id} xs={12} md={6}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={invite.creator_avatar}
                alt={invite.creator_name}
                roundedCircle
                width={50}
                height={50}
              />
              <div>
                <h5>{invite.title}</h5>
                <p>{invite.description}</p>
                <AcceptRejectButton
                  type="event"
                  id={invite.event_id} // eventId
                  receiverId={authData.userId} // invited user
                  loggedInUserId={authData.userId}
                  username={invite.creator_name}
                  avatar={invite.creator_avatar}
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

export default EventInvitations;
