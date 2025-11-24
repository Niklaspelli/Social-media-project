import { useQuery } from "@tanstack/react-query";

const fetchReceivedRequests = async (token) => {
  const response = await fetch(
    "http://localhost:5000/api/friends/received-requests",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch received requests");
  }

  return response.json();
};

const useReceivedRequests = (token) => {
  return useQuery({
    queryKey: ["receivedRequests"],
    queryFn: () => fetchReceivedRequests(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 1, // cache i 1 min
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useReceivedRequests;
