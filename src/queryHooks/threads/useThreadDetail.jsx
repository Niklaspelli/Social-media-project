import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchThreadDetail = async (threadId) => {
  if (!threadId) throw new Error("Thread ID is required");
  return apiFetch(`/forum/threads/${threadId}`);
};

const useThreadDetail = (threadId) => {
  return useQuery({
    queryKey: ["threadDetail", threadId],
    queryFn: () => fetchThreadDetail(threadId),
    enabled: !!threadId, // Kör bara om threadId finns
    staleTime: 1000 * 60 * 5, // 5 minuter innan datan anses "stale"
    cacheTime: 1000 * 60 * 10, // Cache hålls i 10 minuter
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};

export default useThreadDetail;
