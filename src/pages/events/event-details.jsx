import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Container, Spinner, Image } from "react-bootstrap";
import EventInviteesList from "./event-invetees-list";
import { Accordion } from "react-bootstrap";

const fetchEventDetails = async (id, token) => {
  const response = await fetch(`http://localhost:5000/api/auth/events/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }

  return response.json();
};

function EventDetails() {
  const { id } = useParams(); // hämtar event_id från URL
  const { authData } = useAuth();
  const token = authData?.accessToken;

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["eventDetails", id],
    queryFn: () => fetchEventDetails(id, token),
    enabled: !!token && !!id,
  });

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (isError)
    return (
      <Container className="text-center mt-5">
        <p>Error: {error.message}</p>
      </Container>
    );

  if (!event)
    return (
      <Container className="text-center mt-5">
        <p>Event not found.</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h1 className="text-white">{event.title}</h1>
      <p>
        Hosted by <strong>{event.creator_name}</strong>
      </p>

      {event.creator_avatar && (
        <Image
          src={event.creator_avatar}
          alt={event.creator_name}
          roundedCircle
          width={60}
          height={60}
          className="mb-3"
        />
      )}

      <p>
        <strong>Date & Time:</strong>{" "}
        {new Date(event.datetime).toLocaleString("sv-SE")}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>

      <hr />
      <h4>Attendees</h4>

      <Accordion alwaysOpen className="my-3">
        <Accordion.Item
          eventKey="0"
          className="custom-accordion-item mb-2 shadow-sm rounded"
        >
          <Accordion.Header>Show accepted attendees</Accordion.Header>
          <Accordion.Body>
            {event.attendees && event.attendees.length > 0 ? (
              <ul>
                {event.attendees
                  .filter((a) => a.status === "accepted")
                  .map((a) => (
                    <li
                      key={a.id}
                      className="d-flex align-items-center gap-3 p-2 border-bottom"
                    >
                      <Image
                        src={a.avatar || "/default-avatar.png"}
                        alt={a.username}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                      <span>{a.username}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No one has accepted yet.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Show all invitees</Accordion.Header>
          <Accordion.Body>
            <EventInviteesList eventId={id} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default EventDetails;

const accordionStyle = {
  backgroundColor: open ? "#f2f2f2" : "#ffffff", // ändra blå till ljusgrå
  color: "#222",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "background-color 0.3s ease",
};

const headerStyle = {
  backgroundColor: open ? "#f2f2f2" : "#fff",
  color: "#333",
  fontWeight: "600",
};
