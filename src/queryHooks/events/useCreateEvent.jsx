import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const createEvent = async ({
  title,
  description,
  datetime,
  location,
  event_image,
  ...eventData
}) => {
  return apiFetch("/events/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  return useMutation({
    mutationFn: (newEvent) => createEvent(newEvent),
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
