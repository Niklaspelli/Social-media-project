import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchSubjects = async () => {
  return apiFetch("/forum/subjects"); // CSRF + retry hanteras i apiFetch
};

const useGetSubjects = () =>
  useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    staleTime: 10 * 60 * 1000, // 10 min
    refetchOnWindowFocus: false,
    retry: 1, // max 1 retry
  });

export default useGetSubjects;
