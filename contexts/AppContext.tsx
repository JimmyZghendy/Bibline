import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Error loading theme", error);
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("appTheme", JSON.stringify(isDarkMode));
      } catch (error) {
        console.error("Error saving theme", error);
      }
    };
    saveTheme();
  }, [isDarkMode]);

  // Modify setIsDarkMode to ensure proper state update
  const toggleDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        currentLanguage,
        setIsDarkMode: toggleDarkMode,
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
