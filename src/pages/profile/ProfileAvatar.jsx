import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ProfileAvatar = ({ token, userId, setSelectedPicture }) => {
  const [tempPicture, setTempPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPictureModal, setShowPictureModal] = useState(false);

  const openPictureModal = () => {
    setShowPictureModal(true);
  };

  const handlePictureSelect = () => {
    const newPictureUrl = `https://i.pravatar.cc/200?img=${
      Math.floor(Math.random() * 70) + 1
    }`;
    setTempPicture(newPictureUrl);
  };

  const handleSavePicture = async () => {
    setSelectedPicture(tempPicture);
    localStorage.setItem("profilePicture", tempPicture);

    if (!token || !userId) {
      setError("ID or token is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/forum/users", {
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
    } catch (error) {
      setError(`Update request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowPictureModal(false);
    }
  };

  return (
    <>
      <Button
        style={{ backgroundColor: "black", margin: "20px" }}
        onClick={openPictureModal}
      >
        Choose Profile Picture
      </Button>
      <Modal
        show={showPictureModal}
        onHide={() => setShowPictureModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose a Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={tempPicture}
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
      </Modal>
    </>
  );
};

export default ProfileAvatar;
