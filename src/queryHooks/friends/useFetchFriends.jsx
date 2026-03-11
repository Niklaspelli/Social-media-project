import { useQuery } from "@tanstack/react-query";

const useFriends = (userId, token) => {
  const fetchFriends = async () => {
    const res = await fetch(
      `http://localhost:5000/api/friends/list/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to fetch friends");
    }

    return await res.json();
  };

  return useQuery({
    queryKey: ["friends", userId],
    queryFn: fetchFriends,
    enabled: !!userId && !!token,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export default useFriends;
