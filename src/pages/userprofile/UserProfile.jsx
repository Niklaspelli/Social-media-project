import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMusic } from "@fortawesome/free-solid-svg-icons";

import AddFriendButton from "./AddFriendButton";
import Feed from "./feed/Feed";

import { useUserProfile } from "../../queryHooks/users/useUserProfile"; // andra användare
import { useCurrentUserProfile } from "../../queryHooks/users/useCurrentUserProfile"; // inloggad användare

function UserProfile() {
  const { id: receiverId } = useParams();
  const { authData } = useAuth();
  const isOwnProfile = Number(authData?.userId) === Number(receiverId);

  // ⚡ Call both hooks at the top level
  const {
    data: currentUserProfile,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useCurrentUserProfile();

  const {
    data: otherUserProfile,
    isLoading: isLoadingOther,
    error: errorOther,
  } = useUserProfile(receiverId);

  // ⚡ Decide which profile to use
  const profile = isOwnProfile ? currentUserProfile : otherUserProfile;
  const isLoading = isOwnProfile ? isLoadingCurrent : isLoadingOther;
  const error = isOwnProfile ? errorCurrent : errorOther;

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <Container style={{ color: "white" }}>
      <Row className="align-items-start">
        <Col xs={12} md={5} className="text-center mb-3">
          <Image
            src={profile.avatar}
            alt="User Avatar"
            roundedCircle
            width={200}
            height={200}
            className="mb-3"
          />

          {!isOwnProfile && (
            <AddFriendButton
              senderId={authData?.userId}
              receiverId={receiverId}
              token={authData?.accessToken}
            />
          )}

          {/* Profile Details */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted fs-6">
                Profile Details
              </Card.Title>
              <Row>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Followers:</strong> {profile.numberOfFriends || 0}
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Sex:</strong> {profile.sex || "Not specified"}
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Relationship Status:</strong>{" "}
                  {profile.relationship_status || "Unknown"}
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="me-2 text-secondary"
                  />
                  {profile.location || "No location provided"}
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <FontAwesomeIcon
                    icon={faMusic}
                    className="me-2 text-secondary"
                  />
                  {profile.music_taste || "No music preference"}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Interest */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Interest</Card.Title>
              <span>{profile.interest || "No interest specified"}</span>
            </Card.Body>
          </Card>

          {/* Bio */}
          <Card className="mb-3 shadow-sm bg-light">
            <Card.Body>
              <Card.Title className="text-black fs-6">Bio</Card.Title>
              <Card.Text
                style={{
                  color: "gray",
                  fontSize: "0.9em",
                  lineHeight: "1.6",
                }}
              >
                {profile.bio || "No bio available."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Feed Section */}
        <Col xs={12} md={5}>
          <Feed />
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
