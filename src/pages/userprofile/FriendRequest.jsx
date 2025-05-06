import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";

function FriendRequest({
  profileUserId,
  loggedInUserId,
  isFriend,
  isPending,
  incomingRequest,
}) {
  const [requests, setRequests] = useState([]);

  const { authData } = useAuth();
  const token = authData?.accessToken;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Prevent showing the "Add as friend" button for the logged-in user
  if (profileUserId === loggedInUserId) {
    return <div>You cannot send a friend request to yourself.</div>;
  }

  console.log("profileuserid:", profileUserId);

  console.log("loggedinuserid:", loggedInUserId); // Send friend request
  const sendFriendRequest = async () => {
    const csrfToken = getCookie("csrfToken");

    const response = await fetch("http://localhost:5000/api/auth/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        senderId: loggedInUserId,
        receiverId: profileUserId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); // Friend request sent
    } else {
      alert(data.error); // Error sending friend request
    }
  };

  // Accept friend request
  const acceptFriendRequest = async () => {
    const csrfToken = getCookie("csrfToken");

    const response = await fetch("http://localhost:5000/api/auth/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        senderId: profileUserId,
        receiverId: loggedInUserId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); // Friend request accepted
    } else {
      alert(data.error); // Error accepting friend request
    }
  };

  // Reject friend request
  const rejectFriendRequest = async () => {
    const csrfToken = getCookie("csrfToken");

    const response = await fetch("http://localhost:5000/api/auth/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        senderId: profileUserId,
        receiverId: loggedInUserId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); // Friend request rejected
    } else {
      alert(data.error); // Error rejecting friend request
    }
  };

  return (
    <div>
      {/* Already Friends */}
      {isFriend && (
        <div style={inputStyle}>You are friends with this user!</div>
      )}

      {/* Incoming Friend Request (receiver sees Accept/Reject) */}
      {isPending && incomingRequest && (
        <div>
          {" "}
          <p>{profileUserId} wants to be your friend</p>
          <Button variant="dark" onClick={acceptFriendRequest}>
            Accept
          </Button>
          <Button variant="light" onClick={rejectFriendRequest}>
            Reject
          </Button>
        </div>
      )}

      {/* Outgoing Friend Request (sender sees pending text) */}
      {isPending && !incomingRequest && profileUserId && (
        <p>Friend request pending...</p>
      )}

      {/* Not Friends and No Request Yet */}
      {!isFriend &&
        !isPending &&
        loggedInUserId !==
        <Button onClick={sendFriendRequest}>Send Friend Request</Button>}
    </div>
  );
}

export default FriendRequest;

const inputStyle = {
  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
  backgroundColor: "grey",
  color: "white",
  border: "none",
};
