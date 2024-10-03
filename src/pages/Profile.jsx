import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../index.css";

const Profile = () => {
  const { id: paramUserId } = useParams(); // Extract userId from URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const errRef = useRef(null);

  // Get token and userId from state or localStorage
  const stateToken = location.state?.token || "";
  const stateUserId = location.state?.userId || ""; // Use userId from state

  const [token, setToken] = useState(
    stateToken || localStorage.getItem("token") || ""
  );

  const [userId, setUserId] = useState(
    stateUserId || paramUserId || localStorage.getItem("userId") || ""
  ); // Use userId from state or URL params

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(
    localStorage.getItem("profilePicture") || "https://i.pravatar.cc/200"
  );
  const [tempPicture, setTempPicture] = useState(selectedPicture);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("Extracted userId:", userId); // Debugging log
    const checkCredentials = async () => {
      if (!token || !userId) {
        setError("Token or ID is missing");
        console.error("Token or ID is missing:", { token, userId });
      } else {
        console.log("Token and ID are present:", { token, userId });
      }
      setIsLoading(false);
    };

    checkCredentials();
  }, [token, userId]);

  const handleDelete = async () => {
    if (!token || !userId) {
      setError("ID or token is missing");
      console.error("Missing token or id:", { token, userId });
      return;
    }
    setIsLoading(true);
    try {
      console.log("Attempting to DELETE:", userId); // Debugging log
      const response = await fetch(`http://localhost:3000/profile/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete user: ${response.statusText}`
        );
      }
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div style={ProfileContainerStyle}>
        {success ? (
          <section>
            <h1>Kontot raderat! Välkommen tillbaka!</h1>
            <div style={HomeContainerStyle}>
              <Button
                style={{ backgroundColor: "#185bac", margin: "20px" }}
                type="submit"
                onClick={() => navigate("/register")}
              >
                Skapa
              </Button>
            </div>
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
                  <h4>Din valda bild:</h4>
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
                  Välj profilbild
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
                        Välj en profilbild
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
                        Spara
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
                    <p>Är du säker att vill radera kontot?</p>
                    <button
                      onClick={handleConfirmAction}
                      className="btn btn-primary"
                    >
                      Ja
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="btn btn-secondary"
                    >
                      Nej
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
