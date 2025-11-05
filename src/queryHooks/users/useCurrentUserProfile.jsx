import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const fetchCurrentUserProfile = async (accessToken, csrfToken) => {
  const res = await fetch("http://localhost:5000/api/users/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
    credentials: "include",
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    const message = await res.text();
    console.error("Fetch failed:", message);
    throw new Error(`Failed to fetch profile: ${res.status} ${message}`);
  }

  const data = await res.json();
  console.log("Fetched profile data:", data);
  return data;
};

export const useCurrentUserProfile = () => {
  const { authData, csrfToken } = useAuth();

  const accessToken = authData?.accessToken;
  const userId = authData?.userId;

  return useQuery({
    queryKey: ["currentUserProfile", userId],
    queryFn: () => fetchCurrentUserProfile(accessToken, csrfToken),
    enabled: !!accessToken && !!csrfToken && !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000),
    refetchOnWindowFocus: false,
  });
};
