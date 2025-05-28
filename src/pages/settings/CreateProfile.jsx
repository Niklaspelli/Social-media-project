import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the Auth context
import { useNavigate } from "react-router-dom"; // For navigation

const CreateProfile = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sex: "",
    relationship_status: "",
    location: "",
    music_taste: "",
    interests: "",
    bio: "",
  });
  const [error, setError] = useState(null);

  // Extracting userId from authData
  const userId = authData.userId;
  const token = authData.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Include userId in the formData
      const response = await fetch(`http://localhost:3000/forum/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, ...formData }), // Sending userId with form data
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error response
        throw new Error(errorData.error || "Failed to create profile");
      }

      alert("Profile created successfully!");
      navigate("/settings"); // Redirect to the profile page or dashboard
    } catch (err) {
      console.error("Error creating profile:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Sex:</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Maleeeeeeeeeeeeee</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label>Relationship Status:</label>
        <select
          name="relationship_status"
          value={formData.relationship_status}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Single">Single</option>
          <option value="In a Relationship">In a Relationship</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Music Taste:</label>
        <input
          type="text"
          name="music_taste"
          value={formData.music_taste}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Interests:</label>
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bio:</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} />
      </div>
      <button type="submit">Create Profile</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateProfile;
