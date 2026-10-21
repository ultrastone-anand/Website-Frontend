// src/layouts/WebsiteLayout.jsx

import {
  lazy,
} from "react";

import { createPortal } from "react-dom";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import LazySection from "../components/common/LazySection";

/* =========================================================
   LAZY LOADED FOOTER
========================================================= */

const Footer = lazy(() =>
  import("../components/common/Footer")
);

/* =========================================================
   WEBSITE LAYOUT
========================================================= */

const WebsiteLayout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* =================================================
          NAVBAR

          Keep immediately available.
      ================================================= */}

      {createPortal(
        <Navbar />,
        document.body
      )}

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <div className="min-h-screen flex flex-col">

        <main
          className={`flex-1 ${
            isHomePage ? "" : "pt-[49px]"
          }`}
        >
          <Outlet />
        </main>

        {/* =================================================
            FOOTER

            Load when approaching the viewport.
        ================================================= */}

        <LazySection
          minHeight="350px"
          rootMargin="300px"
        >
          <Footer />
        </LazySection>

      </div>
    </>
  );
};

export default WebsiteLayout;