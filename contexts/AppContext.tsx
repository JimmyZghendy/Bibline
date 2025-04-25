import React, { createContext, useState, useContext, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

// Define types for languages
export type LanguageCode = "en" | "ar" | "fr";

export type Language = {
  code: LanguageCode;
  name: string;
};

// Available languages
export const languages: Language[] = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
];

// Context type
type AppContextType = {
  isDarkMode: boolean;
  currentLanguage: Language;
  setIsDarkMode: (isDark: boolean) => void;
  setCurrentLanguage: (language: Language) => void;
};

// Create context
const AppContext = createContext<AppContextType>({
  isDarkMode: true,
  currentLanguage: languages[0],
  setIsDarkMode: () => {},
  setCurrentLanguage: () => {},
});

// Provider component
export function AppContextProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        currentLanguage,
        setIsDarkMode,
        setCurrentLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  return useContext(AppContext);
}
