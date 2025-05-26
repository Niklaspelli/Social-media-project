import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const deletePost = async ({ postId, accessToken, csrfToken }) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/feed-post/${postId}`,
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

export default function useDeleteFeedPost(userId, accessToken) {
  const queryClient = useQueryClient();
  const { csrfToken } = useAuth();

  return useMutation({
    mutationFn: ({ postId }) => deletePost({ postId, accessToken, csrfToken }),
    onSuccess: () => {
      console.log("🗑️ Post deleted via React Query hook");
      queryClient.invalidateQueries(["feedPosts", userId, accessToken]);
    },
    onError: (error) => {
      console.error(
        "❌ Failed to delete post via React Query hook:",
        error.message
      );
    },
  });
}
