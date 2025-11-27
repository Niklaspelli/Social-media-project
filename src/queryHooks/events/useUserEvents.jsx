import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const fetchUserEvents = async () => {
  return apiFetch("/events/user");
};

export const useUserEvents = () => {
  const { authData } = useAuth();
  const token = authData?.accessToken;

  return useQuery({
    queryKey: ["userEvents"],
    queryFn: fetchUserEvents,
    enabled: !!token,
    retry: 0, // ingen retry
    refetchOnWindowFocus: false, // ingen refetch vid flikbyte
    refetchOnReconnect: false, // ingen refetch vid reconnect
    refetchInterval: false,
  });
};
