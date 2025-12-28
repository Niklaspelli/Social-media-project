import { Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import useFriends from "../../queryHooks/friends/useFetchFriends";
import { apiFetch } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddFriendButton = ({ receiverId, token }) => {
  const { authData } = useAuth();
  const senderId = authData.userId;
  const queryClient = useQueryClient();

  const { data: friends = [], refetch } = useFriends(senderId, token);

  if (senderId === receiverId) return null;

  const isFriend = friends.some((friend) => friend.id === Number(receiverId));

  const addFriendMutation = useMutation({
    mutationFn: () =>
      apiFetch("/friends/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId }),
      }),
    onSuccess: () => queryClient.invalidateQueries(["friends", senderId]),
    onError: (err) => console.error("Add friend failed", err),
  });

  const unfollowMutation = useMutation({
    mutationFn: () =>
      apiFetch("/friends/unfollow", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ senderId, receiverId }),
      }),
    onSuccess: () => queryClient.invalidateQueries(["friends", senderId]),
    onError: (err) => console.error("Unfollow failed", err),
  });

  const handleClick = () => {
    if (isFriend) unfollowMutation.mutate();
    else addFriendMutation.mutate();
  };

  return (
    <Button variant={isFriend ? "danger" : "primary"} onClick={handleClick}>
      {isFriend ? "Unfollow" : "Add Friend"}
    </Button>
  );
};

export default AddFriendButton;
