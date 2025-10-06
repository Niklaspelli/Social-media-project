import { useQuery } from "@tanstack/react-query";

const fetchInvitationRequests = async (token) => {
  const response = await fetch(
    "http://localhost:5000/api/auth/events/invitations",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch invitation requests");
  }

  return response.json();
};

const useInvitationRequests = (token) => {
  return useQuery({
    queryKey: ["invitationRequests"],
    queryFn: () => fetchInvitationRequests(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 1, // cache i 1 min
    refetchInterval: 1000 * 60, // auto-refresh var 1:a minut
  });
};

export default useInvitationRequests;
