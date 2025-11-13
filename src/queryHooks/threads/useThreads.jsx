/* import { useQuery } from "@tanstack/react-query";

const fetchThreads = async () => {
  const response = await fetch("http://localhost:5000/api/auth/threads", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch threads");
  }

  return await response.json();
};

const useThreads = () => {
  return useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
    staleTime: 1000 * 60, // 1 minut: data anses fräsch
    cacheTime: 1000 * 60 * 5, // 5 minuter: sparas i cache även om komponenten unmountas
    retry: 1, // försök bara en gång till vid fel (eller sätt false)
  });
};

export default useThreads; */

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchThreads = async (
  page = 1,
  limit = 10,
  sort = "desc",
  subjectId = null
) => {
  let endpoint = `/forum/threads?page=${page}&limit=${limit}&sort=${sort}`;
  if (subjectId) endpoint += `&subject_id=${subjectId}`;
  return apiFetch(endpoint); // CSRF + retry + errors
};

const useThreads = (page, limit, sort, subjectId) =>
  useQuery({
    queryKey: ["threads", page, limit, sort, subjectId],
    queryFn: () => fetchThreads(page, limit, sort, subjectId),
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 min
    retry: 1,
    refetchOnWindowFocus: false,
  });

export default useThreads;
