import { useQuery } from "@tanstack/react-query";

const useFriends = (userId, token) => {
  const fetchFriends = async () => {
    const res = await fetch(`http://localhost:5000/api/friends/list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to fetch friends");
    }

    const data = await res.json();

    // extra safeguard: only return accepted friends
    return data.filter((f) => f.status !== "pending");
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
