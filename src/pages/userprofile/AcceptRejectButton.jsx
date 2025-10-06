import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// ... other imports

function AcceptRejectButton({
  senderId,
  receiverId,
  loggedInUserId,
  username,
  avatar,
  isFriend: propIsFriend,
  isPending: propIsPending,
  incomingRequest: propIncomingRequest,
}) {
  const { authData, csrfToken } = useAuth();
  const token = authData?.accessToken;
  const queryClient = useQueryClient();

  console.log("csrf:", csrfToken);

  // Local state override after accept/reject
  const [status, setStatus] = useState({
    isFriend: propIsFriend,
    isPending: propIsPending,
    incomingRequest: propIncomingRequest,
  });

  const acceptFriendRequest = async () => {
    const response = await fetch("http://localhost:5000/api/auth/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ senderId }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus({ isFriend: true, isPending: false, incomingRequest: false });
      queryClient.invalidateQueries(["friendRequestCount", loggedInUserId]);
    } else {
      alert(data.error);
    }
  };

  const rejectFriendRequest = async () => {
    const response = await fetch("http://localhost:5000/api/auth/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ senderId, receiverId }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus({ isFriend: false, isPending: false, incomingRequest: false });
      queryClient.invalidateQueries(["friendRequestCount", loggedInUserId]);
    } else {
      alert(data.error);
    }
  };

  const { isFriend, isPending, incomingRequest } = status;

  console.log("=== AcceptRejectButton DEBUG ===");
  console.log("senderId:", senderId);
  console.log("receiverId:", receiverId);
  console.log("loggedInUserId:", loggedInUserId);
  console.log("isFriend:", isFriend);
  console.log("isPending:", isPending);
  console.log("incomingRequest:", incomingRequest);
  console.log("receiverId === loggedInUserId:", receiverId === loggedInUserId);

  return (
    <div>
      {isFriend && (
        <div style={inputStyle}>You are friends with this user!</div>
      )}
      {isPending && incomingRequest && receiverId === loggedInUserId && (
        <>
          <strong>{username}</strong>
          <p> wants to be your friend</p>
          <Button variant="dark" onClick={acceptFriendRequest}>
            Accept
          </Button>{" "}
          <Button variant="light" onClick={rejectFriendRequest}>
            Reject
          </Button>
        </>
      )}

      {isPending && senderId === loggedInUserId && !incomingRequest && (
        <p>Friend request pending...</p>
      )}
    </div>
  );
}

export default AcceptRejectButton;

const inputStyle = {
  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
  backgroundColor: "grey",
  color: "white",
  padding: "10px 20px",
  margin: "10px 0",
};
