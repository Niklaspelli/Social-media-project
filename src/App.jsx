import { AuthProvider } from "./context/AuthContext"; // Import the context

import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate for redirection
import { useAuth } from "./context/AuthContext";

import AuthPage from "./pages/AuthPage.jsx";
import Settings from "./pages/settings/Settings.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import UserProfile from "./pages/userprofile/UserProfile"; // Import the UserProfile component
import FriendList from "./pages/userprofile/FriendList"; // Import the UserProfile component
import EditProfile from "./pages/settings/EditProfile.jsx";
import CreateProfile from "./pages/settings/CreateProfile.jsx";
import HeaderNavbar from "./components/HeaderNavbar.jsx";
import AllFeed from "./pages/userprofile/feed/AllFeed.jsx";
import Notifications from "./pages/Notifications.jsx";
import EventDetails from "./pages/events/event-details.jsx";
import CreateEvent from "./pages/events/create-event.jsx";
import EventView from "./pages/events/event-view.jsx";
import EventUpdate from "./pages/events/event-update.jsx";
import AccountDeleted from "./pages/settings/AccountDeleted.jsx";
import RegistrationSuccess from "./pages/RegistrationSuccess.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CreateThread from "./pages/forum/thread/CreateThread.jsx";
import ThreadDetail from "./pages/forum/thread/ThreadDetail.jsx";
import SubjectPage from "./pages/forum/thread/SubjectPage.jsx";
import ForumLandingPage from "./pages/forum/Forum-Landing-Page.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import MainLayout from "./components/MainLayout.jsx";
import NavigateToProfile from "./components/NavigateToProfile.jsx";

function App() {
  const { authData } = useAuth();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<NavigateToProfile />} />
        <Route path="/auth" element={<AuthPage />} />{" "}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/feed/:id" element={<AllFeed />} />
            <Route path="/notifications/:id" element={<Notifications />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/friends/:id" element={<FriendList />} />
            <Route
              path="/events/event-details/:id"
              element={<EventDetails />}
            />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/update/:id" element={<EventUpdate />} />
            <Route path="/events/:id" element={<EventView />} />
            <Route path="/forum" element={<ForumLandingPage />}>
              <Route path="subject/:subjectId" element={<SubjectPage />} />
            </Route>{" "}
            <Route
              path="/subjects/:subjectId/create"
              element={<CreateThread />}
            />
            <Route path="/threads/:threadId" element={<ThreadDetail />} />
            {/* Ensure UserProfile is imported */}
            <Route path="/settings/:id" element={<Settings />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route
              path="/settings/edit-profile/:id"
              element={<EditProfile />}
            />
          </Route>
        </Route>
        <Route path="/deleted" element={<AccountDeleted />} />
        <Route path="/auth/success" element={<RegistrationSuccess />} />
        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
