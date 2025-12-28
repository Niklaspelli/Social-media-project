import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/api";

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
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const queryClient = useQueryClient();

  const [status, setStatus] = useState({
    isPending: propIsPending,
    incomingRequest: propIncomingRequest,
  });

  const accept = async () => {
    try {
      const endpoint =
        type === "friend" ? "/friends/accept" : "/events/invitations/accept";

      const body = type === "friend" ? { senderId: id } : { eventId: id };

      await apiFetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      setStatus({ isPending: false, incomingRequest: false });

      // ✅ Uppdatera cachar med v5 syntax
      if (type === "friend") {
        queryClient.invalidateQueries({
          queryKey: ["friendRequestCount", loggedInUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["friends", loggedInUserId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["eventInvitationCount"] });
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const reject = async () => {
    try {
      const endpoint =
        type === "friend" ? "/friends/reject" : "/events/invitations/reject";

      const body =
        type === "friend" ? { senderId: id, receiverId } : { eventId: id };

      await apiFetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      setStatus({ isPending: false, incomingRequest: false });

      // ✅ Uppdatera cachar med v5 syntax
      if (type === "friend") {
        queryClient.invalidateQueries({
          queryKey: ["friendRequestCount", loggedInUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["friends", loggedInUserId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["eventInvitationCount"] });
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
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
