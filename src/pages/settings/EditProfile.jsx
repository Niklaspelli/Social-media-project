import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../context/AuthContext";
import { useCurrentUserProfile } from "../../queryHooks/users/useCurrentUserProfile";

import { Container, Row, Col, Form, Button } from "react-bootstrap";

const EditProfile = () => {
  const { authData } = useAuth();
  const { userId, csrfToken, accessToken } = authData || {};
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error: queryError,
    refetch,
  } = useCurrentUserProfile();

  const [formData, setFormData] = useState({
    sex: "",
    relationship_status: "",
    location: "",
    music_taste: "",
    interest: "",
    bio: "",
  });
  const [mode, setMode] = useState("view"); // 'view' or 'edit'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data and mode when profile or userId changes
  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }
    if (profile) {
      setFormData({
        sex: profile.sex || "",
        relationship_status: profile.relationship_status || "",
        location: profile.location || "",
        music_taste: profile.music_taste || "",
        interest: profile.interest || "",
        bio: profile.bio || "",
      });
      setMode("view"); // existing profile, start in view mode
      setError(null);
    } else {
      // No profile found → initialize empty form for creation and switch to edit mode
      setFormData({
        sex: "",
        relationship_status: "",
        location: "",
        music_taste: "",
        interest: "",
        bio: "",
      });
      setMode("edit");
      setError(null);
    }
  }, [profile, userId]);

  // Handle query error
  useEffect(() => {
    if (queryError) setError(queryError.message || "Failed to load profile.");
  }, [queryError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { sex, relationship_status, location } = formData;
    if (!sex || !relationship_status || !location) {
      setError("Sex, relationship status, and location are required.");
      setLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5000/api/auth/users`; // Alltid POST
      const method = "POST";

      const body = {
        ...formData, // innehåller sex, relationship_status, etc.
        // userId tas från accessToken i backend – ingen user_id behövs här
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMsg}`
        );
      }

      setSuccess(true);
      await refetch(); // hämta uppdaterad profil
      setMode("view"); // byt till visningsläge
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Error saving profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setError(null);
    setSuccess(false);
    setMode("edit");
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
    if (profile) {
      setFormData({
        sex: profile.sex || "",
        relationship_status: profile.relationship_status || "",
        location: profile.location || "",
        music_taste: profile.music_taste || "",
        interest: profile.interest || "",
        bio: profile.bio || "",
      });
    }
    setMode("view");
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Inställningar</h1>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center align-items-center h-100">
            <Col md={6} lg={4} className="justify-content-center">
              <Form.Group>
                <Form.Label className="mb-10">Sex:</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.sex}
                  name="sex"
                  onChange={handleChange}
                  disabled={mode === "view" || loading}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Relationship Status:</Form.Label>
                <Form.Control
                  as="select"
                  name="relationship_status"
                  value={formData.relationship_status}
                  onChange={handleChange}
                  disabled={mode === "view" || loading}
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
                  disabled={mode === "view" || loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Music Taste:</Form.Label>
                <Form.Control
                  type="text"
                  name="music_taste"
                  value={formData.music_taste}
                  onChange={handleChange}
                  disabled={mode === "view" || loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Interests:</Form.Label>
                <Form.Control
                  as="textarea"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  disabled={mode === "view" || loading}
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
                  disabled={mode === "view" || loading}
                />
              </Form.Group>

              {mode === "edit" && (
                <Button
                  type="submit"
                  style={{ backgroundColor: "black", marginTop: "10px" }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && (
                <p style={{ color: "green" }}>Profile updated successfully!</p>
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
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </Container>
    </>
  );
};

export default EditProfile;
