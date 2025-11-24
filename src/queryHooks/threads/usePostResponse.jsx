import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const postResponse = async ({ threadId, responseText }) => {
  return apiFetch(`/forum/threads/${threadId}/responses`, {
    method: "POST",

    body: JSON.stringify({
      thread_id: threadId, // <-- LÄGG TILL DETTA
      body: responseText,
    }),
  });
};

export default function usePostResponse(threadId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseText }) => postResponse({ threadId, responseText }),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries(["threadDetail", threadId]);
      console.log("✅ Response posted successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to post response:", error.message);
    },
  });
}
