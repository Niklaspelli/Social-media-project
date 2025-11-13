import { Card, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EventDropdownMenu from "./event-dropdown-menu";
import DeleteButton from "../../components/DeleteButton";

function EventCard({ event, token, onDelete }) {
  return (
    <Card className="shadow-sm position-relative">
      <Card.Body>
        {/* Titel + meny */}
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title>{event.title}</Card.Title>
          <EventDropdownMenu
            event={event}
            eventId={event.id}
            token={token}
            onDelete={onDelete}
          />
        </div>

        {/* Bild */}
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

        {/* Info */}
        <Card.Subtitle className="mb-2 text-muted">
          {event.relation === "creator"
            ? "Created by you"
            : `Invited by ${event.creator_name}`}
        </Card.Subtitle>

        <Card.Text className="text-black">
          {event.description}
          <br />
          <strong>Date:</strong> {new Date(event.datetime).toLocaleString()}
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
  );
}

export default EventCard;
