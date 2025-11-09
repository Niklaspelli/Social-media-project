import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col, Image } from "react-bootstrap";
import useThreadDetail from "../../queryHooks/threads/useThreadDetail";
import ThreadResponseList from "./threadResponseList";
import ThreadResponse from "./ThreadResponse";

function ThreadDetail() {
  const { threadId } = useParams();

  const { data, isLoading, isError, error } = useThreadDetail(threadId);

  if (isLoading) return <p>Loading thread details...</p>;
  if (isError) return <p style={{ color: "red" }}>{error.message}</p>;

  const thread = data.thread;

  return (
    <Container className="mt-5">
      <h2 className="text-center text-white mb-4">{thread.title}</h2>
      <Card className="bg-dark text-white p-3 shadow">
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
            <small className="text-white">
              {new Date(thread.created_at).toLocaleString()}
            </small>
          </Col>
        </Row>
      </Card>
      <ThreadResponse
        threadId={threadId}
        isThreadLoading={isLoading}
        threadError={error}
      />{" "}
      <ThreadResponseList
        responses={data.responses}
        userId={data.authData?.id}
        threadId={thread.id}
      />
    </Container>
  );
}

export default ThreadDetail;
