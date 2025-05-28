import { useQuery } from "@tanstack/react-query";

const fetchUserFeedPosts = async ({ userId, accessToken }) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/feed-post/user/${userId}`,
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

export default function useUserFeedPosts(userId, accessToken) {
  return useQuery({
    queryKey: ["feedPosts", userId], // ✅ accessToken tas bort
    queryFn: () => fetchUserFeedPosts({ userId, accessToken }),
    enabled: !!userId && !!accessToken,
    staleTime: 60000, // rekommenderat: cachea i 60 sek
    refetchOnWindowFocus: false,
  });
}
