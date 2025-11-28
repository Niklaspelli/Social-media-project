// hooks/useEventInvitees.js
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchEventInvitees = async (eventId) => {
  return apiFetch(`/events/${eventId}/invitees`, {
    method: "GET",
  });
};

const useEventInvitees = (eventId) => {
  return useQuery({
    queryKey: ["eventInvitees", eventId],
    queryFn: () => fetchEventInvitees(eventId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};

export default useEventInvitees;
