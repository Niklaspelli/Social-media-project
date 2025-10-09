import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const fetchUserEvents = async (token) => {
  const res = await fetch("http://localhost:5000/api/auth/events/user", {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

function EventList() {
  const { authData } = useAuth();
  const token = authData?.accessToken;

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["userEvents"],
    queryFn: () => fetchUserEvents(token),
    enabled: !!token,
  });

  if (isLoading) return <p>Loading events...</p>;

  return (
    <Container>
      <h2 className="text-white p-4 text-center">Your Events</h2>
      <Row>
        {events.length === 0 && <p>No events found</p>}
        {events.map((event) => (
          <Col key={event.id} xs={12} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {event.relation === "creator"
                    ? "Created by you"
                    : `Invited by ${event.creator_name}`}
                </Card.Subtitle>
                <Card.Text className="text-black">
                  {event.description}
                  <br />
                  <strong>Date:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                  <br />
                  <strong>Location:</strong> {event.location}
                </Card.Text>
                <Link to={`/events/event-details/${event.id}`}>
                  <Button
                    variant="light"
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EventList;
