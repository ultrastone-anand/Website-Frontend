import axios from "axios";
import { useEffect, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PiLayout } from "react-icons/pi";

const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/ultrastones/";

const InstagramSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        setHasError(false);

        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/instagram/posts`
        );

        const result = response.data;

        if (!isMounted) {
          return;
        }

        if (result.success) {
          setPosts((result.data || []).slice(0, 4));
        } else {
          setPosts([]);
          setHasError(true);
        }
      } catch (error) {
        console.error(
          "Error fetching Instagram posts:",
          error
        );

        if (isMounted) {
          setPosts([]);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInstagramPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const getPostImage = (post) =>
    post.imageUrl ||
    post.thumbnailUrl ||
    post.mediaUrl ||
    "";

  const getAccessibleCaption = (caption) => {
    if (!caption) {
      return "View Ultra Stones Instagram post";
    }

    return caption.length > 120
      ? `${caption.slice(0, 120)}...`
      : caption;
  };

  /*
   * Do not show an empty or broken section when the
   * Instagram API is temporarily unavailable.
   */
  if (!loading && (hasError || posts.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-[72px]">
      <div className="mx-auto max-w-[1850px] px-5 md:px-6 xl:px-[52px]">
        {/* Heading */}

        <div className="mb-8 flex flex-col gap-5 md:mb-[44px] md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="mb-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#d97918]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Follow Our Journey
            </p>

            <h2
              className="flex items-center gap-4 text-[18px] font-bold uppercase tracking-[0.01em] text-[#111] md:gap-7 md:text-[18px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              LATEST FROM INSTAGRAM

              <span className="text-[24px] font-normal text-[#FF8000] md:text-[28px]">
                →
              </span>
            </h2>
          </div>

          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 border border-[#111] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] transition duration-300 hover:bg-[#111] hover:text-white"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <BsInstagram size={18} />

            Follow @ultrastones

            <FaExternalLinkAlt
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Instagram posts */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {loading
            ? Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse bg-gray-200"
                />
              ))
            : posts.map((post) => {
                const imageUrl = getPostImage(post);
                const isVideo =
                  post.mediaType === "VIDEO";

                return (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={getAccessibleCaption(
                      post.caption
                    )}
                    className="group relative block aspect-square overflow-hidden bg-[#f1f1f1]"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          post.caption ||
                          "Ultra Stones Instagram post"
                        }
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#ededed] text-[#888]">
                        <Instagram size={30} />
                      </div>
                    )}

                    {/* Permanent Instagram badge */}

                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center bg-black/55 text-white backdrop-blur-sm md:left-4 md:top-4">
                      <BsInstagram size={18} />
                    </div>

                    {/* Video indicator */}

                    {isVideo && (
                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-black/55 text-white backdrop-blur-sm md:right-4 md:top-4">
                        <PiLayout
                          size={17}
                          fill="currentColor"
                        />
                      </div>
                    )}

                    {/* Hover overlay */}

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100">
                      <div className="w-full translate-y-4 p-4 text-white transition duration-500 group-hover:translate-y-0 md:p-6">
                        <p
                          className="line-clamp-3 text-[12px] leading-[1.6] md:text-[13px]"
                          style={{
                            fontFamily:
                              "Inter, sans-serif",
                          }}
                        >
                          {post.caption ||
                            "View this post on Instagram."}
                        </p>

                        <div
                          className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          View Post
                          <span className="text-[#FF8000]">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
        </div>

        {/* Mobile follow link */}

        {!loading && posts.length > 0 && (
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex items-center justify-center gap-3 border border-[#111] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] transition hover:bg-[#111] hover:text-white md:hidden"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <BsInstagram size={17} />
            Follow @ultrastones
          </a>
        )}
      </div>
    </section>
  );
};

export default InstagramSection;