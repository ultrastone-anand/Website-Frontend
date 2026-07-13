import { Suspense, useEffect, useRef, useState } from "react";

const LazySection = ({
  children,
  minHeight = "600px",
  rootMargin = "300px",
  className = "",
}) => {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldRender(true);
        observer.disconnect();
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={sectionRef}
      style={{ minHeight }}
      className={className}
    >
      {shouldRender ? (
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              style={{ minHeight }}
            />
          }
        >
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

export default LazySection;