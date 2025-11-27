import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const deleteEventApi = async ({ eventId, accessToken }) => {
  if (!accessToken) throw new Error("No access token available");

  // apiFetch lägger automatiskt till CSRF-token
  const res = await apiFetch(`/events/user/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return eventId; // Returnera så vi kan uppdatera cachen
};

export default function useDeleteEvent(userId) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: ({ eventId }) => deleteEventApi({ eventId, accessToken }),
    onSuccess: (deletedEventId) => {
      console.log("🗑️ Event deleted via React Query hook");

      queryClient.setQueryData(["events", userId], (oldData) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.filter((p) => p.id !== deletedEventId);
      });
    },
    onError: (error) => {
      console.error(
        "❌ Failed to delete event via React Query hook:",
        error.message
      );
    },
  });
}
