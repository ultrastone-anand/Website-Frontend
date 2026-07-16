import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;

const AUTO_SCROLL_SPEED = 0.55;
const CARD_GAP = 40;
const RESUME_DELAY = 2500;

const OurCollectionSection = () => {
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const animationFrameRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const previousTimeRef = useRef(null);

  const pointerStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const pointerDownRef = useRef(false);

  const [materials, setMaterials] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] = useState(false);

  useEffect(() => {
    const fetchMaterials =
      async () => {
        try {
          const response =
            await axios.get(
              `${API_URL}/stones`
            );

          const result =
            response.data;

          if (result.success) {
            const activeCategories =
              (result.data || [])
                .filter(
                  (item) =>
                    item.is_active ===
                      true &&
                    item.parent_id ===
                      null
                )
                .sort((a, b) => {
                  const orderA =
                    a.display_order ??
                    999;

                  const orderB =
                    b.display_order ??
                    999;

                  if (
                    orderA !== orderB
                  ) {
                    return (
                      orderA - orderB
                    );
                  }

                  return a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                      sensitivity:
                        "base",
                    }
                  );
                });

            setMaterials(
              activeCategories
            );
          }
        } catch (error) {
          console.error(
            "Error fetching materials:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchMaterials();
  }, []);

  const carouselItems = useMemo(
    () => [
      ...materials,
      ...materials,
    ],
    [materials]
  );

  const getFirstSetWidth =
    useCallback(() => {
      const container =
        scrollRef.current;

      if (
        !container ||
        materials.length === 0
      ) {
        return 0;
      }

      const cards =
        container.querySelectorAll(
          "[data-category-card]"
        );

      if (
        cards.length <
        materials.length
      ) {
        return 0;
      }

      let totalWidth = 0;

      for (
        let index = 0;
        index < materials.length;
        index += 1
      ) {
        totalWidth +=
          cards[
            index
          ].getBoundingClientRect()
            .width;
      }

      totalWidth +=
        CARD_GAP *
        Math.max(
          materials.length - 1,
          0
        );

      return totalWidth;
    }, [materials.length]);

  const updateScrollControls =
    useCallback(() => {
      const container =
        scrollRef.current;

      if (!container) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      const maxScrollLeft =
        container.scrollWidth -
        container.clientWidth;

      setCanScrollLeft(
        container.scrollLeft > 3
      );

      setCanScrollRight(
        maxScrollLeft > 3
      );
    }, []);

  const normalizeLoopPosition =
    useCallback(() => {
      const container =
        scrollRef.current;

      if (!container) {
        return;
      }

      const firstSetWidth =
        getFirstSetWidth();

      if (firstSetWidth <= 0) {
        return;
      }

      if (
        container.scrollLeft >=
        firstSetWidth
      ) {
        container.scrollLeft -=
          firstSetWidth;
      }

      if (
        container.scrollLeft < 0
      ) {
        container.scrollLeft +=
          firstSetWidth;
      }
    }, [getFirstSetWidth]);

  const pauseAndResume =
    useCallback(
      (
        delay =
          RESUME_DELAY
      ) => {
        setIsPaused(true);

        if (
          resumeTimeoutRef.current
        ) {
          window.clearTimeout(
            resumeTimeoutRef.current
          );
        }

        resumeTimeoutRef.current =
          window.setTimeout(() => {
            setIsPaused(false);
          }, delay);
      },
      []
    );

  const getScrollAmount =
    useCallback(() => {
      const container =
        scrollRef.current;

      if (!container) {
        return 340;
      }

      const firstCard =
        container.querySelector(
          "[data-category-card]"
        );

      if (!firstCard) {
        return 340;
      }

      return (
        firstCard.getBoundingClientRect()
          .width + CARD_GAP
      );
    }, []);

  const scrollCategories =
    useCallback(
      (direction) => {
        const container =
          scrollRef.current;

        if (!container) {
          return;
        }

        const amount =
          getScrollAmount();

        const firstSetWidth =
          getFirstSetWidth();

        if (firstSetWidth <= 0) {
          return;
        }

        if (
          direction === "left" &&
          container.scrollLeft <= 3
        ) {
          container.scrollLeft =
            firstSetWidth;
        }

        container.scrollBy({
          left:
            direction === "left"
              ? -amount
              : amount,
          behavior: "smooth",
        });

        pauseAndResume();
      },
      [
        getFirstSetWidth,
        getScrollAmount,
        pauseAndResume,
      ]
    );

  useEffect(() => {
    const container =
      scrollRef.current;

    if (
      !container ||
      loading ||
      materials.length < 2
    ) {
      return undefined;
    }

    const animate = (time) => {
      if (
        previousTimeRef.current ===
        null
      ) {
        previousTimeRef.current =
          time;
      }

      const elapsed =
        time -
        previousTimeRef.current;

      previousTimeRef.current =
        time;

      if (
        !isPaused &&
        !isDragging &&
        !pointerDownRef.current
      ) {
        container.scrollLeft +=
          AUTO_SCROLL_SPEED *
          (elapsed / 16.67);

        normalizeLoopPosition();
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          animate
        );
    };

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationFrameRef.current
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      previousTimeRef.current = null;
    };
  }, [
    loading,
    materials.length,
    isPaused,
    isDragging,
    normalizeLoopPosition,
  ]);

  useEffect(() => {
    const container =
      scrollRef.current;

    if (!container) {
      return undefined;
    }

    const handleScroll = () => {
      normalizeLoopPosition();
      updateScrollControls();
    };

    const resizeObserver =
      new ResizeObserver(() => {
        updateScrollControls();
      });

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    resizeObserver.observe(container);

    updateScrollControls();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );

      resizeObserver.disconnect();
    };
  }, [
    normalizeLoopPosition,
    updateScrollControls,
  ]);

  useEffect(
    () => () => {
      if (
        animationFrameRef.current
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (
        resumeTimeoutRef.current
      ) {
        window.clearTimeout(
          resumeTimeoutRef.current
        );
      }
    },
    []
  );

  const handlePointerDown = (
    event
  ) => {
    const container =
      scrollRef.current;

    if (!container) {
      return;
    }

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    pointerDownRef.current = true;
    hasDraggedRef.current = false;

    pointerStartXRef.current =
      event.clientX;

    scrollStartLeftRef.current =
      container.scrollLeft;

    setIsDragging(true);
    setIsPaused(true);

    if (
      event.pointerType === "mouse"
    ) {
      container.setPointerCapture?.(
        event.pointerId
      );
    }
  };

  const handlePointerMove = (
    event
  ) => {
    const container =
      scrollRef.current;

    if (
      !container ||
      !pointerDownRef.current
    ) {
      return;
    }

    const distance =
      event.clientX -
      pointerStartXRef.current;

    if (
      Math.abs(distance) > 5
    ) {
      hasDraggedRef.current = true;
    }

    if (
      event.pointerType === "mouse"
    ) {
      container.scrollLeft =
        scrollStartLeftRef.current -
        distance;

      normalizeLoopPosition();
    }
  };

  const handlePointerEnd = (
    event
  ) => {
    const container =
      scrollRef.current;

    pointerDownRef.current = false;
    setIsDragging(false);

    if (
      container &&
      event.pointerType === "mouse" &&
      container.hasPointerCapture?.(
        event.pointerId
      )
    ) {
      container.releasePointerCapture(
        event.pointerId
      );
    }

    normalizeLoopPosition();
    pauseAndResume();

    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  const handleCardClick = (
    event,
    slug
  ) => {
    if (hasDraggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    navigate(
      `/product-category/${slug}`
    );
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      pauseAndResume(1000);
    }
  };

  const handleWheel = () => {
    pauseAndResume();
  };

  return (
    <section className="overflow-hidden bg-white py-[110px]">
      <div className="mx-auto max-w-[1850px] px-6 xl:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div>
            <p
              className="flex items-center gap-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              OUR COLLECTION

              <span className="text-[32px] font-normal text-[#D67A1C]">
                →
              </span>
            </p>

            <h2
              className="mt-4 text-[45px] leading-[1.05] text-[#111]"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              curated by nature.
              <br />
              chosen for you.
            </h2>
          </div>

          <div className="max-w-[420px] lg:self-center">
            <p
              className="text-[16px] leading-[1.5] text-[#555]"
              style={{
                fontFamily:
                  "Inter, sans-serif",
              }}
            >
              Explore our exclusive
              range of natural and
              engineered stones, each
              piece a masterpiece.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/categories"
                )
              }
              className="mt-4 border border-[#777] px-10 py-3 text-[12px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              DISCOVER MORE

              <span className="ml-3 text-[#FF8000]">
                →
              </span>
            </button>
          </div>
        </div>

        <div className="mt-[40px]">


          {loading ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse"
                >
                  <div className="aspect-[4/5] bg-gray-200" />

                  <div className="mx-auto mt-6 h-5 w-24 bg-gray-200" />

                  <div className="mx-auto mt-3 h-4 w-36 bg-gray-100" />
                </div>
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div
              ref={scrollRef}
              role="region"
              aria-label="Stone collections carousel"
              tabIndex={0}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerEnd
              }
              onPointerCancel={
                handlePointerEnd
              }
              onMouseEnter={
                handleMouseEnter
              }
              onMouseLeave={
                handleMouseLeave
              }
              onWheel={handleWheel}
              className={`
                w-full
                min-w-0
                overflow-x-auto
                overflow-y-hidden
                overscroll-x-contain
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                ${
                  isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                }
              `}
              style={{
                WebkitOverflowScrolling:
                  "touch",
                touchAction:
                  "pan-x pan-y",
              }}
            >
              <div className="flex w-max gap-10 pb-3">
                {carouselItems.map(
                  (item, index) => (
                    <button
                      data-category-card
                      key={`${item.id}-${index}`}
                      type="button"
                      draggable="false"
                      onClick={(event) =>
                        handleCardClick(
                          event,
                          item.slug
                        )
                      }
                      className="
                        group
                        w-[300px]
                        shrink-0
                        select-none
                        text-center
                        sm:w-[340px]
                        lg:w-[390px]
                      "
                    >
                      <div className="overflow-hidden bg-gray-100">
                        <img
                          src={getOptimizedImageUrl(
                            item.thumbnail_url,
                            600,
                            72
                          )}
                          srcSet={`
                            ${getOptimizedImageUrl(item.thumbnail_url, 360, 68)} 360w,
                            ${getOptimizedImageUrl(item.thumbnail_url, 480, 70)} 480w,
                            ${getOptimizedImageUrl(item.thumbnail_url, 600, 72)} 600w,
                            ${getOptimizedImageUrl(item.thumbnail_url, 800, 74)} 800w
                          `}
                          sizes="(max-width: 639px) 300px, (max-width: 1023px) 340px, 390px"
                          width="600"
                          height="750"
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          draggable="false"
                          className="
                            pointer-events-none
                            aspect-[4/5]
                            w-full
                            select-none
                            object-cover
                            transition
                            duration-700
                            group-hover:scale-105
                          "
                        />
                      </div>

                      <h3
                        className="mt-6 text-[20px] font-semibold uppercase tracking-[0.03em] text-[#111]"
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        className="mt-2 text-[15px] text-[#666]"
                        style={{
                          fontFamily:
                            "Inter, sans-serif",
                        }}
                      >
                        {item.description ||
                          `${item.name} collection`}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[480px] items-center justify-center bg-[#fafafa] text-[16px] text-[#666]">
              No collections found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurCollectionSection;