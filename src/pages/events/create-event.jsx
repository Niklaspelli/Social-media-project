import React, { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Kontrollera att sökvägen är korrekt
import useCreateEvent from "../../queryHooks/events/useCreateEvent"; // Din event-hook

const CreateEvent = () => {
  const { authData } = useAuth();
  const { accessToken } = authData || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

  const {
    mutate,
    isLoading,
    isError,
    error: mutationError,
    isSuccess,
  } = useCreateEvent();

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
      accessToken,
    });
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
