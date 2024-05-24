import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fakeAuth from "./auth/fakeAuth";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(fakeAuth.isAuthenticated);
  });

  const logout = () => {
    fakeAuth.signOut(() => {
      navigate("/");
    });
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/Test"}>Test</Link>
        </li>
        <li>
          <Link to={"/Cors"}>Cors</Link>
        </li>
        <li>
          {!fakeAuth.isAuthenticated ? (
            <Link to={"/login"}>Sign In</Link>
          ) : (
            <span onClick={logout}>Logout</span>
          )}
        </li>
        <li>
          <Link to="/userprofile">
            Userprofile {isAuthenticated ? "" : "🔒"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
