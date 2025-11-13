import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export const useUnlikeResponse = (responseId) => {
  const { authData } = useAuth();
  const accessToken = authData?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error("Access token missing");

      return apiFetch(`/forum/responses/${responseId}/like`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },

    onMutate: async () => {
      const key = ["likeCount", responseId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old) => ({
        ...old,
        liked: false,
        likeCount: Math.max((old?.likeCount ?? 1) - 1, 0),
      }));

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["likeCount", responseId], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likeCount", responseId] });
    },
  });
};
