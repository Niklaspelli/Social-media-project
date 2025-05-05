import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Image, Spinner, Alert } from "react-bootstrap";

function FriendList() {
  const { id: profileUserId } = useParams(); // Profile being viewed
  const { authData } = useAuth();
  const token = authData?.accessToken;

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/friends/${profileUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch friends list");
        }

        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profileUserId && token) {
      fetchFriends();
    }
  }, [profileUserId, token]);

  if (loading) return <Spinner animation="border" variant="light" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container style={{ color: "white" }}>
      <h2 className="mb-4">Friends</h2>
      {friends.length === 0 ? (
        <p>This user has no friends yet.</p>
      ) : (
        <Row>
          {friends.map((friend) => (
            <Col key={friend.id} xs={12} md={2} className="mb-4 text-center">
              <Image
                src={friend.avatar}
                alt={friend.username}
                roundedCircle
                width={100}
                height={100}
              />
              <Link to={`/user/${friend.id}`}>
                <strong>{friend.username}</strong>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default FriendList;
