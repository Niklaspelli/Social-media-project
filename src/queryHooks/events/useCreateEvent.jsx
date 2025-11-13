import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const createEvent = async (
  { title, description, datetime, location, event_image, ...eventData },
  accessToken
) => {
  return apiFetch("/events/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      description,
      datetime,
      location,
      event_image,
      ...eventData,
    }),
  });
};

const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: (newEvent) => createEvent(newEvent, accessToken),
    onSuccess: (data) => {
      console.log("✅ Event skapades:", data);
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      console.error("❌ Misslyckades med att skapa event:", error.message);
    },
  });
};

export default useCreateEvent;
