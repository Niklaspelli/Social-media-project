import React from "react";
import CreateEvent from "./create-event";
import EventList from "./event-list";

const EventView = () => {
  return (
    <div style={{ color: "white" }}>
      Här ska det visas Events.
      <CreateEvent />
      <EventList />
    </div>
  );
};

export default EventView;
