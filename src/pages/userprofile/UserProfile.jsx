import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMusic } from "@fortawesome/free-solid-svg-icons";

import AddFriendButton from "./AddFriendButton";
import Feed from "./feed/Feed";

import { useUserProfile } from "../../queryHooks/users/useUserProfile"; // andra användare
import { useCurrentUserProfile } from "../../queryHooks/users/useCurrentUserProfile"; // inloggad användare
import useMutualFriends from "../../queryHooks/friends/useMutualFriends";
import PeopleYouMayKnow from "./PeopleYouMayKnow";

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

  const { data: mutualFriends = [] } = useMutualFriends(
    authData?.userId, // logged in user
    receiverId, // the profile user you’re viewing
    authData?.accessToken // JWT
  );

  // ⚡ Decide which profile to use
  const profile = isOwnProfile ? currentUserProfile : otherUserProfile;
  const isLoading = isOwnProfile ? isLoadingCurrent : isLoadingOther;
  const error = isOwnProfile ? errorCurrent : errorOther;

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <Container className="py-4" style={{ color: "white" }}>
      <Row className="g-4">
        {/* LEFT COLUMN */}
        <Col xs={12} md={5} className="text-center">
          {/* Avatar */}
          <Image
            src={profile.avatar}
            alt="User avatar"
            roundedCircle
            width={180}
            height={180}
            className="mb-3 shadow"
          />

          {/* Add Friend Button */}
          {!isOwnProfile && (
            <div className="mb-3">
              <AddFriendButton
                senderId={authData?.userId}
                receiverId={receiverId}
                token={authData?.accessToken}
              />
            </div>
          )}

          {/* Profile Details */}
          <Card className="mb-3 shadow-sm bg-dark border-0 text-white">
            <Card.Body>
              <Card.Title className="text-white fs-6 mb-3">
                Profile Details
              </Card.Title>

              <Row className="text-start">
                <Col xs={12} className="mb-2">
                  <strong>Friends:</strong> {profile.numberOfFriends || 0}
                </Col>
                {!isOwnProfile && mutualFriends.length > 0 && (
                  <Card className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title className="fs-6 text-muted mb-3">
                        {mutualFriends.length} mutual friend
                        {mutualFriends.length !== 1 && "s"}
                      </Card.Title>

                      <div className="d-flex align-items-center">
                        {/* Avatar stack */}
                        <div style={{ display: "flex" }}>
                          {mutualFriends.slice(0, 3).map((friend, index) => (
                            <Image
                              key={friend.id}
                              src={friend.avatar}
                              title={friend.username}
                              roundedCircle
                              width={30}
                              height={30}
                              style={{
                                border: "2px solid #fff",
                                marginLeft: index === 0 ? 0 : -12,
                                cursor: "pointer",
                                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                              }}
                            />
                          ))}
                        </div>

                        {/* More friends indicator */}
                        {mutualFriends.length > 3 && (
                          <span
                            className="ms-3 text-muted"
                            style={{ fontSize: "0.9rem" }}
                          >
                            +{mutualFriends.length - 3} more
                          </span>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                )}
                {!isOwnProfile && (
                  <Card className="mb-3 shadow-sm bg-dark border-0 text-white">
                    <Card.Body>
                      <PeopleYouMayKnow />
                    </Card.Body>
                  </Card>
                )}{" "}
                <Col xs={12} className="mb-2"></Col>
                <Col xs={12} className="mb-2">
                  <strong>Sex:</strong> {profile.sex || "Not specified"}
                </Col>
                <Col xs={12} className="mb-2">
                  <strong>Relationship Status:</strong>{" "}
                  {profile.relationship_status || "Unknown"}
                </Col>
                <Col xs={12} className="mb-2 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    aria-label="Location"
                    className="me-2 text-secondary"
                  />
                  {profile.location || "No location provided"}
                </Col>
                <Col xs={12} className="mb-2 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faMusic}
                    aria-label="Music taste"
                    className="me-2 text-secondary"
                  />
                  {profile.music_taste || "No music preference"}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Interests */}
          <Card className="mb-3 shadow-sm bg-dark border-0">
            <Card.Body>
              <Card.Title className="text-muted fs-6 mb-2">
                Interests
              </Card.Title>
              <Card.Text className="text-light">
                {profile.interest || "No interest specified"}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Bio */}
          <Card className="shadow-sm bg-dark border-0">
            <Card.Body>
              <Card.Title className="text-muted fs-6 mb-2">Bio</Card.Title>
              <Card.Text
                style={{
                  color: "#d1d1d1",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                }}
              >
                {profile.bio || "No bio available."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT COLUMN - FEED */}
        <Col xs={12} md={7}>
          <Feed />
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
