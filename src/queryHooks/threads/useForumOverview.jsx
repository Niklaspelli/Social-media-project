import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export const useForumOverview = ({
  page = 1,
  limit = 10,
  sort = "desc",
} = {}) => {
  return useQuery({
    queryKey: ["forumOverview", page, limit, sort],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit, sort });
      return apiFetch(`/overview?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
