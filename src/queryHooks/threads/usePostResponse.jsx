import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const postResponse = async ({ threadId, responseText }) => {
  return apiFetch(`/responses/${threadId}`, {
    method: "POST",
    body: JSON.stringify({
      body: responseText, // <-- matchar backend
      thread_id: threadId, // <-- backend kan använda om du vill
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
      console.error("❌ Failed to post response:", error?.message || error);
    },
  });
}
