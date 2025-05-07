import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMusic } from "@fortawesome/free-solid-svg-icons";
import AddFriendButton from "./AddFriendButton";

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
        <Col xs={12} md={4} className="text-center mb-3">
          <Image
            src={profile.avatar}
            alt="User Avatar"
            roundedCircle
            width={200}
            height={200}
          />
          <p style={{ color: "green" }}>
            <strong>{profile.username}</strong>
          </p>

          {/* Add friend button if not the logged-in user */}
          {Number(authData?.userId) !== Number(receiverId) && (
            <AddFriendButton
              senderId={authData?.userId}
              receiverId={receiverId}
              token={token}
            />
          )}

          <p>
            <strong>
              Followers: <span>{profile.numberOfFriends}</span>
            </strong>
          </p>
          <div className="mb-2">
            <strong>Sex:</strong> <span>{profile.sex}</span>
          </div>
          <div className="mb-2">
            <strong>Relationship Status:</strong>{" "}
            <span>{profile.relationship_status}</span>
          </div>
          <Row>
            <div className="mb-2">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{profile.location}</span>
            </div>
            <div className="mb-2">
              <FontAwesomeIcon icon={faMusic} />
              <span>{profile.musicTaste}</span>
            </div>
          </Row>
          <div className="mb-2">
            <strong>Interests:</strong> <span>{profile.interest}</span>
          </div>
        </Col>
        <Col xs={12} md={5}>
          <div>
            <strong>Bio:</strong> <span>{profile.bio}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
