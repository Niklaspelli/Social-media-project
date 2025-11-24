import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export const useForumOverview = (page = 1, limit = 10, sort = "desc") => {
  return useQuery({
    queryKey: ["forumOverview", page, limit, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit, sort });
      return apiFetch(`/forum/threads/overview?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
