import { useQuery } from "@tanstack/react-query";

const fetchUserFeedPosts = async ({ queryKey }) => {
  const [_key, userId, accessToken] = queryKey; // _key är "feedPosts", ignorera den

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
    queryKey: ["feedPosts", userId, accessToken],
    queryFn: fetchUserFeedPosts,
    enabled: !!userId && !!accessToken,
  });
}
