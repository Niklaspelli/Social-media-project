import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import ProfileAvatar from "./ProfileAvatar";
import DeleteAccount from "./DeleteAccount";

import "../../index.css";
import EditProfile from "./EditProfile";
import CreateProfile from "./CreateProfile";

const Settings = () => {
  const { authData, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(
    localStorage.getItem("profilePicture") || ""
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();
  const errRef = useRef();

  const userId = authData.userId;
  const token = authData.token;

  const handleDelete = async () => {
    if (!token || !userId) {
      setError("ID or token is missing");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/forum/users/${userId}`,
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
      localStorage.clear();
      setSuccess(true);
    } catch (error) {
      setErrMsg(error.message);
      if (errRef.current) errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePicture = (newPicture) => {
    setSelectedPicture(newPicture);
    localStorage.setItem("profilePicture", newPicture);
  };

  useEffect(() => {
    if (success) {
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate("/signup");
      }, 3000);
    }
  }, [success, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {success ? (
        <section style={StyleContainer}>
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
          {error && (
            <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
              <span className="text-xs text-center">{error}</span>
            </div>
          )}

          {/*  <CreateProfile /> */}

          <EditProfile />
          <ProfileAvatar
            token={token} // Pass token if needed for API calls
            userId={userId} // Pass userId if needed for API calls
            setSelectedPicture={handleSavePicture} // Correct prop name
          />
          <div style={StyleContainer}>
            {!showConfirmation ? (
              <Button
                style={{
                  backgroundColor: "red",
                  margin: "20px",
                  border: "none",
                }}
                onClick={() => setShowConfirmation(true)}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                Delete Account
              </Button>
            ) : (
              <DeleteAccount
                isLoading={isLoading}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmation(false)}
              />
            )}

            {showSuccessToast && (
              <ToastContainer position="top-end" className="p-3">
                <Toast
                  onClose={() => setShowSuccessToast(false)}
                  show={showSuccessToast}
                  delay={3000}
                  autohide
                >
                  <Toast.Header>
                    <strong className="me-auto">Success</strong>
                  </Toast.Header>
                  <Toast.Body>Account deleted successfully!</Toast.Body>
                </Toast>
              </ToastContainer>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Settings;

const StyleContainer = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};
