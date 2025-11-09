import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";
import { useAuth, getCsrfToken } from "../../context/AuthContext";

const postResponse = async ({ threadId, responseText, accessToken }) => {
  if (!accessToken) throw new Error("No access token available");

  const csrfToken = await getCsrfToken();
  if (!csrfToken) throw new Error("CSRF token not ready");

  return apiFetch(`/forum/threads/${threadId}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({ body: responseText }),
  });
};

export default function usePostResponse(threadId) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ responseText }) =>
      postResponse({ threadId, responseText, accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries(["threadDetail", threadId]);
      console.log("✅ Response posted successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to post response:", error.message);
    },
  });
}
