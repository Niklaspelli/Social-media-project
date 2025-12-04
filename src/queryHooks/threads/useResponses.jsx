import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const fetchResponses = async ({ threadId, offset, limit }) => {
  if (!threadId) throw new Error("Thread ID is required");
  const res = await apiFetch(
    `/responses/${threadId}?offset=${offset}&limit=${limit}`
  );
  return res.responses || []; // säkerställ att det alltid returnerar array
};

const useResponses = ({ threadId, initialLimit = 5 }) => {
  const [offset, setOffset] = useState(0);
  const [responses, setResponses] = useState([]);

  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["responses", threadId, offset],
    queryFn: () => fetchResponses({ threadId, offset, limit: initialLimit }),
    enabled: !!threadId,
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000,
  });

  // Uppdatera responses när data ändras
  useEffect(() => {
    if (!data.length) return;

    setResponses((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const newResponses = data.filter((r) => !existingIds.has(r.id));
      const updated = offset === 0 ? data : [...prev, ...newResponses];
      return JSON.stringify(prev) === JSON.stringify(updated) ? prev : updated;
    });
  }, [data, offset]);

  const loadMore = () => setOffset((prev) => prev + initialLimit);

  const hasMore = data.length === initialLimit;

  return { responses, loadMore, hasMore, isLoading, isFetching };
};

export default useResponses;
