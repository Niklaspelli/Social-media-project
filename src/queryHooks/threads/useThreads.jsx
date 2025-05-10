import { useQuery } from "@tanstack/react-query";

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

export default useThreads;
