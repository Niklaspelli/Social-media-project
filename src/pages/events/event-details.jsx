import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Container, Spinner, Image, Accordion } from "react-bootstrap";

const fetchEventDetails = async (id, token) => {
  const response = await fetch(`http://localhost:5000/api/auth/events/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch event details");
  return response.json();
};

const fetchEventInvitees = async (id, token) => {
  const response = await fetch(
    `http://localhost:5000/api/auth/events/${id}/invitees`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch invitees");
  return response.json();
};

function EventDetails() {
  const { id } = useParams();
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

  const { data: invitees = [] } = useQuery({
    queryKey: ["eventInvitees", id],
    queryFn: () => fetchEventInvitees(id, token),
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

  // Dela upp invitees i accepted och alla
  const accepted = invitees.filter((i) => i.status === "accepted");

  return (
    <Container className="mt-4">
      <h1>{event.title}</h1>
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

      <Accordion alwaysOpen className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Show accepted attendees ({accepted.length})
          </Accordion.Header>
          <Accordion.Body>
            {accepted.length > 0 ? (
              <ul>
                {accepted.map((a) => (
                  <li key={a.id} className="d-flex align-items-center gap-2">
                    {a.avatar && (
                      <Image
                        src={a.avatar}
                        alt={a.username}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                    )}
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
          <Accordion.Header>
            Show all invitees ({invitees.length})
          </Accordion.Header>
          <Accordion.Body>
            {invitees.length > 0 ? (
              <ul>
                {invitees.map((i) => (
                  <li key={i.id} className="d-flex align-items-center gap-2">
                    {i.avatar && (
                      <Image
                        src={i.avatar}
                        alt={i.username}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                    )}
                    <span>
                      {i.username} {i.status === "accepted" ? "(accepted)" : ""}
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
