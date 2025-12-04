import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

export const useForumOverview = ({
  page = 1,
  limit = 6,
  sort = "desc",
  subjectId,
} = {}) => {
  return useQuery({
    queryKey: ["forumOverview", page, limit, sort, subjectId],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit, sort });
      if (subjectId) params.append("subjectId", subjectId);

      const data = await apiFetch(`/overview?${params.toString()}`);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,

    keepPreviousData: true,
  });
};
