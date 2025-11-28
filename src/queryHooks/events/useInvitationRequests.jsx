// hooks/useInvitationRequests.js
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchInvitationRequests = async () => {
  return apiFetch(`/events/invitations/incoming`, {
    method: "GET",
  });
};

const useInvitationRequests = () => {
  return useQuery({
    queryKey: ["invitationRequests"],
    queryFn: fetchInvitationRequests,
    enabled: true,
    staleTime: 1000 * 60 * 1,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};

export default useInvitationRequests;
