import { useMutation, useQueryClient } from "@tanstack/react-query";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const deletePost = async ({ postId, accessToken }) => {
  const csrfToken = getCookie("csrfToken");

  const res = await fetch(
    `http://localhost:5000/api/auth/feed-post/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "CSRF-TOKEN": csrfToken,
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

  return useMutation({
    mutationFn: ({ postId }) => deletePost({ postId, accessToken }),
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
