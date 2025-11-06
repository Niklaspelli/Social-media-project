import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const AddFriendButton = ({ senderId, receiverId, token }) => {
  const [friendshipStatus, setFriendshipStatus] = useState("none"); // none, pending, accepted
  const [incomingRequest, setIncomingRequest] = useState(false); // true om det är en inkommande förfrågan

  // Prevent showing button for self
  if (senderId === receiverId) return null;

  // Hämta CSRF-token från cookie
  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; csrfToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Kolla status med backend
  const fetchFriendshipStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/friends/status/${senderId}/${receiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch friendship status");

      const data = await response.json();
      setFriendshipStatus(data.status);
      setIncomingRequest(data.incomingRequest);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFriendshipStatus();
  }, [senderId, receiverId]);

  // Hantera alla knapp-actions
  const handleFriendAction = async () => {
    const csrfToken = getCsrfToken();

    try {
      if (friendshipStatus === "none") {
        // Skicka vänförfrågan
        const res = await fetch(
          "http://localhost:5000/api/friends/friend-request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ senderId, receiverId }),
          }
        );
        const data = await res.json();
        if (res.ok) setFriendshipStatus("pending");
        else alert(data.error);
      } else if (friendshipStatus === "pending") {
        if (incomingRequest) {
          // Acceptera inkommande
          const res = await fetch("http://localhost:5000/api/friends/accept", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ senderId }),
          });
          const data = await res.json();
          if (res.ok) setFriendshipStatus("accepted");
          else alert(data.error);
        } else {
          // Avbryt skickad förfrågan
          const res = await fetch("http://localhost:5000/api/friends/reject", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ senderId, receiverId }),
          });
          const data = await res.json();
          if (res.ok) setFriendshipStatus("none");
          else alert(data.error);
        }
      } else if (friendshipStatus === "accepted") {
        // Unfollow / avsluta vänskap
        const res = await fetch("http://localhost:5000/api/friends/unfollow", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ senderId, receiverId }),
        });
        const data = await res.json();
        if (res.ok) setFriendshipStatus("none");
        else alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const renderButtonText = () => {
    switch (friendshipStatus) {
      case "accepted":
        return "Unfollow";
      case "pending":
        return incomingRequest ? "Accept Request" : "Cancel Request";
      default:
        return "Add Friend";
    }
  };

  return (
    <Button onClick={handleFriendAction} className="add-friend-btn">
      {renderButtonText()}
    </Button>
  );
};

export default AddFriendButton;
