// src/components/common/Loading.jsx

import React from "react";

const Loading = () => {
  return (
    <div
      className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-white
      overflow-hidden
      "
    >
      {/* BACKGROUND GLOW */}

      <div
        className="
        absolute
        w-[420px]
        h-[420px]
        rounded-full
        bg-[#c91f26]/10
        blur-3xl
        animate-pulse
        "
      />

      {/* CONTENT */}

      <div className="relative flex flex-col items-center">
        {/* LOGO WRAPPER */}

        <div className="relative">
          {/* ROTATING RING */}

          <div
            className="
            w-[120px]
            h-[120px]
            rounded-full
            border-[2px]
            border-[#e5e5e5]
            border-t-[#c91f26]
            animate-spin
            "
          />

          {/* INNER LOGO */}

          <div
            className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            "
          >
            <img
              src="/favicon.png"
              alt="Ultra Stones"
              className="
              w-[58px]
              h-[58px]
              object-contain
              animate-pulse
              "
            />
          </div>
        </div>

        {/* TEXT */}

        <h2
          className="
          mt-8
          text-[22px]
          md:text-[26px]
          font-semibold
          tracking-[4px]
          uppercase
          text-[#161412]
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Ultra Stones
        </h2>

        {/* LOADING DOTS */}

        <div className="flex items-center gap-2 mt-5">
          <span className="w-2 h-2 rounded-full bg-[#c91f26] animate-bounce" />

          <span
            className="
            w-2
            h-2
            rounded-full
            bg-[#c91f26]
            animate-bounce
            "
            style={{
              animationDelay: "0.15s",
            }}
          />

          <span
            className="
            w-2
            h-2
            rounded-full
            bg-[#c91f26]
            animate-bounce
            "
            style={{
              animationDelay: "0.3s",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;