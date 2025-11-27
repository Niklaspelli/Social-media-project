import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const updateEvent = async ({ id, ...eventData }) => {
  return apiFetch(`/events/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
};

const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (data, variables) => {
      console.log("✅ Event uppdaterat:", data);
      queryClient.invalidateQueries(["userEvents"]); // uppdaterar listan
    },
    onError: (error) => {
      console.error("❌ Misslyckades med att uppdatera event:", error?.message);
    },
  });
};

export default useUpdateEvent;
