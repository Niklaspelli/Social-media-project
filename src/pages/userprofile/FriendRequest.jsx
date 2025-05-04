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

  // Send friend request
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
      {isFriend && <p>You are friends with this user!</p>}

      {/* Incoming Friend Request (receiver sees Accept/Reject) */}
      {loggedInUserId === profileUserId && isPending && (
        <div>
          <Button variant="dark" onClick={acceptFriendRequest}>
            Accept
          </Button>
          <Button variant="light" onClick={rejectFriendRequest}>
            Reject
          </Button>
        </div>
      )}

      {/* Outgoing Friend Request (sender sees pending text) */}
      {isPending && !incomingRequest && <p>Friend request pending...</p>}

      {/* Not Friends and No Request Yet */}
      {!isFriend && !isPending && (
        <Button onClick={sendFriendRequest}>Send Friend Request</Button>
      )}
    </div>
  );
}

export default FriendRequest;
