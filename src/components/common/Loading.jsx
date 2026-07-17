// src/components/common/Loading.jsx

import { useEffect, useState } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    let currentProgress = 0;

    const updateProgress = () => {
      /*
       * Progress slows down as it gets closer to 99.
       * This keeps the loader visually active until the
       * actual page/component finishes loading.
       */
      const remaining = 99 - currentProgress;
      const increment = Math.max(0.08, remaining * 0.018);

      currentProgress = Math.min(
        currentProgress + increment,
        99,
      );

      setProgress(Math.floor(currentProgress));

      if (currentProgress < 99) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    const startDelay = window.setTimeout(() => {
      animationFrame = requestAnimationFrame(updateProgress);
    }, 150);

    return () => {
      window.clearTimeout(startDelay);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const progressValue = Math.min(progress, 100);
  const formattedProgress = String(progressValue).padStart(2, "0");

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        min-h-screen
        w-full
        overflow-hidden
        bg-white
        text-[#171513]
      "
      role="status"
      aria-live="polite"
      aria-label={`Loading ${progressValue}%`}
    >
      {/* TOP INFORMATION */}

      <div
        className="
          absolute
          left-0
          top-0
          z-20
          flex
          w-full
          items-start
          justify-between
          px-5
          pt-5
          sm:px-8
          sm:pt-7
          lg:px-12
          lg:pt-9
        "
      >
        <div className="flex items-center gap-3">
          <span
            className="
              block
              h-2
              w-2
              rounded-full
              bg-[#c91f26]
              loader-status-dot
            "
          />

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-[#171513]/60
              sm:text-[11px]
            "
          >
            Natural &amp; Engineered Surfaces
          </p>
        </div>

        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-[#171513]/60
            sm:text-[11px]
          "
        >
          Since 2013
        </p>
      </div>

      {/* MAIN TYPOGRAPHY */}

      <div
        className="
          relative
          flex
          h-full
          min-h-screen
          w-full
          items-center
          justify-center
          px-3
          sm:px-5
          lg:px-8
        "
      >
        <div className="relative w-full select-none">
          {/* BASE TEXT */}

<h1
  className="
    m-0
    w-full
    text-center
    text-[15.5vw]
    font-bold
    uppercase
    leading-[0.78]
    tracking-[-0.05em]
    text-[#d8d4cd]
    sm:text-[14.5vw]
    lg:text-[13.4vw]
  "
  style={{
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 700,
  }}
>
  <span className="block">Ultra</span>
  <span className="block">Stones</span>
</h1>

          {/* RED PROGRESS-FILLED TEXT */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
              transition-[clip-path]
              duration-300
              ease-out
            "
            style={{
              clipPath: `inset(${100 - progressValue}% 0 0 0)`,
            }}
            aria-hidden="true"
          >
<h1
  className="
    m-0
    w-full
    text-center
    text-[15.5vw]
    font-bold
    uppercase
    leading-[0.78]
    tracking-[-0.05em]
    text-[#c91f26]
    sm:text-[14.5vw]
    lg:text-[13.4vw]
  "
  style={{
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 700,
  }}
>
  <span className="block">Ultra</span>
  <span className="block">Stones</span>
</h1>
          </div>
        </div>
      </div>

      {/* BOTTOM PROGRESS AREA */}

      <div
        className="
          absolute
          bottom-0
          left-0
          z-20
          w-full
          px-5
          pb-5
          sm:px-8
          sm:pb-7
          lg:px-12
          lg:pb-9
        "
      >
        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            sm:mb-5
          "
        >
          <p
            className="
              max-w-[170px]
              text-[10px]
              font-medium
              uppercase
              leading-[1.5]
              tracking-[0.2em]
              text-[#171513]/55
              sm:max-w-none
              sm:text-[11px]
            "
          >
            Preparing the collection
          </p>

          <div className="flex items-start">
            <span
              className="
                text-[42px]
                font-medium
                leading-none
                tracking-[-0.07em]
                text-[#171513]
                sm:text-[52px]
                lg:text-[64px]
              "
            >
              {formattedProgress}
            </span>

            <span
              className="
                ml-1
                mt-1
                text-[12px]
                font-semibold
                text-[#c91f26]
                sm:text-[14px]
              "
            >
              %
            </span>
          </div>
        </div>

        {/* TRACK */}

        <div
          className="
            relative
            h-px
            w-full
            overflow-hidden
            bg-[#171513]/15
          "
        >
          <div
            className="
              absolute
              inset-y-0
              left-0
              bg-[#c91f26]
              transition-[width]
              duration-300
              ease-out
            "
            style={{
              width: `${progressValue}%`,
            }}
          />

          <span
            className="
              absolute
              top-1/2
              h-[7px]
              w-[7px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#c91f26]
              transition-[left]
              duration-300
              ease-out
            "
            style={{
              left: `${progressValue}%`,
            }}
          />
        </div>
      </div>

      <style>
        {`
          .loader-title {
            font-family:
              "Montserrat",
              "Helvetica Neue",
              Arial,
              sans-serif;
          }

          .loader-status-dot {
            animation: loader-status-pulse 1.4s ease-in-out infinite;
          }

          @keyframes loader-status-pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }

            50% {
              opacity: 0.35;
              transform: scale(0.7);
            }
          }

          @media (max-width: 640px) {
            .loader-title {
              font-size: 23vw;
              line-height: 0.79;
              letter-spacing: -0.09em;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .loader-status-dot {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;