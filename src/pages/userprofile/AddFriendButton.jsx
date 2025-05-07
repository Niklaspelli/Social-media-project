import React from "react";
import { Button } from "react-bootstrap";

const AddFriendButton = ({ senderId, receiverId, token }) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Prevent showing the "Add as friend" button for the logged-in user
  if (receiverId === senderId) {
    return null; // or <div>You cannot add yourself as a friend.</div>
  }

  const handleAddFriend = async () => {
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
        senderId: senderId,
        receiverId: receiverId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); // Friend request sent
    } else {
      alert(data.error); // Error sending friend request
    }
  };

  return (
    <Button onClick={handleAddFriend} className="add-friend-btn">
      Add Friend
    </Button>
  );
};

export default AddFriendButton;
