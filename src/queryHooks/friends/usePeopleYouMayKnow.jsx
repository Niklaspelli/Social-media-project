import { useQuery } from "@tanstack/react-query";

export default function usePeopleYouMayKnow(token) {
  const fetchPYMK = async () => {
    const res = await fetch(
      "http://localhost:5000/api/friends/people-you-may-know",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to load People You May Know");
    }

    return res.json();
  };

  return useQuery({
    queryKey: ["people-you-may-know"],
    queryFn: fetchPYMK,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
}
