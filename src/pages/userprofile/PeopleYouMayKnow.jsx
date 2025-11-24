import { Card, Image, Button } from "react-bootstrap";
import usePeopleYouMayKnow from "../../queryHooks/friends/usePeopleYouMayKnow";
import { useAuth } from "../../context/AuthContext";

function PeopleYouMayKnow() {
  const { authData } = useAuth();
  const { data: suggestions = [] } = usePeopleYouMayKnow(authData?.accessToken);

  if (suggestions.length === 0) return null;

  return (
    <Card className="mb-3 shadow-sm text-white bg-info">
      <Card.Body>
        <Card.Title className="fs-6 text-black mb-3">
          People You May Know
        </Card.Title>

        {suggestions.map((user) => (
          <div
            key={user.id}
            className="d-flex align-items-center justify-content-between mb-3"
          >
            <div className="d-flex align-items-center">
              <Image
                src={user.avatar}
                roundedCircle
                width={45}
                height={45}
                className="me-3"
              />
              <div>
                <div>{user.username}</div>
                <small className="text-muted">
                  {user.mutualCount} mutual
                  {user.mutualCount !== 1 ? " friends" : " friend"}
                </small>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => console.log("Send request to:", user.id)}
            >
              Add Friend
            </Button>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}

export default PeopleYouMayKnow;
