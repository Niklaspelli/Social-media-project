import { Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import useFriends from "../../queryHooks/friends/useFetchFriends";
import { apiFetch } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddFriendButton = ({ receiverId, token }) => {
  const { authData } = useAuth();
  const senderId = authData.userId;
  const queryClient = useQueryClient();

  const { data: allConnections = [] } = useFriends(senderId, token);

  const isFriend = allConnections.find(
    (f) => Number(f.id) === Number(receiverId),
  );

  const isAccepted = isFriend?.status === "accepted";
  const isPending = isFriend?.status === "pending";

  const addFriendMutation = useMutation({
    mutationFn: () =>
      apiFetch("/friends/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId }),
      }),
    onSuccess: () => {
      (queryClient.invalidateQueries(["friends", senderId]),
        queryClient.invalidateQueries({ queryKey: ["peopleYouMayKnow"] }));
    },
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
    if (isAccepted) unfollowMutation.mutate();
    else if (isPending) return;
    else addFriendMutation.mutate();
  };

  // Bestäm text och färg baserat på status
  const getButtonConfig = () => {
    if (isAccepted) {
      return { variant: "danger", text: "Unfollow", disabled: false };
    }
    if (isPending) {
      return {
        variant: "secondary",
        text: "Friend Request Sent",
        disabled: true,
      };
    }
    return { variant: "primary", text: "Add Friend", disabled: false };
  };

  const { variant, text, disabled: configDisabled } = getButtonConfig();

  const isWorking = addFriendMutation.isPending || unfollowMutation.isPending;

  if (Number(senderId) === Number(receiverId)) return null;

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={configDisabled || isWorking}
    >
      {isWorking ? "Working..." : text}
    </Button>
  );
};

export default AddFriendButton;
