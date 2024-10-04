import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the Auth context

const EditProfile = () => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    sex: "",
    relationship_status: "",
    location: "",
    music_taste: "",
    interest: "",
    bio: "",
  });
  const [mode, setMode] = useState("view"); // Modes: 'view', 'edit', or 'create'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = authData.userId; // Assuming userId is set correctly
  const token = authData.token; // Assuming token is set correctly

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile for userId:", userId); // Log for debugging
        const response = await fetch(
          `http://localhost:3000/forum/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorMsg = await response.text(); // Get error details from response
          if (response.status === 404) {
            // If the user profile is not found, switch to create mode
            setMode("create");
            setLoading(false);
            return;
          }
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorMsg}`
          );
        }

        const data = await response.json();
        setFormData(data); // Set existing profile data
        setMode("edit"); // Switch to edit mode if profile is found
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(`Error fetching user profile: ${err.message}`);
        setMode("create"); // Switch to create mode on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    const { sex, relationship_status, location } = formData;

    // Validate required fields
    if (!sex || !relationship_status || !location) {
      setError("Sex, relationship status, and location are required.");
      setLoading(false); // Stop loading state
      return;
    }

    try {
      const method = mode === "edit" ? "PUT" : "POST"; // Method based on mode
      const url =
        mode === "edit"
          ? `http://localhost:3000/forum/users/${userId}`
          : `http://localhost:3000/forum/users`;

      const body = {
        user_id: userId, // Ensure this matches what your API expects
        ...formData,
      };

      console.log("Submitting data to:", url);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMsg}`
        );
      }

      const data = await response.json();
      console.log("Profile saved successfully:", data);
      alert("Profile saved successfully!");
      setMode("view"); // Switch to view mode after saving
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Error saving profile: ${err.message}`);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Toggle between edit and view mode
  const handleEdit = () => setMode("edit");
  const handleCancel = () => {
    setMode("view");
    setError(null); // Clear any existing error
    // Reset the form to the fetched profile data
    setFormData({
      sex: formData.sex,
      relationship_status: formData.relationship_status,
      location: formData.location,
      music_taste: formData.music_taste,
      interest: formData.interest,
      bio: formData.bio,
    });
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Sex:</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          disabled={mode === "view"}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
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
          disabled={mode === "view"}
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
          disabled={mode === "view"}
        />
      </div>
      <div>
        <label>Music Taste:</label>
        <input
          type="text"
          name="music_taste"
          value={formData.music_taste}
          onChange={handleChange}
          disabled={mode === "view"}
        />
      </div>
      <div>
        <label>Interests:</label>
        <textarea
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          disabled={mode === "view"}
        />
      </div>
      <div>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={mode === "view"}
        />
      </div>

      {mode === "view" ? (
        <div>
          <button type="button" onClick={handleEdit}>
            Edit
          </button>
        </div>
      ) : (
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default EditProfile;
