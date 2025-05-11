import { useMutation, useQueryClient } from "@tanstack/react-query";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const postFeed = async ({ content, accessToken }) => {
  const csrfToken = getCookie("csrfToken");

  const res = await fetch("http://localhost:5000/api/auth/feed-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "CSRF-TOKEN": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to post");

  return data;
};

export default function useCreateFeedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postFeed,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["feedPosts"]);
      console.log("✅ Post created successfully from query hook");
    },
  });
}
