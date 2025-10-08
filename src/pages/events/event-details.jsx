import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Spinner, Image, Accordion, Card } from "react-bootstrap";
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
    <Container className="mt-5 text-white">
      <Card
        className="bg-dark border-0 shadow-lg rounded-4 p-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold text-white mb-3">
            {event.title || "Untitled Event"}
          </h1>

          <Image
            src={event.event_image}
            alt={event.title || "Eventbild"}
            fluid
            rounded
            className="shadow-lg mb-3 border border-secondary"
            style={{
              height: "500px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        </div>

        <div className="d-flex align-items-center justify-content-center mb-4">
          <Image
            src={event.creator_avatar || "https://i.pravatar.cc/60"}
            alt={event.creator_name || "Creator"}
            roundedCircle
            width={80}
            height={80}
            className="me-3 border border-light shadow-sm"
          />
          <div>
            <p className="mb-0 text-white">Hosted by</p>
            <h5 className="fw-semibold text-white">
              {event.creator_name || "Unknown"}
            </h5>
          </div>
        </div>

        <hr className="border-secondary" />

        <div className="mb-3">
          <p className="mb-2">
            <strong>Date & Time:</strong>{" "}
            <span className="text-info">
              {event.datetime
                ? new Date(event.datetime).toLocaleString("sv-SE")
                : "TBD"}
            </span>
          </p>
          <p className="mb-2">
            <strong>Location:</strong>{" "}
            <span className="text-light">{event.location || "TBD"}</span>
          </p>
          <p className="mb-2">
            <strong>Description:</strong>{" "}
            <span className="text-light">
              {event.description || "No description."}
            </span>
          </p>
        </div>

        <Accordion flush alwaysOpen className="bg-transparent mt-4">
          <Accordion.Item eventKey="0" className="bg-dark text-light">
            <Accordion.Header>
              Accepted attendees ({accepted.length})
            </Accordion.Header>
            <Accordion.Body className="bg-secondary bg-opacity-10 rounded-3">
              {accepted.length > 0 ? (
                <ul className="list-unstyled">
                  {accepted.map((a) => (
                    <li
                      key={a.id}
                      className="d-flex align-items-center gap-3 mb-2 p-2 rounded bg-dark bg-opacity-25"
                    >
                      <Image
                        src={a.avatar || "https://i.pravatar.cc/30"}
                        alt={a.username || "User"}
                        roundedCircle
                        width={30}
                        height={30}
                        className="border border-light"
                      />
                      <span>{a.username || "Unknown"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white mb-0">No one has accepted yet.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="bg-dark text-light mt-3">
            <Accordion.Header>
              All invitees ({invitees.length})
            </Accordion.Header>
            <Accordion.Body className="bg-secondary bg-opacity-10 rounded-3">
              {invitees.length > 0 ? (
                <ul className="list-unstyled">
                  {invitees.map((i) => (
                    <li
                      key={i.id}
                      className="d-flex align-items-center gap-3 mb-2 p-2 rounded bg-dark bg-opacity-25"
                    >
                      <Image
                        src={i.avatar || "https://i.pravatar.cc/30"}
                        alt={i.username || "User"}
                        roundedCircle
                        width={30}
                        height={30}
                        className="border border-light"
                      />
                      <span>
                        {i.username || "Unknown"}{" "}
                        {i.status === "accepted" && (
                          <span className="text-success fw-semibold">
                            (Coming)
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">No invitees found.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </Container>
  );
}

export default EventDetails;
