import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import sv from "date-fns/locale/sv";
import "./event-styling.css";

const locales = {
  sv,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function UserCalendar({ events }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const toLocalDate = (dateString) => {
    const date = new Date(dateString);
    // justera för lokal tidszon
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  console.log(
    "Calendar events →",
    events.map((e) => ({
      id: e.id,
      title: e.title,
      raw: e.datetime,
      parsed: new Date(e.datetime),
    }))
  );
  const calendarEvents = events
    .filter((e) => e.datetime)
    .map((event) => ({
      title: event.title,
      start: toLocalDate(event.datetime),
      end: toLocalDate(event.datetime),
      allDay: false,
      id: event.id,
    }));
  // Filtrera event som matchar vald dag
  const dailyEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((event) =>
      isSameDay(new Date(event.datetime), selectedDate)
    );
  }, [selectedDate, events]);

  // Klick på ett event i kalendern => navigera till detaljer
  const handleSelectEvent = (event) => {
    navigate(`/events/event-details/${event.id}`);
  };

  // Klick på ett datum i kalendern => visa dagvy
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  return (
    <div style={{ color: "white" }}>
      {/* Kalender */}
      <div style={{ height: 600, marginBottom: "2rem" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents.map((e) => ({
            ...e,
            end: new Date(e.start.getTime() + 60 * 60 * 1000), // gör eventet synligt en timme långt
          }))}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{
            height: 600,
            borderRadius: "10px",
            backgroundColor: "white",
            color: "black",
          }}
          defaultView="month"
          views={["month", "week", "agenda"]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>

      {/* Dagvy: visas om datum har valts */}
      {selectedDate && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Events on {selectedDate.toLocaleDateString()}</h4>
            <Button variant="secondary" onClick={() => setSelectedDate(null)}>
              Back to Month View
            </Button>
          </div>

          {dailyEvents.length === 0 ? (
            <p>No events for this day.</p>
          ) : (
            <div className="d-flex flex-wrap gap-3">
              {dailyEvents.map((event) => (
                <Card
                  key={event.id}
                  style={{
                    width: "18rem",
                    backgroundColor: "#1c1c1c",
                    color: "black",
                  }}
                >
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(event.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Card.Subtitle>
                    <Card.Text>{event.description}</Card.Text>
                    <Button
                      variant="light"
                      style={{ backgroundColor: "black", color: "white" }}
                      onClick={() =>
                        navigate(`/events/event-details/${event.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
