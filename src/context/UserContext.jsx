import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const UserProvider = ({ children }) => {
  const { setAuthData } = useAuth();

  const [userProfiles, setUserProfiles] = useState({});
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [profileVersion, setProfileVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch single user profile with retry & manual control
  const fetchUserProfile = useCallback(
    async (userId, token, retryCount = 0) => {
      if (retryCount > 3) {
        console.warn("Retry limit reached. Stopping further attempts.");
        setError("Too many failed attempts. Please try again later.");
        setLoading(false);
        return;
      }

      try {
        const csrfToken = getCookie("csrfToken");

        const response = await fetch(
          `http://localhost:5000/api/auth/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "CSRF-TOKEN": csrfToken,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            console.warn(`Rate limited. Retrying ${retryCount + 1} in 3s...`);
            setTimeout(() => {
              fetchUserProfile(userId, token, retryCount + 1);
            }, 3000);
            return;
          }
          const message = await response.text();
          throw new Error(`Failed: ${response.status} - ${message}`);
        }

        const data = await response.json();

        if (typeof setAuthData === "function") {
          setAuthData((prev) => ({
            ...prev,
            profile: data,
          }));
        } else {
          console.warn("setAuthData is not defined or not a function");
        }

        setUserProfiles((prev) => ({
          ...prev,
          [userId]: data,
        }));

        setError(null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    },
    [setAuthData]
  );

  // ✅ Fetch current user profile on mount or refresh
  const fetchCurrentUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const csrfToken = getCookie("csrfToken");

      const response = await fetch(`http://localhost:5000/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch current user profile");
      }

      const data = await response.json();
      setCurrentUserProfile(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching current user profile:", err);
      setError("Failed to fetch current user profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUserProfile();
  }, [profileVersion, fetchCurrentUserProfile]);

  const refreshCurrentUserProfile = () => {
    setProfileVersion((prev) => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        userProfiles,
        fetchUserProfile,
        currentUserProfile,
        refreshCurrentUserProfile,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
