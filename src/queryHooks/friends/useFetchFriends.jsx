import { useQuery } from "@tanstack/react-query";

const useFriends = (loggedInUserId, token) => {
  const fetchFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/api/auth/friends/${loggedInUserId}`,
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
  });
};

export default useFriends;
