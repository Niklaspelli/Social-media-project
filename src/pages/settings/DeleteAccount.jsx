import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DeleteAccountLoader from "../../components/DeleteAccountLoader";
import ConfirmDialog from "../../components/ConfirmDialog";

const DeleteAccount = ({ onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // för knappen i ConfirmDialog

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); // kör API-delete

      setIsDeleting(true); // starta loadern
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeleting) {
    return success ? (
      <section className="text-center text-white fs-4 font-bold">
        <h2>Congratulations, your account has been successfully deleted!</h2>
        <p>
          <a href="/">Login</a>
        </p>
      </section>
    ) : (
      <DeleteAccountLoader
        onFinish={() => {
          setSuccess(true);
          navigate("/deleted", { replace: true });
          logout();
        }}
      />
    );
  }

  return (
    <ConfirmDialog
      show={true}
      title="Delete Account"
      message="Are you sure you want to delete your account?"
      confirmText="Yes, Delete"
      cancelText="No, Cancel"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
};

export default DeleteAccount;
