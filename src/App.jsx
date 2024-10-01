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
          <Route path="/signup" element={<SignUp />} />{" "}
          {/* Changed case to lowercase */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ThreadList />} />
            <Route path="/threads/:threadId" element={<ThreadDetail />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more protected routes here if needed */}
          </Route>
          <Route path="*" element={<NotFound />} />{" "}
          {/* Catch-all for 404 pages */}
        </Routes>
      </div>
    </>
  );
}

export default App;
