import { useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const ProfileAvatar = ({ setSelectedPicture }) => {
  const [tempPicture, setTempPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [success, setSuccess] = useState(""); // Ny state för success

  const { authData } = useAuth();
  const { userId } = authData || {};

  const openPictureModal = () => {
    setShowPictureModal(true);
    setTempPicture("");
    setError("");
    setSuccess("");
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

    if (!userId) {
      setError("ID is missing");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiFetch("/users/avatar", {
        method: "PUT",
        body: JSON.stringify({ avatar: tempPicture }),
      });

      setSuccess("Profile picture updated successfully! 🎉");

      // Stäng modal efter kort delay (valfritt)
      setTimeout(() => {
        setShowPictureModal(false);
        setTempPicture("");
        setSuccess("");
      }, 1500);
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
            setTempPicture("");
            setError("");
            setSuccess("");
          }}
          centered
        >
          <div style={StyleContainer}>
            <Modal.Header closeButton>
              <Modal.Title>Choose a Profile Picture</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <img
                src={tempPicture || "https://i.pravatar.cc/100"}
                alt="Avatar"
                onClick={handlePictureSelect}
                style={{
                  cursor: "pointer",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                Click the avatar to randomize
              </p>
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
