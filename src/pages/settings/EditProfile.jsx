import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the Auth context
import { useUsers } from "../../context/UserContext"; // Correct import of useUsers hook

import { Container, Row, Col, Form, Button } from "react-bootstrap"; // Importing Bootstrap components

const EditProfile = () => {
  const { authData } = useAuth();
  const { userId } = authData; // Destructure username from authData
  const { fetchUserProfile } = useUsers(); // Destructure fetchUserProfile from useUsers

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
  const [success, setSuccess] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    if (authData && authData.profile) {
      const userProfile = authData.profile;
      setFormData({
        sex: userProfile.sex || "",
        relationship_status: userProfile.relationship_status || "",
        location: userProfile.location || "",
        music_taste: userProfile.music_taste || "",
        interest: userProfile.interest || "",
        bio: userProfile.bio || "",
      });
      setMode("edit");
      setLoading(false);
    }
  }, [authData, userId]);

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
          ? `http://localhost:5000/api/auth/users/${userId}`
          : `http://localhost:5000/api/auth/users`;

      const body = {
        user_id: userId, // Ensure this matches what your API expects
        ...formData,
      };
      const csrfToken = getCookie("csrfToken"); // Retrieve CSRF token

      console.log("Submitting data to:", url);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "CSRF-TOKEN": csrfToken, // Add CSRF token
          Authorization: `Bearer ${authData.accessToken}`,
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
      setSuccess(true);
      await fetchUserProfile(userId, authData.accessToken);
      const updatedProfile = authData?.profile || {};
      setFormData({
        sex: updatedProfile.sex || "",
        relationship_status: updatedProfile.relationship_status || "",
        location: updatedProfile.location || "",
        music_taste: updatedProfile.music_taste || "",
        interest: updatedProfile.interest || "",
        bio: updatedProfile.bio || "",
      }); // Refresh the profile after saving
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
    <>
      <h1 style={{ textAlign: "center" }}>Inställningar</h1>

      <div>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center align-items-center h-100">
              <Col md={6} lg={4} className="justify-content-center">
                <Form.Group as={Col}>
                  <Form.Label className="mb-10">Sex:</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={formData.sex}
                    name="sex"
                    onChange={handleChange}
                    disabled={mode === "view"}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Relationship Status:</Form.Label>
                  <Form.Control
                    as="select"
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
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Music Taste:</Form.Label>
                  <Form.Control
                    type="text"
                    name="music_taste"
                    value={formData.music_taste}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Interests:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your Bio here..."
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </Form.Group>

                {mode !== "view" && (
                  <Button
                    type="submit"
                    style={{ backgroundColor: "black", marginTop: "10px" }}
                  >
                    Save
                  </Button>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && (
                  <p style={{ color: "green" }}>
                    Profile updated successfully!
                  </p>
                )}
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            {mode === "view" ? (
              <Button
                type="button"
                onClick={handleEdit}
                style={{ backgroundColor: "black", marginRight: "10px" }}
              >
                Edit
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCancel}
                style={{ backgroundColor: "black" }}
              >
                Cancel
              </Button>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default EditProfile;
