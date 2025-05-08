import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Import the context
import { UserProvider } from "./context/UserContext"; // Import the context

import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate for redirection

import Forum from "./pages/Forum";
import AuthPage from "./pages/AuthPage.jsx";
import Settings from "./pages/settings/Settings.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import CreateThread from "./components/thread/CreateThread"; // Adjust the path accordingly
import ThreadList from "./components/thread/ThreadList"; // Adjust the path accordingly
import ThreadDetail from "./components/thread/ThreadDetail"; // Adjust the path accordingly
import UserProfile from "./pages/userprofile/UserProfile"; // Import the UserProfile component
import FriendList from "./pages/userprofile/FriendList"; // Import the UserProfile component

import EditProfile from "./pages/settings/EditProfile.jsx";
import CreateProfile from "./pages/settings/CreateProfile.jsx";
import HeaderNavbar from "./components/HeaderNavbar.jsx";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <HeaderNavbar />
        <Routes>
          {/* Redirect the root route to the login page */}
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Public routes */}
          {/*  <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} /> */}

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/friends/:id" element={<FriendList />} />
            <Route path="/forum" element={<Forum />} />
            {/* Ensure UserProfile is imported */}
            <Route path="/settings/:id" element={<Settings />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route
              path="/settings/edit-profile/:id"
              element={<EditProfile />}
            />
            <Route path="/threads" element={<ThreadList />} />
            <Route path="/threads/:threadId" element={<ThreadDetail />} />
            <Route path="/create-thread" element={<CreateThread />} />
          </Route>

          {/* Fallback for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
