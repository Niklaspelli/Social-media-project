// hooks/useCreateEvent.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const createEvent = async ({
  title,
  description,
  datetime,
  location,
  accessToken,
  csrfToken,
  ...eventData
}) => {
  const response = await fetch(`http://localhost:5000/api/auth/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      description,
      datetime,
      location,
      ...eventData,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Title, datetime och location krävs");
    }
    const errorMsg = await response.text();
    throw new Error(`Misslyckades med att skapa event: ${errorMsg}`);
  }

  return await response.json();
};

const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken } = authData || {};

  return useMutation({
    mutationFn: (newEvent) =>
      createEvent({
        ...newEvent,
        accessToken,
        csrfToken,
      }),
    onSuccess: (data) => {
      console.log("Event skapades:", data);
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      console.error("Misslyckades med att skapa event:", error.message);
    },
  });
};

export default useCreateEvent;
