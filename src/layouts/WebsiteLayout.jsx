import { createPortal } from "react-dom";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const WebsiteLayout = () => {
  const location = useLocation();

  const isHomePage =
    location.pathname === "/";

  return (
    <>
      {createPortal(
        <Navbar />,
        document.body
      )}

      <div className="min-h-screen flex flex-col">
        <main
          className={`flex-1 ${
            isHomePage ? "" : "pt-[49px]"
          }`}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WebsiteLayout;