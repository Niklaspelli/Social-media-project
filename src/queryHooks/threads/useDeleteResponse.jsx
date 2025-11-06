import { useMutation } from "@tanstack/react-query";

const deleteResponse = async ({ responseId, accessToken }) => {
  const response = await fetch(
    `http://localhost:5000/api/forum/response/${responseId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete response");
  }

  return response.json(); // eller bara response om du inte behöver data tillbaka
};

export default function useDeleteResponse() {
  return useMutation({
    mutationFn: deleteResponse,
    onSuccess: () => {
      console.log("Response deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete response:", error);
    },
  });
}
