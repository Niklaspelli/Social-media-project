import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const fetchUserProfile = async (userId, accessToken, csrfToken) => {
  const res = await fetch(
    `http://localhost:5000/api/userprofile/users/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Failed to fetch user profile: ${res.status} ${message}`);
  }

  return res.json();
};

export const useUserProfile = (userId) => {
  const { authData, csrfToken } = useAuth();
  const accessToken = authData?.accessToken;

  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId, accessToken, csrfToken),
    enabled: !!userId && !!accessToken && !!csrfToken,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000),
    refetchOnWindowFocus: false,
  });
};
