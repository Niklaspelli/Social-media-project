import { useQuery } from "@tanstack/react-query";

// Denna funktion hämtar faktiskt datan
const fetchFriendRequestCount = async (userId, accessToken) => {
  const res = await fetch(
    `http://localhost:5000/api/auth/friends/notifications/${userId}`,
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
    queryFn: () => fetchFriendRequestCount(userId, accessToken), // ✅ korrekt här
    enabled: !!userId && !!accessToken, // bara kör om userId finns
    refetchInterval: 120000, // var 2:a minut istället för 30s
    staleTime: 120000, // cache i 2 minuter
    refetchOnWindowFocus: false,
  });
};

export default useGetFriendRequestCount;
