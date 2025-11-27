import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export default function useToggleLike(threadId) {
  const { authData } = useAuth();
  const accessToken = authData?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ responseId }) => {
      if (!accessToken) throw new Error("Missing access token");

      return apiFetch(`/likes/${responseId}/like`, {
        method: "POST",
      });
    },

    // Optimistic UI
    onMutate: async ({ responseId }) => {
      const key = ["threadDetail", threadId];

      await queryClient.cancelQueries({ queryKey: key });

      const previousThread = queryClient.getQueryData(key);

      if (!previousThread) return;

      const newThread = structuredClone(previousThread);

      const response = newThread.responses.find((r) => r.id === responseId);

      if (response) {
        response.userHasLiked = !response.userHasLiked;
        response.likeCount += response.userHasLiked ? 1 : -1;
      }

      queryClient.setQueryData(key, newThread);

      return { previousThread };
    },

    // Backa om det felar
    onError: (_err, _vars, context) => {
      if (context?.previousThread) {
        queryClient.setQueryData(
          ["threadDetail", threadId],
          context.previousThread
        );
      }
    },

    // Always revalidate with real backend data
    onSettled: () => {
      queryClient.invalidateQueries(["threadDetail", threadId]);
    },
  });
}
