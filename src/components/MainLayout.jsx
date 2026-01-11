import { Outlet } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

const MainLayout = () => {
  return (
    <>
      <HeaderNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
