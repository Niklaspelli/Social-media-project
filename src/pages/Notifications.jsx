import { useAuth } from "../context/AuthContext";
import useReceivedRequests from "../queryHooks/friends/useReceivedRequest";
import { Container, Row, Col, Image } from "react-bootstrap";
import AcceptRejectButton from "./userprofile/AcceptRejectButton";

function Notifications() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const loggedInUserId = authData?.userId;

  const {
    data: incomingRequests = [],
    isLoading: loadingRequests,
    isError: errorRequests,
    error: requestsError,
  } = useReceivedRequests(token);

  return (
    <Container>
      <h1>Notifications</h1>
      <h2>Your Friend Requests</h2>
      <Row>
        {incomingRequests.length === 0 && <p>No incoming notifications</p>}
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
    </Container>
  );
}

export default Notifications;
