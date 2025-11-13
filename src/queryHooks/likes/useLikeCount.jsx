import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export const useLikeCount = ({ responseId }) => {
  const { authData } = useAuth();
  const accessToken = authData?.accessToken;

  return useQuery({
    queryKey: ["likeCount", responseId],
    queryFn: async () => {
      if (!accessToken) throw new Error("Access token missing");
      return apiFetch(`/forum/responses/${responseId}/like`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
  });
};
