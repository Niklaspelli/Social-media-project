export const useEventOverview = (page, limit, sort) => {
  return useQuery({
    queryKey: ["eventOverview", page, limit, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit, sort });
      return apiFetch(`/events/overview?${params.toString()}`);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
