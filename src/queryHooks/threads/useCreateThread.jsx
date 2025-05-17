// hooks/useCreateThread.js
import { useMutation } from "@tanstack/react-query";

// Funktion för att skapa tråd
const createThread = async (newThread) => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const { title, body, username, accessToken, subject_id } = newThread;
  const csrfToken = getCookie("csrfToken"); // Du kan ha getCookie-funktionen här också

  const response = await fetch(`http://localhost:5000/api/auth/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "CSRF-TOKEN": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      title: title,
      body: body,
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

// Custom hook för att hantera mutation
const useCreateThread = () => {
  return useMutation({
    mutationFn: createThread,
    onSuccess: (data) => {
      console.log("Thread created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create thread:", error.message);
    },
  });
};

export default useCreateThread;
