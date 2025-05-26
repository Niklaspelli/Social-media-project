import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const postFeed = async ({ content, accessToken, csrfToken }) => {
  const res = await fetch("http://localhost:5000/api/auth/feed-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to post");
  return data;
};

export default function useCreateFeedPost() {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ content }) => postFeed({ content, accessToken, csrfToken }),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedPosts"]);
      console.log("✅ Post created successfully");
    },
  });
}
