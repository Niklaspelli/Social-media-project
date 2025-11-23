import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { useAuth } from "../../../context/AuthContext"; // Make sure the path is correct
import SuccessDialog from "../../../components/SuccessDialog";
import useCreateThread from "../../../queryHooks/threads/useCreateThread"; // Import your custom hook
import "../forum-styling.css";

const CreateThread = ({ defaultSubjectId, onClose }) => {
  const { authData } = useAuth();
  const { username, accessToken } = authData;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);

  // Använd React Query hook för att skapa tråd
  const {
    mutate,
    isLoading,
    isError,
    error: mutationError,
    isSuccess,
  } = useCreateThread();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !body) {
      setError("Title and content are required");
      return;
    }

    mutate({
      title,
      body,
      username,
      accessToken,
      subject_id: defaultSubjectId, // 👈 ensure it's a number
    });
  };
  if (isSuccess) {
    return (
      <SuccessDialog message="Thread created successfully!" delay={2000} />
    );
  }

  return (
    <Container className="create-thread-container">
      <h3 className="text-center text-white mb-4">Create New Thread</h3>

      <Card className="create-thread-card">
        <CloseButton variant="white" aria-label="Hide" onClick={onClose} />
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="threadTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
            </Form.Group>

            <Form.Group controlId="threadBody" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={500}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Body"
                required
              />
            </Form.Group>

            <div className="align-center align-items-center d-flex justify-content-center">
              <Button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating thread...
                  </>
                ) : (
                  "Create thread"
                )}
              </Button>
            </div>

            {isError && (
              <Alert variant="danger" className="mt-3">
                Error: {mutationError?.message || "Något gick fel"}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateThread;
