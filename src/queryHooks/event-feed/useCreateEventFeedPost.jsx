import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const postEventFeed = async ({ eventId, content, accessToken, csrfToken }) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/events/${eventId}/feed`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to post to event feed");
  return data; // data innehåller den nya posten
};

export default function useCreateEventFeedPost() {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ eventId, content }) =>
      postEventFeed({ eventId, content, accessToken, csrfToken }),

    onSuccess: (newPost, variables) => {
      // Uppdatera cachen direkt istället för att refetcha
      queryClient.setQueryData(
        ["eventFeedPosts", variables.eventId],
        (oldData) => {
          if (!oldData) return { posts: [newPost] };
          return {
            ...oldData,
            posts: [newPost, ...oldData.posts],
            total: oldData.total + 1, // prepend nya posten
          };
        }
      );
      console.log("✅ Event feed post created successfully");
    },

    onError: (error) => {
      console.error("❌ Failed to create event feed post:", error.message);
    },
  });
}
