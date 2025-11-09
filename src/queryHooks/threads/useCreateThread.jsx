import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const createThread = async ({
  title,
  body,
  username,
  subject_id,
  accessToken,
}) => {
  if (!accessToken) throw new Error("No access token available");

  return apiFetch("/forum/threads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title,
      body,
      author: username,
      subject_id,
    }),
  });
};

const useCreateThread = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { accessToken, username } = authData || {};

  return useMutation({
    mutationFn: (newThread) =>
      createThread({ ...newThread, accessToken, username }),
    onSuccess: (data) => {
      console.log("Thread created successfully:", data);
      queryClient.invalidateQueries(["threads"]);
    },
    onError: (error) => {
      console.error("Failed to create thread:", error.message);
      throw error; // så frontend kan visa meddelande
    },
  });
};

export default useCreateThread;
