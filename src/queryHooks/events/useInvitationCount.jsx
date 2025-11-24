import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const useEventInvitationCount = () => {
  return useQuery({
    queryKey: ["eventInvitationCount"],
    queryFn: () => apiFetch("/events/invitations/count"), // ✅ hanterar token, CSRF, retries
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 10 * 60 * 1000, // 10 min
    retry: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
};

export default useEventInvitationCount;
