import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the userId from the URL
import { useAuth } from "../../context/AuthContext"; // Import the Auth context
import "./UserProfile.css";

function UserProfile() {
  const { id } = useParams(); // Get the user ID from the URL
  const { isAuthenticated } = useAuth(); // Get authentication status from context
  const [profile, setProfile] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/users/${id}`,
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setProfile(data); // Store the fetched profile data
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (isAuthenticated) {
      // Only fetch the profile if the user is authenticated
      fetchUserProfile(); // Call the fetch function
    } else {
      setError("You must be logged in to view this profile.");
      setLoading(false);
    }
  }, [id, isAuthenticated]); // Dependencies array

  if (loading) {
    return <p>Loading user profile...</p>; // Show loading message
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Show error message
  }

  // Render user profile information
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
