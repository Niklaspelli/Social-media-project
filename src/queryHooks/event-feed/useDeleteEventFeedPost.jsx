import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export default function useDeleteEventFeedPost(eventId) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  const mutationFn = async ({ postId }) => {
    return apiFetch(`/events/feed/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, variables) => {
      console.log("🗑️ Event feed post deleted");

      // Uppdatera cache direkt
      queryClient.setQueryData(["eventOverview", eventId], (oldData) => {
        if (!oldData) return oldData;

        const updatedPosts = oldData.feed.posts.filter(
          (p) => p.id !== variables.postId
        );

        return {
          ...oldData,
          feed: {
            ...oldData.feed,
            posts: updatedPosts,
            total: Math.max(oldData.feed.total - 1, 0),
          },
        };
      });
    },
    onError: (error) => {
      console.error("❌ Failed to delete event feed post:", error.message);
    },
  });
}
