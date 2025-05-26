/* import { useAuth } from "../context/AuthContext";

export const useApiFetch = () => {
  const { authData } = useAuth();

  const apiFetch = async (url, options = {}) => {
    if (!authData.accessToken || !authData.csrfToken) {
      throw new Error("Missing auth tokens");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.accessToken}`,
      "csrf-token": authData.csrfToken,
      ...options.headers,
    };

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} - ${text}`);
    }

    return res.json();
  };

  return apiFetch;
};
 */
