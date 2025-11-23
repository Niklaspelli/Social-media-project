import { useQuery } from "@tanstack/react-query";

// Denna funktion hämtar faktiskt datan
const fetchFriendRequestCount = async (userId, accessToken) => {
  const res = await fetch(
    `http://localhost:5000/api/friends/friends/notifications/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include", // 🛠 Skicka med cookies
    }
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// Hooken använder funktionen ovan

const useGetFriendRequestCount = (userId, accessToken) => {
  return useQuery({
    queryKey: ["friendRequestCount", userId],
    queryFn: () => fetchFriendRequestCount(userId, accessToken),
    enabled: !!userId && !!accessToken,

    // 🧠 Viktigt:
    staleTime: 5 * 60 * 1000, // cache i 5 minuter
    refetchInterval: false, // stäng av automatisk polling
    refetchOnWindowFocus: true, // refetcha inte vid flikbyte
    refetchOnReconnect: true, // refetcha inte varje reconnect
    retry: 1,
  });
};

export default useGetFriendRequestCount;
