import {
  useCallback,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY =
  "ultrastones-accessibility-settings";

const defaultSettings = {
  contrast: "default",
  highlightLinks: false,

  textScale: 1,
  letterSpacing: 0,
  lineHeight: 1,

  pauseAnimations: false,
  hideImages: false,
  dyslexiaFriendly: false,
  largeCursor: false,

  textAlign: "default",

  saturation: 100,
  grayscale: false,
};

const getSavedSettings = () => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const saved = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!saved) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error(
      "Failed to read accessibility settings:",
      error
    );

    return defaultSettings;
  }
};

const pauseVideos = () => {
  const videos =
    document.querySelectorAll("video");

  videos.forEach((video) => {
    if (!video.paused) {
      video.dataset.a11yWasPlaying = "true";
    } else {
      video.dataset.a11yWasPlaying = "false";
    }

    video.pause();
  });
};

const resumeVideos = () => {
  const videos =
    document.querySelectorAll("video");

  videos.forEach((video) => {
    const shouldResume =
      video.dataset.a11yWasPlaying === "true";

    if (shouldResume) {
      video.play().catch(() => {
        /*
         * Some browsers block autoplay.
         * In that case the user can manually resume it.
         */
      });
    }

    delete video.dataset.a11yWasPlaying;
  });
};

const applySettings = (settings) => {
  const root = document.documentElement;

  /* Text size */
  root.style.setProperty(
    "--a11y-text-scale",
    String(settings.textScale)
  );

  /* Text spacing */
  root.style.setProperty(
    "--a11y-letter-spacing",
    `${settings.letterSpacing}px`
  );

  if (settings.letterSpacing > 0) {
    root.dataset.a11yTextSpacing = "true";
  } else {
    delete root.dataset.a11yTextSpacing;
  }

  /* Line height */
  root.style.setProperty(
    "--a11y-line-height",
    String(settings.lineHeight)
  );

  if (settings.lineHeight > 1) {
    root.dataset.a11yLineHeight = "true";
  } else {
    delete root.dataset.a11yLineHeight;
  }

  /* Contrast */
  if (
    settings.contrast &&
    settings.contrast !== "default"
  ) {
    root.dataset.a11yContrast =
      settings.contrast;
  } else {
    delete root.dataset.a11yContrast;
  }

  /* Highlight links */
  if (settings.highlightLinks) {
    root.dataset.a11yHighlightLinks =
      "true";
  } else {
    delete root.dataset.a11yHighlightLinks;
  }

  /* Readable font */
  if (settings.dyslexiaFriendly) {
    root.dataset.a11yReadableFont =
      "true";
  } else {
    delete root.dataset.a11yReadableFont;
  }

  /* Hide images */
  if (settings.hideImages) {
    root.dataset.a11yHideImages = "true";
  } else {
    delete root.dataset.a11yHideImages;
  }

  /* Large cursor */
  if (settings.largeCursor) {
    root.dataset.a11yLargeCursor = "true";
  } else {
    delete root.dataset.a11yLargeCursor;
  }

  /* Text alignment */
  if (
    settings.textAlign &&
    settings.textAlign !== "default"
  ) {
    root.dataset.a11yTextAlign =
      settings.textAlign;
  } else {
    delete root.dataset.a11yTextAlign;
  }

  /* Saturation */
  root.style.setProperty(
    "--a11y-saturation",
    `${settings.saturation}%`
  );

  /* Grayscale */
  root.style.setProperty(
    "--a11y-grayscale",
    settings.grayscale ? "100%" : "0%"
  );

  /* Pause animations and video */
  if (settings.pauseAnimations) {
    root.dataset.a11yPauseAnimations =
      "true";

    pauseVideos();
  } else {
    delete root.dataset.a11yPauseAnimations;

    resumeVideos();
  }
};

const useAccessibility = () => {
  const [settings, setSettings] = useState(
    getSavedSettings
  );

  useEffect(() => {
    applySettings(settings);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error(
        "Failed to save accessibility settings:",
        error
      );
    }
  }, [settings]);

  /*
   * Pause videos that are added later by React,
   * sliders or route changes.
   */
  useEffect(() => {
    if (!settings.pauseAnimations) {
      return undefined;
    }

    const observer = new MutationObserver(() => {
      pauseVideos();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [settings.pauseAnimations]);

  const updateSetting = useCallback(
    (key, value) => {
      setSettings((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const toggleSetting = useCallback(
    (key) => {
      setSettings((current) => ({
        ...current,
        [key]: !current[key],
      }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
  };
};

export default useAccessibility;