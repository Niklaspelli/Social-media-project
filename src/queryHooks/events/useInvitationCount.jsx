import { useQuery } from "@tanstack/react-query";

const fetchEventInvitationCount = async (token) => {
  const response = await fetch(
    "http://localhost:5000/api/events/events/invitations/count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch event invitations count");
  }

  return response.json(); // { count: X }
};

const useEventInvitationCount = (token) => {
  return useQuery({
    queryKey: ["eventInvitationCount"],
    queryFn: () => fetchEventInvitationCount(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // cache i 2 minuter
    refetchInterval: 1000 * 60 * 2, // auto-refresh var 2:e minut
  });
};

export default useEventInvitationCount;
