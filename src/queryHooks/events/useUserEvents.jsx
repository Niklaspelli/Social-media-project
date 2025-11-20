import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const fetchUserEvents = async () => {
  return apiFetch("/events/user-events");
};

export const useUserEvents = () => {
  const { authData } = useAuth();
  const token = authData?.accessToken;

  return useQuery({
    queryKey: ["userEvents"],
    queryFn: fetchUserEvents,
    enabled: !!token,
  });
};
