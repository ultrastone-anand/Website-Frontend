import { useEffect, useMemo, useState } from "react";

import AccessibilityContext from "./AccessibilityContext";
import { DEFAULT_ACCESSIBILITY_SETTINGS } from "./accessibilityConfig";

const STORAGE_KEY = "ultrastones-accessibility-settings";

const getStoredSettings = () => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }

    return {
      ...DEFAULT_ACCESSIBILITY_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch (error) {
    console.error(
      "Unable to load accessibility settings:",
      error
    );

    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
};

const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(getStoredSettings);

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const toggleSetting = (key) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: !currentSettings[key],
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  };

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.a11yContrast = settings.contrast;
    root.dataset.a11yHighlightLinks =
      String(settings.highlightLinks);
    root.dataset.a11yPauseAnimations =
      String(settings.pauseAnimations);
    root.dataset.a11yHideImages =
      String(settings.hideImages);
    root.dataset.a11yDyslexiaFriendly =
      String(settings.dyslexiaFriendly);
    root.dataset.a11yLargeCursor =
      String(settings.largeCursor);
    root.dataset.a11yTextAlign =
      settings.textAlign;
    root.dataset.a11yGrayscale =
      String(settings.grayscale);

    root.style.setProperty(
      "--a11y-text-scale",
      settings.textScale
    );

    root.style.setProperty(
      "--a11y-letter-spacing",
      `${settings.letterSpacing}px`
    );

    root.style.setProperty(
      "--a11y-line-height",
      settings.lineHeight
    );

    root.style.setProperty(
      "--a11y-saturation",
      `${settings.saturation}%`
    );

    return () => {
      delete root.dataset.a11yContrast;
      delete root.dataset.a11yHighlightLinks;
      delete root.dataset.a11yPauseAnimations;
      delete root.dataset.a11yHideImages;
      delete root.dataset.a11yDyslexiaFriendly;
      delete root.dataset.a11yLargeCursor;
      delete root.dataset.a11yTextAlign;
      delete root.dataset.a11yGrayscale;

      root.style.removeProperty("--a11y-text-scale");
      root.style.removeProperty("--a11y-letter-spacing");
      root.style.removeProperty("--a11y-line-height");
      root.style.removeProperty("--a11y-saturation");
    };
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      toggleSetting,
      resetSettings,
    }),
    [settings]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;