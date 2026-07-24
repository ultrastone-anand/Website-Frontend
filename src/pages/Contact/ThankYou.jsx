import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function ThankYou() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setCountdown((previousCountdown) => {
        if (previousCountdown <= 1) {
          window.clearInterval(countdownTimer);
          return 0;
        }

        return previousCountdown - 1;
      });
    }, 1000);

    const redirectTimer = window.setTimeout(() => {
      navigate("/", {
        replace: true,
      });
    }, 5000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <>
      <main className="flex min-h-screen items-center justify-center  px-6 pb-20 pt-[130px]">
        <section className="w-full max-w-[760px] text-center">
          <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#0c5562]">
            <Check
              size={36}
              strokeWidth={1.8}
              className="text-white"
              aria-hidden="true"
            />
          </div>

          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#c91f26]">
            Enquiry Received
          </p>

          <h1
            className="mt-4 text-[36px] font-semibold leading-tight text-[#161412] md:text-[48px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Thank You for Contacting Us
          </h1>

          <div className="mx-auto mt-6 h-[4px] w-[70px] bg-[#c91f26]" />

          <p className="mx-auto mt-8 max-w-[590px] text-[14px] leading-7 text-[#666]">
            Your enquiry has been submitted successfully. A member of the
            Ultra Stones team will review your message and get back to you as
            soon as possible.
          </p>

          <p
            className="mt-6 text-[13px] text-[#777]"
            aria-live="polite"
          >
            You will be redirected to the homepage in{" "}
            <span className="font-semibold text-[#161412]">
              {countdown}
            </span>{" "}
            {countdown === 1 ? "second" : "seconds"}.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex min-h-[42px] items-center justify-center bg-[#0c5562] px-7 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#08414b]"
            >
              Return Home
            </Link>

            <Link
              to="/categories"
              className="inline-flex min-h-[42px] items-center justify-center border border-[#161412] px-7 py-3 text-[11px] uppercase tracking-[0.16em] text-[#161412] transition-colors hover:bg-[#161412] hover:text-white"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}