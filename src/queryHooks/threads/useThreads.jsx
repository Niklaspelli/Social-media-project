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

const fetchThreads = async (
  page = 1,
  limit = 10,
  sort = "desc",
  subjectId = null
) => {
  let url = `http://localhost:5000/api/forum/threads?page=${page}&limit=${limit}&sort=${sort}`;
  if (subjectId) {
    url += `&subject_id=${subjectId}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch threads");
  return res.json();
};

const useThreads = (page, limit, sort, subjectId) =>
  useQuery({
    queryKey: ["threads", page, limit, sort, subjectId],
    queryFn: () => fetchThreads(page, limit, sort, subjectId),
    keepPreviousData: true,
  });

export default useThreads;
