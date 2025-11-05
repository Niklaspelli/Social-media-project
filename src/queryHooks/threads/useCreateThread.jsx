// hooks/useCreateThread.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

// Function to create thread
const createThread = async ({
  title,
  body,
  username,
  accessToken,
  csrfToken,
  subject_id,
}) => {
  const response = await fetch(`http://localhost:5000/api/forum/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "csrf-token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      body,
      author: username,
      subject_id,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Title and content are required");
    }
    const errorMsg = await response.text();
    throw new Error(`Failed to create thread: ${errorMsg}`);
  }

  return await response.json(); // Return the created thread
};

const useCreateThread = () => {
  const queryClient = useQueryClient();
  const { authData, csrfToken } = useAuth();
  const { accessToken, username } = authData || {};

  return useMutation({
    mutationFn: (newThread) =>
      createThread({
        ...newThread,
        accessToken,
        csrfToken,
        username,
      }),
    onSuccess: (data) => {
      console.log("Thread created successfully:", data);
      // optionally invalidate or refetch thread lists here
      queryClient.invalidateQueries(["threads"]);
    },
    onError: (error) => {
      console.error("Failed to create thread:", error.message);
    },
  });
};

export default useCreateThread;
