import { AuthProvider } from "./context/AuthContext"; // Import the context

import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate for redirection

import AuthPage from "./pages/AuthPage.jsx";
import Settings from "./pages/settings/Settings.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import CreateThread from "./components/thread/CreateThread"; // Adjust the path accordingly
import ThreadDetail from "./components/thread/ThreadDetail"; // Adjust the path accordingly
import UserProfile from "./pages/userprofile/UserProfile"; // Import the UserProfile component
import FriendList from "./pages/userprofile/FriendList"; // Import the UserProfile component
import EditProfile from "./pages/settings/EditProfile.jsx";
import CreateProfile from "./pages/settings/CreateProfile.jsx";
import HeaderNavbar from "./components/HeaderNavbar.jsx";
import AllFeed from "./pages/userprofile/feed/AllFeed.jsx";
import SubjectPage from "./components/thread/SubjectPage.jsx";
import Notifications from "./pages/Notifications.jsx";
import EventDetails from "./pages/events/event-details.jsx";
import CreateEvent from "./pages/events/create-event.jsx";
import EventList from "./pages/events/event-list.jsx";

function App() {
  return (
    <AuthProvider>
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
          <Route path="/feed/:id" element={<AllFeed />} />
          <Route path="/notifications/:id" element={<Notifications />} />

          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/friends/:id" element={<FriendList />} />
          <Route path="/events/event-details/:id" element={<EventDetails />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventList />} />

          <Route path="/forum/subject/:id" element={<SubjectPage />} />

          {/* Ensure UserProfile is imported */}
          <Route path="/settings/:id" element={<Settings />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/settings/edit-profile/:id" element={<EditProfile />} />
          <Route path="/threads/:threadId" element={<ThreadDetail />} />
          <Route
            path="/subjects/:subjectId/create"
            element={<CreateThread />}
          />
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
