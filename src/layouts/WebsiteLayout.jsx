import { Suspense } from "react";
import { createPortal } from "react-dom";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";

const WebsiteLayout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <>
      {createPortal(<Navbar />, document.body)}

      <div className="min-h-screen flex flex-col">
        <main
          className={`flex-1 ${
            isHomePage ? "" : "pt-[89px]"
          }`}
        >
          <Suspense
            fallback={
              <div className="min-h-[calc(100vh-89px)] flex items-center justify-center">
                <Loading />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WebsiteLayout;