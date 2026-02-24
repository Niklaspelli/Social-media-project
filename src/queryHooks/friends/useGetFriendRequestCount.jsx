import { useQuery } from "@tanstack/react-query";

// Denna funktion hämtar faktiskt datan
const fetchFriendRequestCount = async (accessToken) => {
  const res = await fetch(`http://localhost:5000/api/friends/incoming/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include", // 🛠 Skicka med cookies
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// Hooken använder funktionen ovan

const useGetFriendRequestCount = (userId, accessToken) => {
  return useQuery({
    queryKey: ["friendRequestCount", userId],
    queryFn: () => fetchFriendRequestCount(accessToken),
    enabled: !!accessToken,

    // 🧠 Viktigt:
    staleTime: 5 * 60 * 1000, // cache i 5 minuter
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useGetFriendRequestCount;
