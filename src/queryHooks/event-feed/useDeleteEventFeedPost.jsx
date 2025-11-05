import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const deleteEventFeedPost = async ({ postId, accessToken, csrfToken }) => {
  const res = await fetch(
    `http://localhost:5000/api/eventfeed/event-feed-post/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete post");
  }

  return postId;
};

export default function useDeleteEventFeedPost(eventId) {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ postId }) =>
      deleteEventFeedPost({ postId, accessToken, csrfToken }),
    onSuccess: () => {
      console.log("🗑️ Event feed post deleted");
      // Invalidatera just feeden för det aktuella eventet
      queryClient.invalidateQueries(["eventFeedPosts", eventId]);
    },
    onError: (error) => {
      console.error("❌ Failed to delete event feed post:", error.message);
    },
  });
}
