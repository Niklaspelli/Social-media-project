import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

// Fetch-funktion
const fetchThreads = async ({
  page = 1,
  limit = 10,
  sort = "desc",
  subjectId = null,
}) => {
  let endpoint = `/forum/threads?page=${page}&limit=${limit}&sort=${sort}`;
  if (subjectId) endpoint += `&subject_id=${subjectId}`;
  return apiFetch(endpoint); // CSRF + retry hanteras i apiFetch
};

// Hook
const useThreads = ({
  page = 1,
  limit = 10,
  sort = "desc",
  subjectId = null,
  shared = false,
}) => {
  /*
    shared: om true → cache delas för alla komponenter med samma subjectId (t.ex. "sidebar senaste trådar")
            om false → cache per page/sort/limit
  */

  // Bygg queryKey
  const queryKey = shared
    ? ["threads", subjectId] // Delad cache
    : ["threads", subjectId, page, limit, sort]; // Unik cache per query

  return useQuery({
    queryKey,
    queryFn: () => fetchThreads({ page, limit, sort, subjectId }),
    keepPreviousData: true, // Smooth pagination
    staleTime: 5 * 60 * 1000, // 5 min innan data anses stale
    cacheTime: 10 * 60 * 1000, // Cache hålls 10 min
    retry: 1, // Max 1 retry
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    placeholderData: (prev) => prev, // Visar gammal data medan ny fetch sker
  });
};

export default useThreads;
