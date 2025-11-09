import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
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

export default function useDeleteResponse() {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ responseId }) => deleteResponse({ responseId, accessToken }),
    onSuccess: () => {
      console.log("Response deleted successfully");
      // Invalidate or refetch relevant queries
      queryClient.invalidateQueries(["threadDetail"]);
    },
    onError: (error) => {
      console.error("Failed to delete response:", error.message);
      throw error; // så frontend kan visa felmeddelande
    },
  });
}
