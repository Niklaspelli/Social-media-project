import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, getCsrfToken } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const deleteEventFeedPost = async ({ postId, accessToken }) => {
  if (!accessToken) throw new Error("No access token available");

  const csrfToken = await getCsrfToken();
  if (!csrfToken) throw new Error("CSRF token not ready");

  return apiFetch(`/eventfeed/event-feed-post/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
  });
};

export default function useDeleteEventFeedPost(eventId) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ postId }) => deleteEventFeedPost({ postId, accessToken }),
    onSuccess: (deletedPostId) => {
      console.log("🗑️ Event feed post deleted");
      queryClient.invalidateQueries(["eventFeedPosts"]);

      // Uppdatera cache direkt
      queryClient.setQueryData(["eventFeedPosts", eventId], (oldData) => {
        if (!oldData || !Array.isArray(oldData.posts))
          return { posts: [], total: 0 };
        return {
          ...oldData,
          posts: oldData.posts.filter((p) => p.id !== deletedPostId),
          total: Math.max(oldData.total - 1, 0),
        };
      });
    },
    onError: (error) => {
      console.error("❌ Failed to delete event feed post:", error.message);
    },
  });
}
