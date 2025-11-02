import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function AcceptRejectButton({
  type, // "friend" eller "event"
  id, // senderId för friend, eventId för event
  receiverId,
  loggedInUserId,
  username,
  eventTitle, // endast för event
  isPending: propIsPending,
  incomingRequest: propIncomingRequest,
}) {
  const { authData, csrfToken } = useAuth();
  const token = authData?.accessToken;
  const queryClient = useQueryClient();

  const [status, setStatus] = useState({
    isPending: propIsPending,
    incomingRequest: propIncomingRequest,
  });

  const accept = async () => {
    const endpoint =
      type === "friend"
        ? "http://localhost:5000/api/auth/accept"
        : "http://localhost:5000/api/auth/events/invitations/accept";

    const body = type === "friend" ? { senderId: id } : { eventId: id };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus({ isPending: false, incomingRequest: false });
      queryClient.invalidateQueries(
        type === "friend"
          ? ["friendRequestCount", loggedInUserId]
          : ["eventInvitationCount"]
      );
    } else {
      alert(data.error);
    }
  };

  const reject = async () => {
    const endpoint =
      type === "friend"
        ? "http://localhost:5000/api/auth/reject"
        : "http://localhost:5000/api/auth/events/invitations/reject";

    const body =
      type === "friend" ? { senderId: id, receiverId } : { eventId: id };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus({ isPending: false, incomingRequest: false });
      queryClient.invalidateQueries(
        type === "friend"
          ? ["friendRequestCount", loggedInUserId]
          : ["eventInvitationCount"]
      );
    } else {
      alert(data.error);
    }
  };

  if (!status.isPending) return null;

  return (
    <div>
      {status.incomingRequest && receiverId === loggedInUserId && (
        <>
          <p>
            {type === "friend" ? (
              <>
                <strong>{username}</strong> wants to be your friend
              </>
            ) : (
              <>
                <strong>{username}</strong> invited you to{" "}
                <Link
                  to={`/events/event-details/${id}`}
                  style={{ textDecoration: "underline" }}
                >
                  {eventTitle}
                </Link>
              </>
            )}
          </p>
          <div className="d-flex gap-2 mt-2">
            <Button variant="dark" size="sm" onClick={accept}>
              Accept
            </Button>
            <Button variant="light" size="sm" onClick={reject}>
              Reject
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default AcceptRejectButton;
