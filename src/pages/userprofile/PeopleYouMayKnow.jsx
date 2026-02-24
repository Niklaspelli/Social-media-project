import { Card, Image, Button } from "react-bootstrap";
import usePeopleYouMayKnow from "../../queryHooks/friends/usePeopleYouMayKnow";
import AddFriendButton from "./AddFriendButton";
import { useAuth } from "../../context/AuthContext";

function PeopleYouMayKnow() {
  const { authData } = useAuth();

  const { data: suggestions = [] } = usePeopleYouMayKnow(authData?.accessToken);

  if (suggestions.length === 0) return null;

  return (
    <Card className="mb-3 shadow-sm text-black bg-white">
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

            <div className="mb-3">
              <AddFriendButton
                senderId={authData?.userId}
                receiverId={user.id}
                token={authData?.accessToken}
              />
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}

export default PeopleYouMayKnow;
