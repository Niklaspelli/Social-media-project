import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Container, Spinner, Image, Button } from "react-bootstrap";
import EventInviteesList from "./event-invetees-list";

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
      <h1>{event.title}</h1>
      <p className="text-muted">
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

      {event.attendees && event.attendees.length > 0 && (
        <>
          <h4>Attendees</h4>
          <ul>
            {event.attendees.map((a) => (
              <li key={a.id}>
                {a.username}{" "}
                {a.avatar && (
                  <Image
                    src={a.avatar}
                    alt={a.username}
                    roundedCircle
                    width={30}
                    height={30}
                    className="ms-2"
                  />
                )}
              </li>
            ))}
          </ul>
          <div>
            {/* ...andra eventdetaljer */}
            <h3>Invitees</h3>
            <EventInviteesList eventId={id} />
          </div>
        </>
      )}

      <Button variant="secondary" href="/notifications">
        Back to Notifications
      </Button>
    </Container>
  );
}

export default EventDetails;
