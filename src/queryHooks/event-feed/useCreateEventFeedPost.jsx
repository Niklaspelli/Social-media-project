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
  return data;
};

export default function useCreateEventFeedPost() {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ eventId, content }) =>
      postEventFeed({ eventId, content, accessToken, csrfToken }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["eventFeedPosts", variables.eventId]);
      console.log("✅ Event feed post created successfully");
    },

    onError: (error) => {
      console.error("❌ Failed to create event feed post:", error.message);
    },
  });
}
