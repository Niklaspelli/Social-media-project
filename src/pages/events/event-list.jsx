import React from "react";
import { Card, Container, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // ✅ hämta authData
import useEvents from "../../queryHooks/events/useEvents";

const EventList = () => {
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  const { data: events, isLoading, isError, error } = useEvents(accessToken);

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (isError)
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Fel vid hämtning av events: {error.message}
        </Alert>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h2 className="text-white mb-4">Kommande Events</h2>
      {events.length === 0 && (
        <p className="text-white">Inga events hittades.</p>
      )}
      {events.map((event) => (
        <Card
          key={event.id}
          bg="dark"
          text="white"
          className="mb-3 shadow"
          style={{ borderColor: "#444" }}
        >
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-white">
              {new Date(event.datetime).toLocaleString()} — {event.location}
            </Card.Subtitle>
            <Card.Text>{event.description}</Card.Text>
            <Card.Footer className="text-muted">
              Skapad av: {event.creator_username}
            </Card.Footer>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default EventList;
