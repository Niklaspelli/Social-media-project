import React from "react";
import CreateEvent from "./create-event";
import EventList from "./event-list";

const EventView = () => {
  return (
    <div style={{ color: "white" }}>
      <CreateEvent />
      <EventList />
    </div>
  );
};

export default EventView;
