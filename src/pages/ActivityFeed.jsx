import { useState } from "react";
import { ListGroup, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useGetActivity from "../queryHooks/activity/useGetActivity";

export default function ActivityFeed() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetActivity();
  const [visibleCount, setVisibleCount] = useState(5); // visa 5 först

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>Något gick fel...</p>;

  const handleShowMore = () => {
    setVisibleCount(data.length); // visa alla
  };

  const handleShowLess = () => {
    setVisibleCount(5); // återgå till 5
  };

  const handleNavigateToThread = (threadId) => {
    navigate(`/threads/${threadId}`);
  };

  return (
    <div className="p-2 border rounded">
      <h5>Forumaktivitet</h5>
      <ListGroup variant="flush">
        {data.slice(0, visibleCount).map((item) => (
          <ListGroup.Item
            key={`${item.type}-${item.thread_id}-${item.timestamp}`}
            action
            onClick={() => handleNavigateToThread(item.thread_id)}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              {item.type === "thread" ? (
                <Badge bg="primary" className="me-2">
                  Ny tråd
                </Badge>
              ) : (
                <Badge bg="success" className="me-2">
                  Svar
                </Badge>
              )}
              {item.type === "thread" ? (
                <>
                  <i>{item.username}</i> skapade: "<strong>{item.title}</strong>
                  "
                </>
              ) : (
                <>
                  <i>{item.username}</i> svarade i tråd "
                  <strong>{item.thread_title}</strong>"
                </>
              )}
            </div>
            <small className="text-muted">
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {data.length > 5 && (
        <div className="mt-2 text-center">
          {visibleCount < data.length ? (
            <Button variant="link" onClick={handleShowMore}>
              Visa fler
            </Button>
          ) : (
            <Button variant="link" onClick={handleShowLess}>
              Visa mindre
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
