import { useMutation } from "@tanstack/react-query";

const postResponse = async ({
  threadId,
  responseText,
  accessToken,
  csrfToken,
}) => {
  const response = await fetch(
    `http://localhost:5000/api/forum/threads/${threadId}/responses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ body: responseText }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to post response");
  }

  return response.json();
};

const usePostResponse = () => {
  return useMutation({
    mutationFn: postResponse,
    onError: (error) => {
      console.error("Error posting response:", error.message);
    },
    onSuccess: () => {
      // Här kan du invalidiera cache eller göra någon annan uppdatering om det behövs
    },
  });
};

export default usePostResponse;
