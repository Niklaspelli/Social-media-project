import { useQuery } from "@tanstack/react-query";

const useEvents = (accessToken) => {
  const fetchEvents = async () => {
    const response = await fetch("http://localhost:5000/api/events/events", {
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
    staleTime: 1000 * 60 * 5,
  });
};

export default useEvents;
