import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

// Hämta events med feed + invitees i samma endpoint
export const useEventOverview = ({
  eventId,
  feedLimit = 10,
  feedOffset = 0,
}) => {
  return useQuery({
    queryKey: ["eventOverview", eventId, feedLimit, feedOffset],
    queryFn: async () => {
      return apiFetch(
        `/events/${eventId}/overview?feedLimit=${feedLimit}&feedOffset=${feedOffset}`
      );
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
