import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Accordion,
  Spinner,
} from "react-bootstrap";

const EventForm = ({
  initialData = {},
  onSubmit,
  isLoading,
  buttonText,
  friends = [],
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datetime: "",
    location: "",
    event_image: null,
    invitees: [],
  });

  // Fyll i data om vi redigerar
  useEffect(() => {
    if (initialData.id) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        datetime: initialData.datetime ? initialData.datetime.slice(0, 16) : "",
        location: initialData.location || "",
        event_image: initialData.event_image || null,
        invitees:
          initialData.invitees?.map((f) => f.id) ||
          initialData.invitedUserIds ||
          [],
      });
    }
  }, [initialData]);

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const data = new FormData();
    data.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    return json.data.url;
  };

  const handleFriendToggle = (friendId) => {
    setFormData((prev) => ({
      ...prev,
      invitees: prev.invitees.includes(friendId)
        ? prev.invitees.filter((id) => id !== friendId)
        : [...prev.invitees, friendId],
    }));
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Title:</Form.Label>
        <Form.Control
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Välj eventbild:</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const url = await uploadToImgBB(e.target.files[0]);
            setFormData({ ...formData, event_image: url });
          }}
        />
        {formData.event_image && (
          <Image
            src={formData.event_image}
            rounded
            width={150}
            className="mt-2"
          />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date & Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              required
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Location:</Form.Label>
            <Form.Control
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Accordion className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Invite friends...</Accordion.Header>
          <Accordion.Body>
            {friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => handleFriendToggle(friend.id)}
                className={`p-2 mb-1 rounded d-flex align-items-center justify-content-between ${formData.invitees.includes(friend.id) ? "bg-primary text-white" : "bg-light text-dark"}`}
                style={{ cursor: "pointer" }}
              >
                <span>{friend.username}</span>
                {formData.invitees.includes(friend.id) && <span>✓</span>}
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-grid">
        <Button
          type="submit"
          variant="light"
          className="bg-black text-white"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : buttonText}
        </Button>
      </div>
    </Form>
  );
};

export default EventForm;
