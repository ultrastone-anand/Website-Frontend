import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center  px-6 pb-20 pt-[130px]">
        <section className="w-full max-w-[850px] text-center">
          <p className="text-[110px] font-semibold leading-none text-[#c91f26] sm:text-[150px] md:text-[190px]">
            404
          </p>

          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#0c5562]">
            Page Not Found
          </p>

          <h1
            className="mt-5 text-[32px] font-semibold leading-tight text-[#161412] md:text-[46px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            We Couldn&apos;t Find That Page
          </h1>

          <div className="mx-auto mt-6 h-[4px] w-[70px] bg-[#c91f26]" />

          <p className="mx-auto mt-7 max-w-[580px] text-[14px] leading-7 text-[#666]">
            The page you are looking for may have been moved, renamed, or is
            temporarily unavailable. Please check the URL or return to the
            homepage.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#0c5562] px-7 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#08414b]"
            >
              <Home size={15} />

              Return Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#161412] px-7 py-3 text-[11px] uppercase tracking-[0.16em] text-[#161412] transition-colors hover:bg-[#161412] hover:text-white"
            >
              <ArrowLeft size={15} />

              Go Back
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}