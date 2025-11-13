/* import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const postFeed = async ({ content, accessToken, csrfToken }) => {
  const res = await fetch("http://localhost:5000/api/feed/feed-post", {
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
  const { accessToken, userId } = authData || {};

  return useMutation({
    mutationFn: ({ content }) => postFeed({ content, accessToken, csrfToken }),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedPosts", userId]);
      console.log("✅ Post created successfully");
    },
  });
}
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const postFeed = async ({ content, accessToken }) => {
  if (!accessToken) throw new Error("No access token available");

  return apiFetch("/feed/feed-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });
};

export default function useCreateFeedPost() {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken, userId } = authData || {};

  return useMutation({
    mutationFn: ({ content }) => postFeed({ content, accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedPosts", userId]);
      console.log("✅ Post created successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to create feed post:", error.message);
    },
  });
}
