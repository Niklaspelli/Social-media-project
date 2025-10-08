import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Spinner, Image, Accordion } from "react-bootstrap";
import useEventDetails from "../../queryHooks/events/useEventDetails";
import useEventInvitees from "../../queryHooks/events/useEventInvitees";
import "./event-styling.css";

function EventDetails() {
  const { id } = useParams();
  const { authData } = useAuth();
  const token = authData?.accessToken;

  // Hämta eventdetaljer + attendees
  const { data: event, isLoading, isError, error } = useEventDetails(id, token);
  const { data: invitees = [] } = useEventInvitees(id, token);

  // Loading state
  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  // Error state
  if (isError)
    return (
      <Container className="text-center mt-5">
        <p>Error: {error?.message || "Something went wrong."}</p>
      </Container>
    );

  // Event not found
  if (!event)
    return (
      <Container className="text-center mt-5">
        <p>Event not found.</p>
      </Container>
    );

  // Dela upp invitees i accepted och alla
  const accepted = invitees.filter((i) => i.status === "accepted");

  return (
    <Container className="mt-4">
      <h1 className="text-white">{event.title || "Untitled Event"}</h1>

      {/* Eventbild med fallback */}
      <Image
        src={event.event_image}
        alt={event.title || "Eventbild"}
        width={360}
        height={360}
        className="mb-3"
        style={{ objectFit: "cover" }}
        rounded
      />

      <p>
        Hosted by <strong>{event.creator_name || "Unknown"}</strong>
      </p>

      {/* Creator avatar med fallback */}
      <Image
        src={event.creator_avatar || "https://i.pravatar.cc/60"}
        alt={event.creator_name || "Creator"}
        roundedCircle
        width={60}
        height={60}
        className="mb-3"
      />

      <p>
        <strong>Date & Time:</strong>{" "}
        {event.datetime
          ? new Date(event.datetime).toLocaleString("sv-SE")
          : "TBD"}
      </p>
      <p>
        <strong>Location:</strong> {event.location || "TBD"}
      </p>
      <p>
        <strong>Description:</strong> {event.description || "No description."}
      </p>

      <Accordion alwaysOpen className="my-3">
        {/* Accepted attendees */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Accepted attendees ({accepted.length})
          </Accordion.Header>
          <Accordion.Body>
            {accepted.length > 0 ? (
              <ul>
                {accepted.map((a) => (
                  <li key={a.id} className="d-flex align-items-center gap-2">
                    <Image
                      src={a.avatar || "https://i.pravatar.cc/30"}
                      alt={a.username || "User"}
                      roundedCircle
                      width={30}
                      height={30}
                    />
                    <span>{a.username || "Unknown"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No one has accepted yet.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>

        {/* All invitees */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>All invitees ({invitees.length})</Accordion.Header>
          <Accordion.Body>
            {invitees.length > 0 ? (
              <ul>
                {invitees.map((i) => (
                  <li key={i.id} className="d-flex align-items-center gap-2">
                    <Image
                      src={i.avatar || "https://i.pravatar.cc/30"}
                      alt={i.username || "User"}
                      roundedCircle
                      width={30}
                      height={30}
                    />
                    <span>
                      {i.username || "Unknown"}{" "}
                      {i.status === "accepted" ? "(Coming)" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No invitees found.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default EventDetails;
