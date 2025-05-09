import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import { Container, Row, Col, Image, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMusic } from "@fortawesome/free-solid-svg-icons";
import AddFriendButton from "./AddFriendButton";
import Feed from "./feed/Feed";

function UserProfile() {
  const { id: receiverId } = useParams(); // Get receiverId from URL params
  const { authData } = useAuth(); // Get auth data
  const { userProfiles, fetchUserProfile, loading, error } = useUsers(); // Get user profile and fetch function

  const token = authData?.accessToken; // Get the token

  useEffect(() => {
    if (token && receiverId && !userProfiles[receiverId]) {
      fetchUserProfile(receiverId, token);
    }
  }, [receiverId, token, fetchUserProfile, userProfiles]);

  // Access the profile data for the current user
  const profile = userProfiles[receiverId]; // Get the profile from context

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!profile) return <p>No profile available.</p>;

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
          {/*  <p style={{ color: "green" }}>
            <strong>{profile.username}</strong>
          </p> */}

          {/* Add friend button if not the logged-in user */}
          {Number(authData?.userId) !== Number(receiverId) && (
            <AddFriendButton
              senderId={authData?.userId}
              receiverId={receiverId}
              token={token}
            />
          )}

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted fs-6">
                Profile Details
              </Card.Title>
              <Row>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Followers:</strong>{" "}
                  <span>{profile.numberOfFriends}</span>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Sex:</strong> <span>{profile.sex}</span>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <strong>Relationship Status:</strong>{" "}
                  <span>{profile.relationship_status}</span>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="me-2 text-secondary"
                  />
                  <span>{profile.location}</span>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <FontAwesomeIcon
                    icon={faMusic}
                    className="me-2 text-secondary"
                  />
                  <span>{profile.music_taste}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Interest:</Card.Title>
              <span>{profile.interest}</span>
            </Card.Body>
          </Card>
          <Card className="mb-3 shadow-sm bg-grey">
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
        <Col xs={12} md={5}>
          <Feed />
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
