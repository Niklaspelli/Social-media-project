import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const deleteResponse = async ({ responseId, accessToken }) => {
  if (!accessToken) throw new Error("No access token available");

  return apiFetch(`/forum/responses/${responseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default function useDeleteResponse(threadId) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ responseId }) => deleteResponse({ responseId, accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries(["threadDetail", threadId]);
      console.log("✅ Response deleted successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to delete response:", error.message);
    },
  });
}
