import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { PersonStanding } from "lucide-react";

import useAccessibility from "./useAccessibility";

/* =========================================================
   LAZY LOADED ACCESSIBILITY PANEL

   The panel is downloaded only when opened.
========================================================= */

const AccessibilityPanel = lazy(() =>
  import("./AccessibilityPanel")
);

/* =========================================================
   ACCESSIBILITY MENU CONTROLLER
========================================================= */

const AccessibilityMenu = () => {
  const {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);

  /* =========================================================
     OPEN / CLOSE
  ========================================================= */

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);

    window.setTimeout(() => {
      triggerRef.current?.focus({
        preventScroll: true,
      });
    }, 0);
  }, []);

  /* =========================================================
     KEYBOARD SHORTCUTS

     Ctrl/Cmd + U = Toggle accessibility menu
     Escape = Close menu
  ========================================================= */

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "u";

      if (isShortcut) {
        event.preventDefault();

        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }

        return;
      }

      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeMenu();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, [isOpen, openMenu, closeMenu]);

  /* =========================================================
     PREVENT BACKGROUND SCROLL
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* Floating accessibility button */}

      <button
        ref={triggerRef}
        type="button"
        className="
          group fixed bottom-5 left-5 z-[9998]
          flex h-14 w-14 items-center justify-center
          rounded-full
          border border-white/80
          bg-[#e42733]
          text-white
          shadow-[0_10px_28px_rgba(0,0,0,0.18)]
          transition-all duration-300 ease-out
          hover:-translate-y-1
          hover:bg-[#c91f2b]
          hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)]
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#e42733]/25
          active:translate-y-0
          sm:bottom-6 sm:left-6
        "
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        aria-controls={
          isOpen ? "accessibility-menu" : undefined
        }
        onClick={openMenu}
      >
        <span
          className="
            absolute inset-[5px]
            rounded-full
            border border-white/20
            transition-colors duration-300
            group-hover:border-white/35
          "
          aria-hidden="true"
        />

        <PersonStanding
          size={25}
          strokeWidth={1.8}
          className="
            relative z-10
            transition-transform duration-300
            group-hover:scale-105
          "
          aria-hidden="true"
        />
      </button>

      {/* Lazy-loaded accessibility panel */}

      {isOpen && (
        <Suspense fallback={null}>
          <AccessibilityPanel
            settings={settings}
            updateSetting={updateSetting}
            toggleSetting={toggleSetting}
            resetSettings={resetSettings}
            closeMenu={closeMenu}
          />
        </Suspense>
      )}
    </>
  );
};

export default AccessibilityMenu;