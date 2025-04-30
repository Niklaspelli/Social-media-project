import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./UserProfile.css";

function UserProfile() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/users/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Include token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchUserProfile();
    } else {
      setError("You must be logged in to view this profile.");
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile Page</h1>
      {profile ? (
        <div className="profile-details">
          <p style={{ color: "green" }}>
            <strong>Username:</strong> <span>{profile.username}</span>
          </p>
          <p>
            <strong>Avatar:</strong>{" "}
            <img
              src={profile.avatar}
              alt="User Avatar"
              className="user-avatar"
            />
          </p>
          <p>
            <strong>Sex:</strong> <span>{profile.sex}</span>
          </p>
          <p>
            <strong>Relationship Status:</strong>{" "}
            <span>{profile.relationship_status}</span>
          </p>
          <p>
            <strong>Location:</strong> <span>{profile.location}</span>
          </p>
          <p>
            <strong>Music Taste:</strong> <span>{profile.music_taste}</span>
          </p>
          <p>
            <strong>Interests:</strong> <span>{profile.interest}</span>
          </p>
          <p>
            <br />
            <strong>Bio:</strong> <span>{profile.bio}</span>
          </p>
        </div>
      ) : (
        <p className="no-profile">No profile available.</p>
      )}
    </div>
  );
}

export default UserProfile;
