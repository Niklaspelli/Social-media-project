import { useQuery } from "@tanstack/react-query";

const fetchThreadDetail = async (threadId) => {
  const response = await fetch(
    `http://localhost:5000/api/auth/threads/${threadId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch thread");
  }

  const data = await response.json();
  return data;
};

const useThreadDetail = (threadId) => {
  return useQuery({
    queryKey: ["threadDetail", threadId],
    queryFn: () => fetchThreadDetail(threadId),
    enabled: !!threadId, // only run when threadId is truthy
    staleTime: 1000 * 60,
    retry: 1,
  });
};

export default useThreadDetail;
