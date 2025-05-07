import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Image } from "react-bootstrap";
import AcceptRejectButton from "./AcceptRejectButton";

function FriendList() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const loggedInUserId = authData?.userId;

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("loggedin:", loggedInUserId);

  // Fetch friend requests sent TO this user
  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/received-requests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include", // ✅ Move it here
          }
        );

        const data = await response.json();
        console.log("data", data);

        setIncomingRequests(data); // [{ sender_id, username, avatar }]
      } catch (err) {
        console.error("Error fetching incoming requests:", err);
      }
    };

    fetchIncomingRequests();
  }, [token]);

  // Fetch actual friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/friends/${loggedInUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [loggedInUserId, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container style={{ color: "white" }}>
      <h2>Your Friend Requests</h2>
      <Row>
        {incomingRequests.length === 0 && <p>No incoming requests</p>}
        {incomingRequests.map((request) => (
          <Col key={request.sender_id} xs={12} md={6}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={request.avatar}
                alt={request.username}
                roundedCircle
                width={50}
                height={50}
              />
              <div>
                <strong>{request.username}</strong>
                <AcceptRejectButton
                  senderId={request.sender_id} // comes from the backend
                  receiverId={loggedInUserId} // the logged-in user is always the receiver
                  loggedInUserId={loggedInUserId}
                  isFriend={false}
                  isPending={true}
                  incomingRequest={true}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <h2 className="mt-5">Your Friends</h2>
      <Row>
        {friends.map((friend) => (
          <Col key={friend.id} xs={12} md={4} className="mb-4 text-center">
            <Image
              src={friend.avatar}
              alt={friend.username}
              roundedCircle
              width={100}
              height={100}
            />
            <p>{friend.username}</p>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FriendList;
