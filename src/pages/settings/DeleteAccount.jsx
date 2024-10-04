import React from "react";
import { Button } from "react-bootstrap";

const DeleteAccount = ({ isLoading, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-prompt">
      <p style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
        Are you sure you want to delete your account?
      </p>
      <div className="d-flex justify-content-center mt-2">
        <Button
          style={{
            backgroundColor: "red",
            marginRight: "10px",
            border: "none",
          }}
          onClick={onConfirm}
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
