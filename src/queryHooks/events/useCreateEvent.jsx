/* // hooks/useCreateEvent.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const createEvent = async ({
  title,
  description,
  datetime,
  location,
  accessToken,
  csrfToken,
  event_image,
  ...eventData
}) => {
  const response = await fetch(`http://localhost:5000/api/events/events`, {
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
      event_image,
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
 */

// hooks/useCreateEvent.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, getCsrfToken } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const createEvent = async (
  { title, description, datetime, location, event_image, ...eventData },
  accessToken
) => {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) throw new Error("CSRF token not ready");

  return apiFetch("/events/events", {
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
