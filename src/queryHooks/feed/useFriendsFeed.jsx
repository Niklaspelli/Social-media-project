import { useQuery } from "@tanstack/react-query";

const fetchFriendsFeed = async (accessToken) => {
  const res = await fetch("http://localhost:5000/api/auth/friends-feed", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch friends feed");
  }

  return data;
};

export default function useFriendsFeed(accessToken) {
  return useQuery({
    queryKey: ["friendsFeed", accessToken],
    queryFn: () => fetchFriendsFeed(accessToken),
    enabled: !!accessToken, // Only fetch if accessToken is present
    onSuccess: () => {
      console.log("✅ Friends feed fetched via React Query hook");
    },
    onError: (error) => {
      console.error(
        "❌ Failed to fetch friends feed via React Query hook:",
        error.message
      );
    },
  });
}
