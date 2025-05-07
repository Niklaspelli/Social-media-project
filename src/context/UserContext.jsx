import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for user data
const UserContext = createContext();

// Custom hook to use the user context
export const useUsers = () => {
  return useContext(UserContext);
};

// UserProvider to wrap your app
export const UserProvider = ({ children }) => {
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch a user's profile
  const fetchUserProfile = async (userId, token) => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
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
          // Too many requests, let's wait a bit before retrying
          setTimeout(() => {
            fetchUserProfile(userId, token); // Retry after a timeout
          }, 3000); // Wait 3 seconds before retrying (you can adjust the time)
          return; // Don't proceed until after retry
        }
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();

      // Cache the fetched profile in the state (store by userId)
      setUserProfiles((prevState) => ({
        ...prevState,
        [userId]: data,
      }));
      console.log("Fetched user profile:", data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  /* 
  // Function to search for users based on a search term
  const searchUsers = (searchTerm) => {
    // Filter the userProfiles object based on the search term
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Object.values(userProfiles).filter((user) =>
      user.username.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  const fetchAllUsers = async (token) => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }

    try {
      const csrfToken = getCookie("csrfToken");

      const response = await fetch("http://localhost:5000/api/auth/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all users");
      }

      const users = await response.json();
      const usersById = {};
      users.forEach((user) => {
        usersById[user.id] = user;
      });

      setUserProfiles(usersById);
    } catch (err) {
      console.error("Error fetching all users:", err);
      setError("Could not fetch users.");
    }
  };
 */
  // Return the context provider with functions and state
  return (
    <UserContext.Provider
      value={{
        userProfiles,
        fetchUserProfile,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
