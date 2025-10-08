import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Alert,
  Spinner,
  Accordion,
  Image,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Kontrollera att sökvägen är korrekt
import useCreateEvent from "../../queryHooks/events/useCreateEvent"; // Din event-hook
import useFriends from "../../queryHooks/friends/useFetchFriends";
import "./event-styling.css";

const CreateEvent = () => {
  const { authData } = useAuth();
  const { accessToken } = authData || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [error, setError] = useState(null);

  const loggedInUserId = authData?.userId;

  const {
    mutate,
    isLoading,
    isError,
    error: mutationError,
    isSuccess,
  } = useCreateEvent();

  const { data: friends = [], isLoading: loadingFriends } = useFriends(
    authData.userId,
    accessToken
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !datetime || !location) {
      setError("Titel, datum & tid samt plats är obligatoriskt");
      return;
    }

    mutate({
      title,
      description,
      datetime,
      location,
      invitedUserIds: selectedFriends,
      accessToken,
    });
  };

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center text-white my-4">Skapa nytt event</h2>

      <Card className="bg-dark text-white p-4 shadow">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="eventTitle" className="mb-3">
            <Form.Label>Titel</Form.Label>
            <Form.Control
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel på eventet"
              style={{
                backgroundColor: "#333",
                color: "white",
                borderColor: "#444",
              }}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventDescription" className="mb-3">
            <Form.Label>Beskrivning</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv eventet"
              style={{
                backgroundColor: "#333",
                color: "white",
                borderColor: "#444",
              }}
            />
          </Form.Group>

          <Form.Group controlId="eventDatetime" className="mb-3">
            <Form.Label>Datum & Tid</Form.Label>
            <Form.Control
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              style={{
                backgroundColor: "#333",
                color: "white",
                borderColor: "#444",
              }}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventLocation" className="mb-3">
            <Form.Label>Plats</Form.Label>
            <Form.Control
              type="text"
              maxLength={200}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Var hålls eventet?"
              style={{
                backgroundColor: "#333",
                color: "white",
                borderColor: "#444",
              }}
              required
            />
          </Form.Group>
          <Accordion alwaysOpen className="my-3">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Invite friends</Accordion.Header>
              <Accordion.Body>
                {friends.map((friend) => {
                  const isSelected = selectedFriends.includes(friend.id);

                  return (
                    <div
                      key={friend.id}
                      onClick={() => handleFriendToggle(friend.id)}
                      className={`d-flex align-items-center gap-2 mb-2 p-2 rounded ${
                        isSelected ? "bg-dark text-white" : "bg-light"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      {friend.avatar && (
                        <Image
                          src={friend.avatar}
                          alt={friend.username}
                          roundedCircle
                          width={30}
                          height={30}
                        />
                      )}
                      <span>{friend.username}</span>

                      <div
                        style={{
                          marginLeft: "auto",
                          width: 20,
                          height: 20,
                          border: "2px solid",
                          borderColor: isSelected ? "white" : "black",
                          backgroundColor: isSelected ? "white" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && (
                          <span style={{ color: "black", fontSize: 16 }}>
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="light"
              style={{ backgroundColor: "black", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Skapar event...
                </>
              ) : (
                "Skapa event"
              )}
            </Button>
          </div>

          {isSuccess && (
            <Alert variant="success" className="mt-3">
              Event skapades framgångsrikt!
            </Alert>
          )}
          {(isError || error) && (
            <Alert variant="danger" className="mt-3">
              {mutationError?.message || error || "Något gick fel"}
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default CreateEvent;
