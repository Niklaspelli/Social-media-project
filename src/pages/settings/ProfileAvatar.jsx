import React, { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const ProfileAvatar = ({ setSelectedPicture }) => {
  const [tempPicture, setTempPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPictureModal, setShowPictureModal] = useState(false);
  const { authData } = useAuth();

  const userId = authData?.userId;
  const token = authData?.accessToken;

  const openPictureModal = () => {
    setShowPictureModal(true);
    setTempPicture(""); // Reset tempPicture when opening modal
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handlePictureSelect = () => {
    const newPictureUrl = `https://i.pravatar.cc/200?img=${
      Math.floor(Math.random() * 70) + 1
    }`;
    setTempPicture(newPictureUrl);
  };

  const handleSavePicture = async () => {
    if (!tempPicture) {
      setError("Please select a picture first.");
      return;
    }

    setSelectedPicture(tempPicture);
    localStorage.setItem("profilePicture", tempPicture);

    if (!token || !userId) {
      setError("ID or token is missing");
      return;
    }

    setIsLoading(true);

    try {
      const csrfToken = getCookie("csrfToken"); // Retrieve CSRF token
      console.log("csrfToken:", csrfToken);
      const response = await fetch(
        "http://localhost:5000/api/auth/users/avatar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatar: tempPicture,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update profile picture: ${response.statusText} for user ${userId}`
        );
      }

      // Optionally handle the success response
      const data = await response.json();
      console.log(data.message); // Log success message

      // Close modal and reset temp picture
      setShowPictureModal(false);
      setTempPicture(""); // Clear the temporary picture
    } catch (error) {
      setError(`Update request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={StyleContainer}>
        <Button
          style={{ backgroundColor: "black", margin: "20px" }}
          onClick={openPictureModal}
        >
          Choose Profile Picture
        </Button>
        <Modal
          show={showPictureModal}
          onHide={() => {
            setShowPictureModal(false);
            setTempPicture(""); // Clear picture when closing modal
            setError(""); // Reset error when closing
          }}
          centered
        >
          <div style={StyleContainer}>
            <Modal.Header closeButton>
              <Modal.Title>Choose a Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}{" "}
              {/* Display error message */}
              <img
                src={tempPicture || "https://i.pravatar.cc/100"} // pravatar works for placeholders
                alt="Avatar"
                className="picture"
                onClick={handlePictureSelect}
                style={{
                  cursor: "pointer",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleSavePicture}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProfileAvatar;

const StyleContainer = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};
