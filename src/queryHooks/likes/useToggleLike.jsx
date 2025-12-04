import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export default function useToggleLike(threadId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ responseId }) => {
      return apiFetch(`/likes/${responseId}/like`, { method: "POST" });
    },

    // Optimistisk UI: uppdatera bara lokalt
    onMutate: async ({ responseId }) => {
      const key = ["responses", threadId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);

      if (!previous) return;

      const newData = previous.map((r) => {
        if (r.id === responseId) {
          return {
            ...r,
            userHasLiked: !r.userHasLiked,
            likeCount: r.likeCount + (r.userHasLiked ? -1 : 1),
          };
        }
        return r;
      });

      queryClient.setQueryData(key, newData);

      return { previous };
    },

    // Backa vid fel
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["responses", threadId], context.previous);
      }
    },

    // Vi **invalidate** inte hela listan längre → minskar risk för 429
    onSettled: () => {},
  });
}
