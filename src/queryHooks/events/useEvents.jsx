import { useQuery } from "@tanstack/react-query";

const fetchEvents = async () => {
  const response = await fetch("http://localhost:5000/api/auth/events", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta events");
  }

  return response.json();
};

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};

export default useEvents;
