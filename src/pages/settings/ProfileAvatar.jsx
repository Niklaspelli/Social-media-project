import React, { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";

const ProfileAvatar = ({ token, userId, setSelectedPicture }) => {
  const [tempPicture, setTempPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPictureModal, setShowPictureModal] = useState(false);

  const openPictureModal = () => {
    setShowPictureModal(true);
    setTempPicture(""); // Reset tempPicture when opening modal
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
      const response = await fetch("http://localhost:3000/forum/users/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Use the userId from state
          updatedData: { avatar: tempPicture },
        }),
      });

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
                src={tempPicture || "https://via.placeholder.com/100"} // Default image if none selected
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
