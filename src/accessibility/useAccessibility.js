import {
  useCallback,
  useEffect,
  useState,
} from "react";

/* =========================================================
   CONFIGURATION
========================================================= */

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

/* =========================================================
   LOAD SAVED SETTINGS
========================================================= */

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

    const parsed = JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Failed to read accessibility settings:",
      error
    );

    return defaultSettings;
  }
};

/* =========================================================
   VIDEO STATE TRACKING

   WeakMap remembers whether a video was playing
   when accessibility pause was enabled.

   Repeated pause calls do not overwrite this state.
========================================================= */

const videoPlaybackState = new WeakMap();

const trackedVideos = new Set();

/* =========================================================
   PAUSE VIDEOS
========================================================= */

const pauseVideos = () => {
  const videos =
    document.querySelectorAll("video");

  videos.forEach((video) => {
    if (!videoPlaybackState.has(video)) {
      videoPlaybackState.set(
        video,
        !video.paused
      );
    }

    trackedVideos.add(video);

    if (!video.paused) {
      video.pause();
    }
  });
};

/* =========================================================
   RESUME PREVIOUSLY PLAYING VIDEOS
========================================================= */

const resumeVideos = () => {
  trackedVideos.forEach((video) => {
    const shouldResume =
      videoPlaybackState.get(video) === true;

    if (
      shouldResume &&
      video.isConnected
    ) {
      video.play().catch(() => {
        /*
         * Browsers may block autoplay.
         */
      });
    }

    videoPlaybackState.delete(video);
  });

  trackedVideos.clear();
};

/* =========================================================
   APPLY VISUAL SETTINGS
========================================================= */

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
};

/* =========================================================
   ACCESSIBILITY HOOK
========================================================= */

const useAccessibility = () => {
  const [settings, setSettings] = useState(
    getSavedSettings
  );

  /* =========================================================
     APPLY SETTINGS + SAVE PREFERENCES
  ========================================================= */

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

  /* =========================================================
     PAUSE / RESUME VIDEOS

     Runs only when pauseAnimations changes.
  ========================================================= */

  useEffect(() => {
    const root = document.documentElement;

    if (!settings.pauseAnimations) {
      delete root.dataset.a11yPauseAnimations;

      resumeVideos();

      return undefined;
    }

    root.dataset.a11yPauseAnimations =
      "true";

    pauseVideos();

    /* =====================================================
       WATCH FOR VIDEOS ADDED LATER
    ===================================================== */

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

  /* =========================================================
     UPDATE SINGLE SETTING
  ========================================================= */

  const updateSetting = useCallback(
    (key, value) => {
      setSettings((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  /* =========================================================
     TOGGLE BOOLEAN SETTING
  ========================================================= */

  const toggleSetting = useCallback(
    (key) => {
      setSettings((current) => ({
        ...current,
        [key]: !current[key],
      }));
    },
    []
  );

  /* =========================================================
     RESET SETTINGS
  ========================================================= */

  const resetSettings = useCallback(() => {
    setSettings({
      ...defaultSettings,
    });
  }, []);

  return {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
  };
};

export default useAccessibility;