// useGetActivity.jsx
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api"; // samma som du använder för subjects

const fetchActivity = async () => {
  return apiFetch("/activity"); // apiFetch hanterar Authorization & CSRF
};

const useGetActivity = () =>
  useQuery({
    queryKey: ["activity"],
    queryFn: fetchActivity,
    staleTime: 60 * 1000, // 1 minut
    refetchOnWindowFocus: true,
    retry: 1, // max 1 retry
    onError: (err) => console.error("Error fetching activity:", err),
  });

export default useGetActivity;
