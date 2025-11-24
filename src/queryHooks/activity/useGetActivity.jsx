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
    staleTime: 2 * 60 * 1000, // 2 min
    cacheTime: 5 * 60 * 1000, // 5 min
    retry: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

export default useGetActivity;
