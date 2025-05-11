import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path accordingly
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import LikeButton from "./LikeButton";

const BackendURL = "http://localhost:5000";

function ThreadDetail() {
  const { threadId } = useParams();
  const { authData } = useAuth();
  const { username, avatar, accessToken, csrfToken } = authData;
  const [thread, setThread] = useState({});
  const [responses, setResponses] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State to store deletion errors for specific responses
  const [deleteErrors, setDeleteErrors] = useState({});

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetch thread details and responses
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${BackendURL}/api/auth/threads/${threadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch thread");
        }
        const data = await response.json();
        setThread(data.thread);
        setResponses(data.responses);
      } catch (error) {
        console.error("Failed to fetch thread:", error.message);
        setError("Failed to fetch thread. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  // Handle submitting a new response
  const handleResponseSubmit = async (e) => {
    const csrfToken = getCookie("csrfToken"); // You need to implement getCookie

    e.preventDefault();

    try {
      const response = await fetch(
        `${BackendURL}/api/auth/threads/${threadId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "CSRF-TOKEN": csrfToken,
          },
          credentials: "include", // Include cookies in the request

          body: JSON.stringify({ body: responseText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post response");
      }

      const newResponse = await response.json();
      setResponses((prevResponses) => [newResponse.response, ...prevResponses]);
      setResponseText("");
      setSuccess(true);
    } catch (error) {
      console.error("Failed to post response:", error.message);
      setError("Failed to post response. Please try again later.");
    }
  };

  // Handle deleting a response
  const handleDeleteResponse = async (responseId) => {
    try {
      const response = await fetch(
        `${BackendURL}/api/auth/responses/${responseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete response");
      }

      // Update the responses state to remove the deleted response
      setResponses((prevResponses) =>
        prevResponses.filter((res) => res.id !== responseId)
      );

      // Clear the error for this response if deletion was successful
      setDeleteErrors((prevErrors) => ({
        ...prevErrors,
        [responseId]: null,
      }));
    } catch (error) {
      console.error("Failed to delete response:", error.message);
      // Set the error for this specific response
      setDeleteErrors((prevErrors) => ({
        ...prevErrors,
        [responseId]: "Failed to delete response. Please try again later.",
      }));
    }
  };

  if (loading) {
    return <p>Loading thread details...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Container className="mt-5">
      {/* Thread Title */}
      <h2 className="text-center text-white mb-4">{thread.title}</h2>

      {/* Thread Body */}
      <Card className="bg-dark text-white mb-4 p-3 shadow">
        <Row>
          <Col xs="auto">
            <Image
              src={thread.avatar || "/default-avatar.jpg"}
              roundedCircle
              width={50}
              height={50}
              className="me-3"
            />
          </Col>
          <Col>
            <Card.Title>
              <Link
                to={`/user/${thread.user_id}`}
                className="text-white text-decoration-none"
              >
                <strong>{thread.username}</strong>
              </Link>
            </Card.Title>
            <Card.Text>{thread.body}</Card.Text>
            <small className="text-muted">
              {new Date(thread.created_at).toLocaleString()}
            </small>
          </Col>
        </Row>
      </Card>

      {/* Responses */}
      {responses.length > 0 ? (
        responses.map((res) => (
          <Card key={res.id} className="bg-dark text-white mb-3 p-3 shadow">
            <Row>
              <Col xs="auto">
                <Image
                  src={res.avatar || "/default-avatar.jpg"}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-3"
                />
              </Col>
              <Col>
                <Card.Title>
                  <Link
                    to={`/user/${res.user_id}`}
                    className="text-white text-decoration-none"
                  >
                    <strong>{res.username}</strong>
                  </Link>{" "}
                  wrote:
                </Card.Title>
                <Card.Text>{res.body}</Card.Text>
                <small className="text-white">
                  {new Date(res.created_at).toLocaleString()}
                </small>

                {/* Actions */}
                <div className="d-flex align-items-center gap-2 mt-2">
                  {res.userId === authData.id && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteResponse(res.id)}
                      >
                        Delete
                      </Button>
                      {deleteErrors[res.id] && (
                        <Alert variant="danger" className="mt-2">
                          {deleteErrors[res.id]}
                        </Alert>
                      )}
                    </>
                  )}
                  <LikeButton
                    threadId={res.id}
                    responseId={res.id}
                    initialLikeStatus={res.userHasLiked}
                    initialLikeCount={res.likeCount}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <p className="text-white">No responses yet.</p>
      )}

      {/* Response Form */}
      <Card className="bg-dark text-white p-3 mt-5 shadow">
        <Form onSubmit={handleResponseSubmit}>
          <Form.Group controlId="responseTextArea">
            <Form.Label>Write your response</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response here..."
              style={{
                backgroundColor: "#333",
                color: "#fff",
                borderColor: "#444",
              }}
              required
            />
          </Form.Group>
          <Button type="submit" variant="light" className="mt-3">
            Post Response
          </Button>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mt-3">
              Response posted successfully!
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
}

export default ThreadDetail;

const inputStyle = {
  width: "500px",
  height: "200px",

  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
  backgroundColor: "grey",
  color: "white",
  border: "none",
};

const StyleContainer = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  margin: "20px",
};

const threadCreator = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  marginBottom: "15px",
  margin: "5px",

  width: "100%", // Full width of the parent
  maxWidth: "500px", // Limit the max width
  borderRadius: "20px",
  padding: "15px",
  boxSizing: "border-box",
  boxShadow: "2px 2px 0px black",
  backgroundColor: "white",
  background: "hsla(0, 2.70%, 50.00%, 0.78)", // Fully transparent background

  backdropFilter: "blur(8px)", // Blur the background content behind the element
  overflowWrap: "break-word", // Ensure long words break
};

const RespContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  marginBottom: "15px",
  margin: "5px",

  width: "100%", // Full width of the parent
  maxWidth: "500px", // Limit the max width
  borderRadius: "20px",
  padding: "15px",
  boxSizing: "border-box",
  boxShadow: "2px 2px 0px black",
  backgroundColor: "white",
  background: "hsla(0, 0.90%, 22.50%, 0.78)", // Fully transparent background

  backdropFilter: "blur(8px)", // Blur the background content behind the element
  overflowWrap: "break-word", // Ensure long words break
};

// Example of how the text container could look
const textContent = {
  width: "100%",
  wordWrap: "break-word",
  marginBottom: "10px",
};
