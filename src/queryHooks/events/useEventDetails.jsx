// hooks/useEventDetails.js
import { useQuery } from "@tanstack/react-query";

const fetchEventDetails = async (id, token) => {
  const res = await fetch(`http://localhost:5000/api/events/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch event details");
  return res.json();
};

const useEventDetails = (id, token) => {
  return useQuery({
    queryKey: ["eventDetails", id],
    queryFn: () => fetchEventDetails(id, token),
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 2, // cache 2 min
  });
};

export default useEventDetails;
