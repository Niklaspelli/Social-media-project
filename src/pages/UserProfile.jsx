import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the userId from the URL
import { useAuth } from "../context/AuthContext"; // Import the Auth context to get the token

function UserProfile() {
  const { id } = useParams(); // Get the user ID from the URL
  const { authData } = useAuth(); // Get auth data from context
  const { token } = authData; // Extract token from authData
  const [profile, setProfile] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });

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

    fetchUserProfile(); // Call the fetch function
  }, [id, token]); // Dependencies array

  if (loading) {
    return <p>Loading user profile...</p>; // Show loading message
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Show error message
  }

  // Render user profile information
  return (
    <div>
      <h1>Profilsidan</h1>
      {profile && (
        <>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Sex:</strong> {profile.sex}
          </p>
          <p>
            <strong>Relationship Status:</strong> {profile.relationship_status}
          </p>
          <p>
            <strong>Location:</strong> {profile.location}
          </p>
          <p>
            <strong>Music Taste:</strong> {profile.music_taste}
          </p>
          <p>
            <strong>Interests:</strong> {profile.interests}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
        </>
      )}
    </div>
  );
}

export default UserProfile;
