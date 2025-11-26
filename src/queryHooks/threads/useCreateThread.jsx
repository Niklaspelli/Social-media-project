import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";

const createThread = async ({ title, body, subject_id }) => {
  return apiFetch("/threads/create-thread", {
    method: "POST",
    body: JSON.stringify({ title, body, subject_id }),
  });
};

const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThread,
    retry: 0,
    onSuccess: (data) => {
      console.log("Thread created successfully:", data);
      queryClient.invalidateQueries(["threads"]); // eller ["threads", subject_id] om du vill ha per ämne
    },
    onError: (error) => {
      console.error("Failed to create thread:", error.message);
      throw error; // så frontend kan visa meddelande
    },
  });
};

export default useCreateThread;
