import { useQuery } from "@tanstack/react-query";

const useMutualFriends = (loggedInUserId, otherUserId, token) => {
  const fetchMutual = async () => {
    const response = await fetch(
      `http://localhost:5000/api/friends/mutual-friends/${loggedInUserId}/${otherUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch mutual friends");
    }

    return response.json();
  };

  return useQuery({
    queryKey: ["mutual-friends", loggedInUserId, otherUserId],
    queryFn: fetchMutual,
    enabled: !!token && !!loggedInUserId && !!otherUserId,
    staleTime: 1000 * 60 * 5,
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useMutualFriends;
