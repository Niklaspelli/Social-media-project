import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const AddFriendButton = ({ senderId, receiverId, token }) => {
  const [friendshipStatus, setFriendshipStatus] = useState(null); // Store the friendship status
  const [incomingRequest, setIncomingRequest] = useState(false); // Track if it's an incoming friend request

  // Prevent showing the "Add as friend" button for the logged-in user
  if (senderId === receiverId) {
    return null; // Don't render the button if the logged-in user is the same as the profile
  }

  // Function to get cookie value (csrf token)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Function to check if the users are friends
  const checkIfFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/friends/status/${senderId}/${receiverId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 429) {
        // Retry the request after a delay
        console.log("Too many requests, retrying...");
        setTimeout(checkIfFriends, 2000); // Retry after 2 seconds
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFriendshipStatus(data.status);
        setIncomingRequest(data.incomingRequest);
      } else {
        console.error("Error checking friendship status");
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkIfFriends();
    }, 300); // delay for smoother UX

    return () => clearTimeout(timeoutId); // cleanup
  }, [senderId, receiverId]);

  // Function to handle friend requests and unfollow
  const handleFriendAction = async () => {
    const csrfToken = getCookie("csrfToken");

    let action = "";
    if (friendshipStatus === "accepted") {
      action = "unfollow"; // Unfollow if they are friends
    } else if (friendshipStatus === "pending") {
      action = incomingRequest ? "accept" : "cancel"; // Handle pending request
    } else {
      action = "request"; // Send a friend request if no status exists
    }

    // Send the PUT request to unfollow
    if (action === "unfollow") {
      const url = "http://localhost:5000/api/friends/unfollow"; // Match the route in your backend
      const body = {
        senderId: senderId,
        receiverId: receiverId,
      };

      try {
        const response = await fetch(url, {
          method: "PUT", // PUT request to update the friendship status
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
          setFriendshipStatus("none"); // Update UI to reflect no friendship
          setIncomingRequest(false); // Reset the incoming request status
          alert(data.message); // Show success message
        } else {
          alert(data.error); // Handle error if any
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while unfollowing.");
      }
    }

    // If action is "request" (i.e., sending a friend request)
    if (action === "request") {
      const url = "http://localhost:5000/api/friends/friend-request"; // Backend route for sending friend request
      const body = {
        senderId: senderId,
        receiverId: receiverId,
      };

      try {
        const response = await fetch(url, {
          method: "POST", // POST request to send a friend request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
          setFriendshipStatus("pending"); // Status is now "pending" since the request is sent
          setIncomingRequest(false); // Reset incoming request status
          alert(data.message); // Show success message
        } else {
          alert(data.error); // Handle error if any
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while sending the friend request.");
      }
    }
  };

  const renderButtonText = () => {
    switch (friendshipStatus) {
      case "accepted":
        return "Unfollow"; // If they're friends, show "Unfollow"
      case "pending":
        return incomingRequest ? "Accept Request" : "Cancel Request"; // Accept or Cancel the pending request
      default:
        return "Add Friend"; // If no connection, show "Add Friend"
    }
  };

  return (
    <Button onClick={handleFriendAction} className="add-friend-btn">
      {renderButtonText()} {/* Show the correct button text */}
    </Button>
  );
};

export default AddFriendButton;
