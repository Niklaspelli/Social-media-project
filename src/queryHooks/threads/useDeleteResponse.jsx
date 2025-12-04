import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const deleteResponse = async ({ responseId }) => {
  return apiFetch(`/responses/${responseId}`, {
    method: "DELETE",
  });
};

export default function useDeleteResponse(threadId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId }) => deleteResponse({ responseId }),
    retry: 0,

    // Optimistisk uppdatering
    onMutate: async ({ responseId }) => {
      // Avbryt pågående fetch för samma query
      await queryClient.cancelQueries(["responses", threadId]);

      // Spara tidigare data
      const previousData = queryClient.getQueryData(["responses", threadId]);

      // Ta bort svaret direkt från cache
      queryClient.setQueryData(["responses", threadId], (old = []) =>
        old.filter((r) => r.id !== responseId)
      );

      return { previousData };
    },

    // Backa vid fel
    onError: (err, variables, context) => {
      console.error("❌ Failed to delete response:", err?.message || err);
      if (context?.previousData) {
        queryClient.setQueryData(["responses", threadId], context.previousData);
      }
    },

    onSuccess: () => {
      console.log("✅ Response deleted successfully (optimistic)");
    },
  });
}
