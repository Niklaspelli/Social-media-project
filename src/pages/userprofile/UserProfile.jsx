import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMusic } from "@fortawesome/free-solid-svg-icons";
import AddFriendButton from "./AddFriendButton";

function UserProfile() {
  const { id: receiverId } = useParams(); // Using `useParams` to get the profileUserId

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, authData } = useAuth();
  const token = authData?.accessToken;
  const senderId = authData?.userId;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetching the user profile only if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchUserProfile = async () => {
      try {
        const csrfToken = getCookie("csrfToken"); // You need to implement getCookie

        const response = await fetch(
          `http://localhost:5000/api/auth/profile/${receiverId}`, // Profile of user fetched
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "CSRF-TOKEN": csrfToken, // ✅ Include token
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        console.log("Fetched user profile:", data); // ✅ log entire user object

        setProfile(data); // Set the profile data
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Loading is false once the request is completed
      }
    };

    if (isAuthenticated && token) {
      fetchUserProfile(); // Fetch the profile only if the user is authenticated
    } else {
      setError("You must be logged in to view this profile.");
      setLoading(false); // Loading is false if not authenticated
    }
  }, [receiverId, isAuthenticated]); // Hook dependencies are profileUserId and isAuthenticated

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container style={{ color: "white" }}>
      {profile ? (
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

            {/* Add Friend Button */}
            <AddFriendButton
              senderId={senderId}
              receiverId={receiverId}
              token={token}
            />

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
                <span>{profile.music_taste}</span>
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
      ) : (
        <p className="no-profile">No profile available.</p>
      )}
    </Container>
  );
}

export default UserProfile;
