// src/components/common/LazySection.jsx

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

/* =========================================================
   LAZY SECTION

   Features:
   - IntersectionObserver based loading
   - Delayed component mounting
   - React Suspense support
   - Layout stability
   - Browser compatibility fallback
   - Permanent mounting after activation
========================================================= */

const LazySection = ({
  children,
  minHeight = "600px",
  rootMargin = "200px",
  className = "",
}) => {
  const sectionRef = useRef(null);

  const [shouldRender, setShouldRender] =
    useState(false);

  /* =======================================================
     INTERSECTION OBSERVER
  ======================================================= */

  useEffect(() => {
    // Already activated.
    // No need to create another observer.
    if (shouldRender) {
      return undefined;
    }

    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldRender(true);

        observer.disconnect();
      },
      {
        root: null,

        rootMargin,

        threshold: 0,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [
    rootMargin,
    shouldRender,
  ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        minHeight,
      }}
    >
      {shouldRender && (
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              style={{
                minHeight,
                width: "100%",
              }}
            />
          }
        >
          {children}
        </Suspense>
      )}
    </div>
  );
};

export default LazySection;