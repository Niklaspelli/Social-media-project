// useEvents.jsx
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api"; // samma helper som du använder för forum

const fetchEvents = async () => {
  return apiFetch("/events"); // apiFetch hanterar Authorization & CSRF
};

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 10 * 60 * 1000, // 10 min
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};

export default useEvents;
