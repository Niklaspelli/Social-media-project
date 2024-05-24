/*  import "./App.css";
import { useState } from "react";

function App() {
  const [validationMessage, setValidationMessage] = useState("");
  const validateMessage = async () => {
    setTimeout(() => {
      setValidationMessage(`Invalid referral code, <script></script>`);
    }, 1000);
  };
  return (
    <div className="App">
      <input placeholder="Enter your referral code" />
      <button onClick={validateMessage}>Submit</button>
      <div>{validationMessage}</div>
    </div>
  );
}

export default App; */

/* import "./App.css";
import DOMPurify from "dompurify";

function App() {
  const blog = `
   <h3>This is a blog title </h3>
   <p>This is some blog text. There could be <b>bold</b> elements as well as <i>italic</i> elements here! <p>
   `;

  const sanitizedBlog = DOMPurify.sanitize(blog);

  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{ __html: sanitizedBlog }}></div>
    </div>
  );
}

export default App; */
/* 

/* 
Here's how you can prevent XSS in your application:

Validate all data that flows into your application from the server or a third-party API.
 This cushions your application against an XSS attack, and at times, you may be able to prevent it, as well.

Don't mutate DOM directly. If you need to render different content, use innerText instead of innerHTML. 
Be extremely cautious when using escape hatches like findDOMNode or createRef in React.

Always try to render data through JSX and let React handle the security concerns for you.

Use dangerouslySetInnerHTML in only specific use cases. When using it,
 make sure you're sanitizing all your data before rendering it on the DOM.

Avoid writing your own sanitization techniques.
 It's a separate subject on its own that requires some expertise.

Use good libraries for sanitizing your data. There are a number of them,
 but you must compare the pros and cons of each specific to your use case before going forward with one.

You can use the above points as a coding guideline when building React applications. */

//############################################################################################################

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SignIn from "./SignIn";
import UserProfile from "./UserProfile";
import Navbar from "./Navbar";
import Home from "./Home";
import Test from "./Test";
import Blog from "./Blog";
import Cors from "./Cors";
import SignUp from "./SignUp";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/Cors" element={<Cors />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/blog" element={<Blog />} />
            <Route path="/userprofile" element={<UserProfile />} />
            {/* handle other routes */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
