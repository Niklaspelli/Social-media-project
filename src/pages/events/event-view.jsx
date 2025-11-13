import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import EventList from "./event-list";
import UserCalendar from "./user-calendar";
import "./event-styling.css"; // Lägg till CSS för fade-animation
import { useUserEvents } from "../../queryHooks/events/useUserEvents";

const EventView = () => {
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" eller "list"

  const { data: events = [], isLoading } = useUserEvents();

  if (isLoading) return <p style={{ color: "white" }}>Loading events...</p>;

  return (
    <Container style={{ color: "white" }}>
      <h2 className="text-center p-4">Your Events</h2>

      {/* Vy-växlingsknappar */}
      <div className="mb-4 text-center">
        <Button
          variant="outline-light"
          className="me-2 border-white"
          onClick={() => setViewMode("calendar")}
        >
          Calendar View
        </Button>
        <Button
          variant="outline-light"
          className="me-2 border-white"
          onClick={() => setViewMode("list")}
        >
          List View
        </Button>
      </div>

      {/* Animated switch mellan vyer */}
      <SwitchTransition mode="out-in">
        <CSSTransition key={viewMode} timeout={300} classNames="fade">
          <div>
            {viewMode === "calendar" ? (
              <UserCalendar events={events} />
            ) : (
              <EventList events={events} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  );
};

export default EventView;
