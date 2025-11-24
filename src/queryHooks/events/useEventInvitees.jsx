// hooks/useEventInvitees.js
import { useQuery } from "@tanstack/react-query";

const fetchEventInvitees = async (eventId, token) => {
  const res = await fetch(
    `http://localhost:5000/api/events/events/${eventId}/invitees`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch invitees");
  return res.json(); // [{id, username, avatar, status}, ...]
};

const useEventInvitees = (eventId, token) => {
  return useQuery({
    queryKey: ["eventInvitees", eventId],
    queryFn: () => fetchEventInvitees(eventId, token),
    enabled: !!eventId && !!token,
    staleTime: 1000 * 60 * 2, // cache 2 min
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useEventInvitees;
