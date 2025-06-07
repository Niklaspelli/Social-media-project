import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import ProfileAvatar from "./ProfileAvatar";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";

const Settings = () => {
  const { authData, csrfToken } = useAuth();
  const { userId, accessToken } = authData || {};
  const navigate = useNavigate();
  const errRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDelete = async () => {
    if (!accessToken || !userId) {
      setErrMsg("ID or token is missing");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "csrf-token": csrfToken,
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }

      setSuccess(true);
      setShowToast(true);
    } catch (e) {
      setErrMsg(e.message);
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      {success ? (
        <section className="text-center text-white">
          <h2>Your account is deleted! Welcome back!</h2>
          <p>
            <Link to="/auth">Login</Link>
          </p>
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

          {/* Your existing settings UI */}
          <EditProfile />
          <ProfileAvatar setSelectedPicture={() => {}} />

          <div style={StyleContainer}>
            {!showConfirmation ? (
              <Button
                variant="danger"
                onClick={() => setShowConfirmation(true)}
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
          </div>
        </section>
      )}
    </div>
  );
};

export default Settings;

const StyleContainer = {
  margin: "20px",
  display: "flex",
  justifyContent: "center",
};
