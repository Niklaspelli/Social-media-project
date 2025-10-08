// components/EventInviteesList.jsx
import React from "react";
import { Image, ListGroup, Spinner } from "react-bootstrap";
import useEventInvitees from "../../queryHooks/events/useEventInvitees";
import { useAuth } from "../../context/AuthContext";
import "./event-styling.css";

function EventInviteesList({ eventId }) {
  const { authData } = useAuth();
  const token = authData?.accessToken;

  const {
    data: invitees = [],
    isLoading,
    isError,
    error,
  } = useEventInvitees(eventId, token);

  if (isLoading) return <Spinner animation="border" />;

  if (isError) return <p>Error: {error.message}</p>;

  if (invitees.length === 0) return <p>No one is invited to this event yet.</p>;

  return (
    <ListGroup>
      {invitees.map((user) => (
        <ListGroup.Item
          key={user.id}
          className="d-flex align-items-center gap-3"
        >
          <Image src={user.avatar} roundedCircle width={40} height={40} />
          <div>
            <strong>{user.username}</strong>
            <p className="mb-0">
              Status: <em>{user.status}</em>
            </p>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default EventInviteesList;
