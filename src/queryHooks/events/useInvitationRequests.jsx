import { useQuery } from "@tanstack/react-query";

const fetchInvitationRequests = async (token) => {
  const response = await fetch("http://localhost:5000/api/events/invitations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

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
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useInvitationRequests;
