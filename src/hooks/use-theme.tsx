"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "sepia" | "midnight" | "forest";
type FontSize = "small" | "medium" | "large";
type FontStyle = "serif" | "sans";

interface ThemeSettings {
  theme: Theme;
  fontSize: FontSize;
  fontStyle: FontStyle;
  lineHeight: number;
}

interface ThemeContextType extends ThemeSettings {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setFontStyle: (style: FontStyle) => void;
  setLineHeight: (height: number) => void;
}

const defaultSettings: ThemeSettings = {
  theme: "dark",
  fontSize: "medium",
  fontStyle: "serif",
  lineHeight: 1.8,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("themeSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        // Use defaults
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", settings.theme);
      document.documentElement.setAttribute("data-font-size", settings.fontSize);
      document.documentElement.setAttribute("data-font-style", settings.fontStyle);
      document.documentElement.style.setProperty("--line-height-poem", String(settings.lineHeight));
      localStorage.setItem("themeSettings", JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setFontStyle = (fontStyle: FontStyle) => {
    setSettings((prev) => ({ ...prev, fontStyle }));
  };

  const setLineHeight = (lineHeight: number) => {
    setSettings((prev) => ({ ...prev, lineHeight }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        ...settings,
        setTheme,
        setFontSize,
        setFontStyle,
        setLineHeight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
