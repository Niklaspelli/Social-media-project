import { useQuery } from "@tanstack/react-query";

const fetchEventFeedPosts = async ({
  eventId,
  accessToken,
  limit = 4,
  offset = 0,
}) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/events/${eventId}/feed?limit=${limit}&offset=${offset}`,
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

export default function useEventFeedPosts(
  eventId,
  accessToken,
  limit = 4,
  offset = 0
) {
  return useQuery({
    queryKey: ["eventFeedPosts", eventId],
    queryFn: () =>
      fetchEventFeedPosts({ eventId, accessToken, limit, offset: 0 }),
    enabled: !!eventId && !!accessToken,
    staleTime: 0,
    refetchInterval: 5000, // hämtar nytt var 5:e sekund
    refetchOnWindowFocus: true,
  });
}
