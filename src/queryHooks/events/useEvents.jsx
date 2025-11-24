import { useQuery } from "@tanstack/react-query";

const useEvents = (accessToken) => {
  const fetchEvents = async () => {
    const response = await fetch("http://localhost:5000/api/events", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // 🔑 samma som create
      },
    });

    if (!response.ok) {
      throw new Error("Kunde inte hämta events");
    }

    return response.json();
  };

  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    enabled: !!accessToken, // kör bara om token finns
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 10 * 60 * 1000, // 10 min
    retry: 0, // Ingen retry
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};

export default useEvents;
