import { useState } from "react";
import { Dropdown, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDeleteEvent from "../../queryHooks/events/useDeleteEvent";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";

function EventDropdownMenu({ eventId, event, onDelete }) {
  const { authData } = useAuth();

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const { userId: loggedInUserId } = authData; // Inloggad användares ID

  // Hook för att radera event
  const { mutate: deleteEvent, isLoading: isDeleting } = useDeleteEvent();

  // Kontrollera om den inloggade användaren äger eventet
  const isOwnEvent = event && loggedInUserId === event.creator_id;

  console.log("own event:", isOwnEvent);

  const handleDeleteConfirm = () => {
    deleteEvent(
      { eventId },
      {
        onSuccess: () => {
          setShowConfirm(false);
          onDelete?.(eventId); // uppdatera parent listan
        },
      }
    );
  };

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle
          as={Button}
          variant="light"
          className="border-0 p-0 bg-transparent"
        >
          <span style={{ fontSize: "1.5rem" }}>⋯</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/events/event-details/${eventId}`}>
            View details
          </Dropdown.Item>

          {isOwnEvent && (
            <>
              <Dropdown.Item
                onClick={() => navigate(`/events/update/${eventId}`)}
              >
                Edit
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => setShowConfirm(true)}
                className="text-danger"
              >
                Delete
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* ConfirmDialog */}
      {isOwnEvent && (
        <ConfirmDialog
          show={showConfirm}
          title="Delete event"
          message={`Are you sure you want to delete "${event.title}"?`}
          isLoading={isDeleting}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}

export default EventDropdownMenu;
