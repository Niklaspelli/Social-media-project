import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchEventOverview = async ({ queryKey }) => {
  const [_key, { eventId, feedLimit, feedOffset }] = queryKey;
  return apiFetch(
    `/events/${eventId}/overview?feedLimit=${feedLimit}&feedOffset=${feedOffset}`
  );
};

export const useEventOverview = ({
  eventId,
  feedLimit = 10,
  feedOffset = 0,
}) => {
  return useQuery({
    queryKey: ["eventOverview", { eventId, feedLimit, feedOffset }],
    queryFn: fetchEventOverview,
    staleTime: 2 * 60 * 1000, // 2 min
    cacheTime: 5 * 60 * 1000, // 5 min
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
