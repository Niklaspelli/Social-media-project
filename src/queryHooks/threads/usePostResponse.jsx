import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const postResponse = async ({ threadId, responseText }) => {
  return apiFetch(`/responses/${threadId}`, {
    method: "POST",
    body: JSON.stringify({
      body: responseText, // matchar backend
      thread_id: threadId,
    }),
  });
};

export default function usePostResponse(threadId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseText }) => postResponse({ threadId, responseText }),
    retry: 0,

    // Optimistisk UI: lägg till svaret direkt i responses
    onMutate: async ({ responseText }) => {
      const key = ["responses", threadId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];

      const tempResponse = {
        id: Math.random().toString(36).substr(2, 9), // temporärt ID
        body: responseText,
        likeCount: 0,
        userHasLiked: false,
        temp: true,
      };

      queryClient.setQueryData(key, [tempResponse, ...previous]);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["responses", threadId], context.previous);
      }
      console.error("❌ Failed to post response:", _err?.message || _err);
    },

    onSuccess: (newResponse) => {
      const key = ["responses", threadId];
      // Byt ut temporär post mot riktig från backend
      queryClient.setQueryData(key, (old = []) =>
        old.map((r) => (r.temp ? newResponse : r))
      );
      console.log("✅ Response posted successfully");
    },

    // Ingen massrefetch → minskar risk för 429
    onSettled: () => {},
  });
}
