import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const useEventInvitationCount = () => {
  return useQuery({
    queryKey: ["eventInvitationCount"],
    queryFn: () => apiFetch("/events/invitations/count"), // ✅ hanterar token, CSRF, retries
    staleTime: 1000 * 60 * 2, // cache i 2 minuter
    refetchOnWindowFocus: false, // hindrar spam vid tab-switch
    refetchOnReconnect: false,
  });
};

export default useEventInvitationCount;
