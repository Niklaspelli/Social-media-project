import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export const useLikeCount = ({ responseId }) => {
  return useQuery({
    queryKey: ["likeCount", responseId],
    queryFn: async () => {
      return apiFetch(`/forum/responses/${responseId}/likes`); // ✅ korrekt endpoint
    },
    staleTime: 5 * 60 * 1000, // cache 5 min
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};
