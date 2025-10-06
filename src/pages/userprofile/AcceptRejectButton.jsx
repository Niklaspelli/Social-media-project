import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function AcceptRejectButton({
  type, // "friend" eller "event"
  id, // senderId för friend, eventId för event
  receiverId, // för friend, invitedUserId för event
  loggedInUserId,
  username,
  avatar,
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

  // Accept-knapp
  const accept = async () => {
    const endpoint =
      type === "friend"
        ? "http://localhost:5000/api/auth/accept"
        : "http://localhost:5000/api/auth/events/invitations/accept";

    const body =
      type === "friend"
        ? { senderId: id }
        : { eventId: id, invitedUserId: receiverId };

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

  // Reject-knapp
  const reject = async () => {
    const endpoint =
      type === "friend"
        ? "http://localhost:5000/api/auth/reject"
        : "http://localhost:5000/api/auth/events/invitations/reject";

    const body =
      type === "friend"
        ? { senderId: id, receiverId }
        : { eventId: id, invitedUserId: receiverId };

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
          {username && <strong>{username}</strong>}
          <p>
            {type === "friend"
              ? "wants to be your friend"
              : "invited you to an event"}
          </p>
          <Button variant="dark" onClick={accept}>
            Accept
          </Button>{" "}
          <Button variant="light" onClick={reject}>
            Reject
          </Button>
        </>
      )}
      {!status.incomingRequest && id === loggedInUserId && <p>Pending...</p>}
    </div>
  );
}

export default AcceptRejectButton;
