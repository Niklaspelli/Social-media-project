/* ✅ Förklaringar:

Vi använder useEventDetails för att hämta själva eventet (title, creator, location osv).

Vi använder useEventInvitees för att hämta alla invitees och deras status.

accepted beräknas lokalt som invitees.filter(i => i.status === 'accepted').

Vi visar två sektioner i en Accordion: en för accepted attendees, en för alla invitees.

På detta sätt har du en tydlig separation och du behöver inte blanda in event.attendees från backend längre. */

import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container, Spinner, Image, Accordion } from "react-bootstrap";
import useEventDetails from "../../queryHooks/events/useEventDetails";
import useEventInvitees from "../../queryHooks/events/useEventInvitees";

function EventDetails() {
  const { id } = useParams();
  const { authData } = useAuth();
  const token = authData?.accessToken;

  // Hämta eventdetaljer + attendees (accepted)
  const { data: event, isLoading, isError, error } = useEventDetails(id, token);

  // Hämta alla invitees (oavsett status)
  const { data: invitees = [] } = useEventInvitees(id, token);

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

  // Dela upp invitees i accepted och alla
  const accepted = invitees.filter((i) => i.status === "accepted");

  console.log("invitees", invitees);

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

        {/* All invitees */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>All invitees ({invitees.length})</Accordion.Header>
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
