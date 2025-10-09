import { useQuery } from "@tanstack/react-query";

const fetchEventFeedPosts = async ({ eventId, accessToken }) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/events/${eventId}/feed`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch feed posts");

  return res.json();
};

export default function useEventFeedPosts(eventId, accessToken) {
  return useQuery({
    queryKey: ["eventFeedPosts", eventId], // ✅ accessToken tas bort
    queryFn: () => fetchEventFeedPosts({ eventId, accessToken }),
    enabled: !!eventId && !!accessToken,
    staleTime: 60000, // rekommenderat: cachea i 60 sek
    refetchInterval: 10000, // hämtar nytt var 10:e sekund
  });
}
