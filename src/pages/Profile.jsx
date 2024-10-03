import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the path accordingly
import { Button, Modal } from "react-bootstrap";
import "../index.css";

const Profile = () => {
  const { authData, logout } = useAuth(); // Access auth data and logout function
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(""); // Store the selected picture
  const [tempPicture, setTempPicture] = useState(""); // Store temporary picture URL
  const [showPictureModal, setShowPictureModal] = useState(false); // State to control picture modal
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation for delete
  const navigate = useNavigate();
  const errRef = useRef();

  const userId = authData.userId; // Get userId from authData
  const token = authData.token; // Get token from authData

  const handleDelete = async () => {
    if (!token || !userId) {
      setError("ID or token is missing");
      console.error("Missing token or ID:", { token, userId });
      return; // Early exit if token or userId is not present
    }
    setIsLoading(true);
    try {
      console.log("Attempting to DELETE:", userId); // Debugging log
      const response = await fetch(
        `http://localhost:3000/forum/profile/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete user: ${response.statusText}`
        );
      }
      // Clear token and user ID from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("profilePicture");
      setSuccess(true);
    } catch (error) {
      setErrMsg(`${error.message}`);
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleConfirmAction = () => {
    handleDelete();
    setShowConfirmation(false);
  };

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
      const response = await fetch(`http://localhost:3000/forum/users`, {
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

      const data = await response.json();
      console.log("Response Data:", data);

      if (Array.isArray(data) && data.length > 0) {
        const updatedUser = data[0];
        console.log("Updated User:", updatedUser);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      setError(`Update request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowPictureModal(false);
    }
  };

  useEffect(() => {
    if (success) {
      alert("Account deleted successfully!"); // Alert on successful deletion
      navigate("/signup"); // Redirect to register page after deletion
    }
  }, [success, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div style={ProfileContainerStyle}>
        {success ? (
          <section>
            <h1>Account deleted! Welcome back!</h1>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <div className="recipe-container">
              <div className="recipe-list">
                {error && (
                  <div
                    role="alert"
                    className="ml-1 mt-4 w-52 alert alert-error"
                  >
                    <span className="text-xs text-center">{error}</span>
                  </div>
                )}

                <div className="selected-picture">
                  <h4>Your selected picture:</h4>
                  <img
                    src={selectedPicture}
                    alt="Selected Avatar"
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <Button
                  style={{ backgroundColor: "black", margin: "20px" }}
                  onClick={openPictureModal}
                >
                  Choose Profile Picture
                </Button>
                <div className="center">
                  <Modal
                    show={showPictureModal}
                    onHide={() => setShowPictureModal(false)}
                    centered
                  >
                    <Modal.Header
                      closeButton
                      style={{ justifyContent: "center", display: "flex" }}
                    >
                      <Modal.Title
                        style={{ justifyContent: "center", display: "flex" }}
                      >
                        Choose a Profile Picture
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                      style={{ justifyContent: "center", display: "flex" }}
                    >
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
                    <Modal.Footer
                      style={{ justifyContent: "center", display: "flex" }}
                    >
                      <Button variant="primary" onClick={handleSavePicture}>
                        Save
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>

                {!showConfirmation ? (
                  <Button
                    style={{ backgroundColor: "red", margin: "20px" }}
                    onClick={handleConfirmDelete}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </Button>
                ) : (
                  <div className="confirmation-prompt">
                    <p>Are you sure you want to delete your account?</p>
                    <button
                      onClick={handleConfirmAction}
                      className="btn btn-primary"
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="btn btn-secondary"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;

// Add your styling constants here
const ProfileContainerStyle = {
  padding: "20px",
};

const HomeContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
