import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Forum from "./pages/Forum";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ThreadList from "./components/thread/ThreadList";
import ThreadDetail from "./components/thread/ThreadDetail";
import NotFound from "./pages/NotFound"; // Create a NotFound component
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> {/* Signup route */}
          {/* Protected routes start here */}
          <Route element={<ProtectedRoute />}>
            <Route path="/forum" element={<Forum />} />
            <Route path="/threads/:threadId" element={<ThreadDetail />} />
            <Route path="/profile/:id" element={<Profile />} /> {/* Pass id */}
          </Route>
          {/* Catch-all route for 404 NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
