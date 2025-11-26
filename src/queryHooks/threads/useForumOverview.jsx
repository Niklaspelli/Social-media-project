import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export const useForumOverview = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["forumOverview", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit });
      const data = await apiFetch(`/overview?${params.toString()}`);

      // Data från backend: { subjects, threads, totalThreads }
      // Varje thread innehåller responses array med likeCount
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minuter caching
    refetchOnWindowFocus: false, // Inget refetch vid fönsterfokus
    retry: 0, // Ingen automatisk retry
  });
};
