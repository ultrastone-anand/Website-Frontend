import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import Footer from "../../../components/common/Footer";
import Navbar from "../../../components/common/Navbar";
import { Link } from "react-router-dom";

const VIDEOS_PER_PAGE = 12;

const videos = Array.from(
  { length: 24 },
  (_, index) => ({
    id: index + 1,
    url: "https://youtu.be/SkSrX2rM8jk?si=a8qYTS9uXORktods",
  })
);

const getYoutubeId = (url) => {
  try {
    const shortMatch =
      url.match(/youtu\.be\/([^?]+)/);

    if (shortMatch) {
      return shortMatch[1];
    }

    const normalMatch =
      url.match(/[?&]v=([^&]+)/);

    if (normalMatch) {
      return normalMatch[1];
    }

    return "";
  } catch {
    return "";
  }
};

const getEmbedUrl = (url) => {
  const id = getYoutubeId(url);

  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
};

export const Videos = () => {
  const sectionRef = useRef(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedVideo, setSelectedVideo] =
    useState(null);

  const totalPages = Math.ceil(
    videos.length / VIDEOS_PER_PAGE
  );

  const currentVideos = useMemo(() => {
    const start =
      (currentPage - 1) *
      VIDEOS_PER_PAGE;

    return videos.slice(
      start,
      start + VIDEOS_PER_PAGE
    );
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <>
      <Navbar />

      <div className=" min-h-screen pt-[110px]">
        {/* Header */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Videos
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                Videos
              </span>
            </p>

            <p className="mt-5 text-[#555] text-[14px]">
              Showing all {videos.length} results
            </p>
          </div>
        </section>

        {/* Videos */}
        <section
          className="py-14"
          ref={sectionRef}
        >
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >
              {currentVideos.map(
                (video) => {
                  const youtubeId =
                    getYoutubeId(
                      video.url
                    );

                  const thumbnail =
                    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

                  return (
                    <div
                      key={video.id}
                      onClick={() =>
                        setSelectedVideo(
                          video.url
                        )
                      }
                      className="
                        group
                        cursor-pointer
                        overflow-hidden
                        rounded
                        bg-[#e5e5e5]
                      "
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={thumbnail}
                          alt="Video Thumbnail"
                          className="
                            w-full
                            h-full
                            object-cover
                            duration-500
                            group-hover:scale-105
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-black/20
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <div
                            className="
                              w-16
                              h-16
                              rounded-full
                              bg-white/90
                              flex
                              items-center
                              justify-center
                              shadow-lg
                            "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-7 h-7"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.max(
                        currentPage - 1,
                        1
                      )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="
                    text-sm
                    hover:text-[#c91f26]
                    disabled:opacity-40
                    duration-300
                  "
                >
                  Prev
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                    className={`
                      w-8
                      h-8
                      rounded
                      text-sm
                      duration-300
                      ${
                        currentPage ===
                        page
                          ? "bg-black text-white"
                          : "hover:text-[#c91f26]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        currentPage + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="
                    text-sm
                    hover:text-[#c91f26]
                    disabled:opacity-40
                    duration-300
                  "
                >
                  Next Page
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/80
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() =>
            setSelectedVideo(null)
          }
        >
          <div
            className="
              relative
              w-full
              max-w-6xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              onClick={() =>
                setSelectedVideo(null)
              }
              className="
                absolute
                -top-12
                right-0
                text-white
                text-5xl
                leading-none
              "
            >
              ×
            </button>

            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={getEmbedUrl(
                  selectedVideo
                )}
                title="YouTube Video"
                allow="
                  autoplay;
                  encrypted-media;
                  picture-in-picture
                "
                allowFullScreen
                className="
                  w-full
                  h-full
                "
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Videos;