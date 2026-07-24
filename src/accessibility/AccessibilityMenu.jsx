import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    CaseSensitive,
    Contrast,
    EyeOff,
    Focus,
    ImageOff,
    Link,
    MousePointer2,
    Pause,
    PersonStanding,
    RefreshCcw,
    Space,
    TextCursorInput,
    Type,
    X,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import useAccessibility from "./useAccessibility";

const AccessibilityMenu = () => {
    const {
        settings,
        updateSetting,
        toggleSetting,
        resetSettings,
    } = useAccessibility();

    const [isOpen, setIsOpen] = useState(false);

    const panelRef = useRef(null);
    const triggerRef = useRef(null);

    const closeMenu = useCallback(() => {
        setIsOpen(false);

        window.setTimeout(() => {
            triggerRef.current?.focus({
                preventScroll: true,
            });
        }, 0);
    }, []);

    /*
     * Text size:
     * 100% → 110% → 120% → 130%
     */
    const cycleTextScale = () => {
        const values = [1, 1.1, 1.2, 1.3];

        const currentIndex = values.indexOf(
            settings.textScale
        );

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % values.length;

        updateSetting(
            "textScale",
            values[nextIndex]
        );
    };

    /*
     * Contrast:
     * Default → High contrast → Default
     *
     * Dark and light modes were removed because
     * they unnecessarily replace the website theme.
     */
    const toggleHighContrast = () => {
        updateSetting(
            "contrast",
            settings.contrast === "high"
                ? "default"
                : "high"
        );
    };

    /*
     * Text spacing:
     * Default → Comfortable → Wide
     */
    const cycleLetterSpacing = () => {
        const values = [0, 1, 2];

        const currentIndex = values.indexOf(
            settings.letterSpacing
        );

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % values.length;

        updateSetting(
            "letterSpacing",
            values[nextIndex]
        );
    };

    /*
     * Line height:
     * Default → Comfortable → Spacious
     */
    const cycleLineHeight = () => {
        const values = [1, 1.5, 1.8];

        const currentIndex = values.indexOf(
            settings.lineHeight
        );

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % values.length;

        updateSetting(
            "lineHeight",
            values[nextIndex]
        );
    };

    /*
     * Alignment:
     * Default → Left → Center → Right
     */
    const cycleTextAlign = () => {
        const values = [
            "default",
            "left",
            "center",
            "right",
        ];

        const currentIndex = values.indexOf(
            settings.textAlign
        );

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % values.length;

        updateSetting(
            "textAlign",
            values[nextIndex]
        );
    };

    /*
     * Saturation:
     * Normal → Low → High → Normal
     */
    const cycleSaturation = () => {
        const values = [100, 50, 150];

        const currentIndex = values.indexOf(
            settings.saturation
        );

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % values.length;

        updateSetting(
            "saturation",
            values[nextIndex]
        );
    };

    const getTextScaleLabel = () => {
        if (settings.textScale === 1) {
            return "Default";
        }

        return `${Math.round(
            settings.textScale * 100
        )}%`;
    };

    const getSpacingLabel = () => {
        if (settings.letterSpacing === 1) {
            return "Comfortable";
        }

        if (settings.letterSpacing === 2) {
            return "Wide";
        }

        return "Default";
    };

    const getLineHeightLabel = () => {
        if (settings.lineHeight === 1.5) {
            return "Comfortable";
        }

        if (settings.lineHeight === 1.8) {
            return "Spacious";
        }

        return "Default";
    };

    const getSaturationLabel = () => {
        if (settings.saturation === 50) {
            return "Low";
        }

        if (settings.saturation === 150) {
            return "High";
        }

        return "Normal";
    };

    const getAlignmentIcon = () => {
        if (settings.textAlign === "center") {
            return AlignCenter;
        }

        if (settings.textAlign === "right") {
            return AlignRight;
        }

        return AlignLeft;
    };

    const AlignmentIcon = getAlignmentIcon();

    /*
     * Ctrl/Cmd + U opens or closes the panel.
     * Escape closes it.
     */
    useEffect(() => {
        const handleKeyboardShortcut = (event) => {
            const isShortcut =
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "u";

            if (isShortcut) {
                event.preventDefault();

                setIsOpen((current) => !current);
            }

            if (
                event.key === "Escape" &&
                isOpen
            ) {
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
    }, [closeMenu, isOpen]);

    /*
     * Prevent the page from scrolling while
     * the accessibility panel is open.
     */
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

    /*
     * Keyboard focus trap.
     */
useEffect(() => {
  if (!isOpen) {
    return undefined;
  }

  const panel = panelRef.current;

  if (!panel) {
    return undefined;
  }

  const selector = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const focusableElements =
    panel.querySelectorAll(selector);

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  firstElement?.focus({
    preventScroll: true,
  });

  const handleFocusTrap = (event) => {
    if (event.key !== "Tab") {
      return;
    }

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();

      lastElement?.focus({
        preventScroll: true,
      });

      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();

      firstElement?.focus({
        preventScroll: true,
      });
    }
  };

  panel.addEventListener(
    "keydown",
    handleFocusTrap
  );

  return () => {
    panel.removeEventListener(
      "keydown",
      handleFocusTrap
    );
  };
}, [isOpen]);
    const sectionHeadingClasses =
        "mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500";

    const listClasses =
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)]";

    const optionBaseClasses =
        "group relative flex min-h-[72px] w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors duration-200 last:border-b-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e42733]";

    const optionInactiveClasses =
        "bg-white text-neutral-900 hover:bg-neutral-50";

    const optionActiveClasses =
        "bg-red-50 text-[#bd1823]";

    const iconBaseClasses =
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200";

    const iconInactiveClasses =
        "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200";

    const iconActiveClasses =
        "bg-[#e42733] text-white";

    const renderOption = ({
        label,
        description,
        value,
        active,
        icon: Icon,
        onClick,
        ariaPressed,
    }) => (
        <button
            type="button"
            className={`${optionBaseClasses} ${active
                ? optionActiveClasses
                : optionInactiveClasses
                }`}
            onClick={onClick}
            aria-pressed={ariaPressed}
        >
            <span
                className={`${iconBaseClasses} ${active
                    ? iconActiveClasses
                    : iconInactiveClasses
                    }`}
                aria-hidden="true"
            >
                <Icon size={20} strokeWidth={1.9} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-5">
                    {label}
                </span>

                {description && (
                    <span className="mt-0.5 block text-xs leading-4 text-neutral-500">
                        {description}
                    </span>
                )}
            </span>

            <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${active
                    ? "bg-white text-[#bd1823] shadow-sm"
                    : "bg-neutral-100 text-neutral-500"
                    }`}
            >
                {value}
            </span>
        </button>
    );

    return (
        <>
            {/* Floating trigger */}
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
  aria-controls="accessibility-menu"
  onClick={() => setIsOpen(true)}
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
    className="relative z-10 transition-transform duration-300 group-hover:scale-105"
    aria-hidden="true"
  />
</button>

            {isOpen && (
                <>
                    {/* Page overlay */}
                    <button
                        type="button"
                        className="fixed inset-0 z-[9998] cursor-default border-0 bg-black/55 backdrop-blur-[3px]"
                        aria-label="Close accessibility menu"
                        onClick={closeMenu}
                    />

                    {/* Accessibility panel */}
                    <aside
                        ref={panelRef}
                        id="accessibility-menu"
                        className="fixed inset-y-0 left-0 z-[9999] flex w-full max-w-[440px] flex-col overflow-hidden bg-[#f7f7f8] text-neutral-900 shadow-[24px_0_70px_rgba(0,0,0,0.3)] sm:bottom-4 sm:left-4 sm:top-4 sm:h-auto sm:rounded-[26px] sm:border sm:border-white/70"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="a11y-menu-title"
                    >
                        {/* Header */}
                        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#ef3541] via-[#e42733] to-[#b91722] px-5 py-6 text-white sm:px-6">
                            <div
                                className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full border-[24px] border-white/10"
                                aria-hidden="true"
                            />

                            <div
                                className="pointer-events-none absolute -bottom-20 right-12 h-36 w-36 rounded-full bg-white/5"
                                aria-hidden="true"
                            />

                            <div className="relative z-10 flex items-start justify-between gap-5">
                                <div className="min-w-0">
                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
                                        <PersonStanding
                                            size={23}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                                        Ultra Stones
                                    </p>

                                    <h2
                                        id="a11y-menu-title"
                                        className="text-2xl font-bold tracking-[-0.025em] text-white"
                                    >
                                        Accessibility
                                    </h2>

                                    <p className="mt-1 max-w-[285px] text-sm leading-5 text-white/80">
                                        Adjust the website to suit your
                                        browsing preferences.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:rotate-3 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    aria-label="Close accessibility menu"
                                    onClick={closeMenu}
                                >
                                    <X
                                        size={23}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </header>

                        {/* Scrollable options */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-color:#c7c7c7_transparent] [scrollbar-width:thin] sm:px-5">
                            {/* Vision */}
                            <section
                                className="mb-6"
                                aria-labelledby="a11y-vision-heading"
                            >
                                <h3
                                    id="a11y-vision-heading"
                                    className={sectionHeadingClasses}
                                >
                                    Vision
                                </h3>

                                <div className={listClasses}>
                                    {renderOption({
                                        label: "Text Size",
                                        description:
                                            "Increase text across the website",
                                        value: getTextScaleLabel(),
                                        active: settings.textScale > 1,
                                        icon: Type,
                                        onClick: cycleTextScale,
                                    })}

                                    {renderOption({
                                        label: "High Contrast",
                                        description:
                                            "Improve separation between colors",
                                        value:
                                            settings.contrast === "high"
                                                ? "On"
                                                : "Off",
                                        active:
                                            settings.contrast === "high",
                                        icon: Contrast,
                                        onClick: toggleHighContrast,
                                        ariaPressed:
                                            settings.contrast === "high",
                                    })}

                                    {renderOption({
                                        label: "Grayscale",
                                        description:
                                            "Remove color from website content",
                                        value: settings.grayscale
                                            ? "On"
                                            : "Off",
                                        active: settings.grayscale,
                                        icon: Contrast,
                                        onClick: () =>
                                            toggleSetting("grayscale"),
                                        ariaPressed: settings.grayscale,
                                    })}

                                    {renderOption({
                                        label: "Color Saturation",
                                        description:
                                            "Reduce or increase color intensity",
                                        value: getSaturationLabel(),
                                        active:
                                            settings.saturation !== 100,
                                        icon: Focus,
                                        onClick: cycleSaturation,
                                    })}

                                    {renderOption({
                                        label: "Highlight Links",
                                        description:
                                            "Make clickable links easier to identify",
                                        value: settings.highlightLinks
                                            ? "On"
                                            : "Off",
                                        active: settings.highlightLinks,
                                        icon: Link,
                                        onClick: () =>
                                            toggleSetting(
                                                "highlightLinks"
                                            ),
                                        ariaPressed:
                                            settings.highlightLinks,
                                    })}
                                </div>
                            </section>

                            {/* Reading */}
                            <section
                                className="mb-6"
                                aria-labelledby="a11y-reading-heading"
                            >
                                <h3
                                    id="a11y-reading-heading"
                                    className={sectionHeadingClasses}
                                >
                                    Reading
                                </h3>

                                <div className={listClasses}>
                                    {renderOption({
                                        label: "Readable Font",
                                        description:
                                            "Use a simple, easy-to-read typeface",
                                        value:
                                            settings.dyslexiaFriendly
                                                ? "On"
                                                : "Off",
                                        active:
                                            settings.dyslexiaFriendly,
                                        icon: CaseSensitive,
                                        onClick: () =>
                                            toggleSetting(
                                                "dyslexiaFriendly"
                                            ),
                                        ariaPressed:
                                            settings.dyslexiaFriendly,
                                    })}

                                    {renderOption({
                                        label: "Text Spacing",
                                        description:
                                            "Increase spacing between characters",
                                        value: getSpacingLabel(),
                                        active:
                                            settings.letterSpacing > 0,
                                        icon: Space,
                                        onClick: cycleLetterSpacing,
                                    })}

                                    {renderOption({
                                        label: "Line Height",
                                        description:
                                            "Increase space between text lines",
                                        value: getLineHeightLabel(),
                                        active:
                                            settings.lineHeight > 1,
                                        icon: TextCursorInput,
                                        onClick: cycleLineHeight,
                                    })}

                                    {renderOption({
                                        label: "Text Alignment",
                                        description:
                                            "Change page text alignment",
                                        value:
                                            settings.textAlign ===
                                                "default"
                                                ? "Default"
                                                : settings.textAlign,
                                        active:
                                            settings.textAlign !==
                                            "default",
                                        icon: AlignmentIcon,
                                        onClick: cycleTextAlign,
                                    })}
                                </div>
                            </section>

                            {/* Motion and navigation */}
                            <section
                                className="mb-2"
                                aria-labelledby="a11y-motion-heading"
                            >
                                <h3
                                    id="a11y-motion-heading"
                                    className={sectionHeadingClasses}
                                >
                                    Motion & Navigation
                                </h3>

                                <div className={listClasses}>
                                    {renderOption({
                                        label: "Stop Animations",
                                        description:
                                            "Pause motion and autoplay videos",
                                        value:
                                            settings.pauseAnimations
                                                ? "On"
                                                : "Off",
                                        active:
                                            settings.pauseAnimations,
                                        icon: Pause,
                                        onClick: () =>
                                            toggleSetting(
                                                "pauseAnimations"
                                            ),
                                        ariaPressed:
                                            settings.pauseAnimations,
                                    })}

                                    {renderOption({
                                        label: "Large Cursor",
                                        description:
                                            "Use a larger, easier-to-see pointer",
                                        value: settings.largeCursor
                                            ? "On"
                                            : "Off",
                                        active: settings.largeCursor,
                                        icon: MousePointer2,
                                        onClick: () =>
                                            toggleSetting("largeCursor"),
                                        ariaPressed:
                                            settings.largeCursor,
                                    })}

                                    {renderOption({
                                        label: "Hide Images",
                                        description:
                                            "Hide non-essential visual content",
                                        value: settings.hideImages
                                            ? "On"
                                            : "Off",
                                        active: settings.hideImages,
                                        icon: settings.hideImages
                                            ? EyeOff
                                            : ImageOff,
                                        onClick: () =>
                                            toggleSetting("hideImages"),
                                        ariaPressed:
                                            settings.hideImages,
                                    })}
                                </div>
                            </section>

                            {/* Reset */}
                            <button
                                type="button"
                                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#e42733] hover:shadow-red-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 active:translate-y-0"
                                onClick={resetSettings}
                            >
                                <RefreshCcw
                                    size={17}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                Reset accessibility settings
                            </button>

                            <p className="mt-4 text-center text-[11px] leading-5 text-neutral-500">
                                Keyboard shortcut:
                                <kbd className="mx-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-700 shadow-sm">
                                    Ctrl
                                </kbd>
                                +
                                <kbd className="mx-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-700 shadow-sm">
                                    U
                                </kbd>
                                or
                                <kbd className="mx-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-700 shadow-sm">
                                    Cmd
                                </kbd>
                                +
                                <kbd className="ml-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-700 shadow-sm">
                                    U
                                </kbd>
                            </p>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
};

export default AccessibilityMenu;