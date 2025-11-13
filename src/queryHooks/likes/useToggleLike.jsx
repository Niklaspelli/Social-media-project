/* import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export const useToggleLike = ({ threadId, responseId }) => {
  const { authData } = useAuth();
  const accessToken = authData?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (liked) => {
      if (!accessToken) throw new Error("Access token missing");

      const url = responseId
        ? `/forum/responses/${responseId}/like`
        : `/forum/threads/${threadId}/like`;

      const method = liked ? "DELETE" : "POST";

      return apiFetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    },
    onMutate: async (liked) => {
      const key = ["likeCount", threadId ?? responseId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old) => ({
        ...old,
        liked: !liked,
        likeCount: liked ? old.likeCount - 1 : old.likeCount + 1,
      }));

      return { previous };
    },
    onError: (err, liked, context) => {
      const key = ["likeCount", threadId ?? responseId];
      queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      const key = ["likeCount", threadId ?? responseId];
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export const useToggleLike = ({ threadId, responseId }) => {
  const { authData } = useAuth();
  const accessToken = authData?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLikedStatus) => {
      if (!accessToken) throw new Error("Access token missing");

      const url = responseId
        ? `/forum/responses/${responseId}/like`
        : `/forum/threads/${threadId}/like`;

      // Om vi vill like → POST, om vi vill unlike → DELETE
      const method = newLikedStatus ? "POST" : "DELETE";

      return apiFetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    },
    onMutate: async (newLikedStatus) => {
      const key = ["likeCount", threadId ?? responseId];

      // Avbryt eventuella pågående queries för att undvika race conditions
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData(key);

      // Optimistisk uppdatering
      queryClient.setQueryData(key, (old) => ({
        ...old,
        liked: newLikedStatus,
        likeCount: newLikedStatus ? old.likeCount + 1 : old.likeCount - 1,
      }));

      return { previous };
    },
    onError: (err, newLikedStatus, context) => {
      // Återställ om något går fel
      const key = ["likeCount", threadId ?? responseId];
      queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      const key = ["likeCount", threadId ?? responseId];
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
