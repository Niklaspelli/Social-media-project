import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import ProfileAvatar from "./ProfileAvatar";
import { apiFetch } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { authData, logout } = useAuth();
  const { userId } = authData || {};
  const navigate = useNavigate();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!userId) {
      setErrMsg("ID or token is missing");
      return;
    }

    setIsDeleting(true);

    try {
      const data = await apiFetch(`/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      console.log("Deleted", data);
      if (!data.ok) {
        throw new Error(data.message || data.statusText);
      }

      // Efter lyckad deletion
      logout();
      navigate("/auth", { replace: true });
    } catch (error) {
      setErrMsg(error.message);
      errRef.current?.focus();
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
        {errMsg}
      </p>

      <EditProfile />
      <ProfileAvatar setSelectedPicture={() => {}} />

      <div style={styleContainer}>
        {!showConfirmation && !isDeleting ? (
          <Button variant="danger" onClick={() => setShowConfirmation(true)}>
            Delete Account
          </Button>
        ) : (
          <DeleteAccount
            onConfirm={handleDelete}
            onCancel={() => {
              setShowConfirmation(false);
              setIsDeleting(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;

const styleContainer = {
  margin: "20px",
  display: "flex",
  justifyContent: "center",
};
