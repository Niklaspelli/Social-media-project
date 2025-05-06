import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";

function FriendList() {
  const { authData } = useAuth();
  const token = authData?.accessToken;
  const { id: profileUserId } = useParams();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/friends/${profileUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [profileUserId, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <h2>Friends List</h2>
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
