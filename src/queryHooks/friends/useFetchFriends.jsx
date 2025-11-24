import { useQuery } from "@tanstack/react-query";

const useFriends = (loggedInUserId, token) => {
  const fetchFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/api/friends/friends/${loggedInUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }

    return response.json();
  };

  return useQuery({
    queryKey: ["friends", loggedInUserId],
    queryFn: fetchFriends,
    enabled: !!token && !!loggedInUserId,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useFriends;
