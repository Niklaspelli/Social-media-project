import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Import the context
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Forum from "./pages/Forum";
import Home from "./pages/Home";
import Settings from "./pages/profile/Settings.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import CreateThread from "./components/thread/CreateThread"; // Adjust the path accordingly
import ThreadList from "./components/thread/ThreadList"; // Adjust the path accordingly
import ThreadDetail from "./components/thread/ThreadDetail";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/forum" element={<Forum />} />
          <Route path="/settings/:id" element={<Settings />} />
          <Route path="/threads" element={<ThreadList />} />
          <Route path="/threads/:threadId" element={<ThreadDetail />} />
          <Route path="/create-thread" element={<CreateThread />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
