// DeleteAccount.jsx
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DeleteAccount = ({ isLoading, onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setSuccess(true);
      logout();
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 3000); // vänta 3 sek innan navigering
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="confirmation-prompt">
      <p style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
        Are you sure you want to delete your account?
      </p>
      <div className="d-flex justify-content-center mt-2">
        <Button
          style={{
            backgroundColor: "black",
            marginRight: "10px",
            border: "none",
          }}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
        <Button
          style={{ backgroundColor: "#ccc", color: "black", border: "none" }}
          onClick={onCancel}
          disabled={isLoading}
        >
          No, Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccount;
