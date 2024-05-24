import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fakeAuth from "./auth/fakeAuth";

const UserProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(fakeAuth.isAuthenticated);
  });

  return (
    <>
      <h2>Du är inne i userProfilen</h2>
      <p>Ser du det här, då är du inne innanför protectedroute</p>
      <li>
        <Link to="/Blog"> Blog {isAuthenticated ? "" : "🔒"}</Link>
      </li>
    </>
  );
};

export default UserProfile;
