import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  Modal,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Globe, Moon, Sun, Menu, X, ChevronRight } from "react-native-feather";

import { useAppContext, languages, Language } from "@/contexts/AppContext";

type Translations = {
  settings: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
};

const translations: Record<string, Translations> = {
  en: {
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
  },
  ar: {
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
  },
  fr: {
    settings: "Paramètres",
    language: "Langue",
    theme: "Thème",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
  },
};

type NavbarWithSidebarProps = {
  title?: string;
};

export function NavbarWithSidebar({ title }: NavbarWithSidebarProps) {
  const { isDarkMode, currentLanguage, setIsDarkMode, setCurrentLanguage } = useAppContext();

  const insets = useSafeAreaInsets();

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626",
    secondary: "#e2e8f0",
    accent: "#f59e0b",
  };

  const t = translations[currentLanguage.code];

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const screenWidth = Dimensions.get("window").width;

  const NavbarWrapper = Platform.OS === "web" ? View : SafeAreaView;
  const navbarWrapperProps =
    Platform.OS === "web"
      ? {}
      : {
          style: {
            backgroundColor: theme.background,
            flex: 0,
          },
          edges: ["top"] as const,
        };

  return (
    <NavbarWrapper {...navbarWrapperProps}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            ...(Platform.OS === "web"
              ? {
                  height: 60,
                  paddingTop: 0,
                }
              : {
                  height: 60,
                  paddingTop: 0,
                }),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={[
            styles.menuButton,
            {
              position: "absolute",
              left: currentLanguage.code === "ar" ? undefined : 16,
              right: currentLanguage.code === "ar" ? 16 : undefined,
              zIndex: 10,
            },
          ]}
        >
          <Menu stroke={theme.text} />
        </TouchableOpacity>

        <View style={[styles.headerLogoContainer, { zIndex: 5 }]}>
          <Image
            source={require("@/assets/images/bibline_logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection:
              currentLanguage.code === "ar" ? "row-reverse" : "row",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowMenu(false)}
            activeOpacity={1}
          />
          <View
            style={[
              styles.sideMenu,
              {
                width: screenWidth * 0.8,
                backgroundColor: theme.card,
                paddingTop: insets.top + 20,
                ...(currentLanguage.code === "ar" && {
                  left: "auto",
                  right: 0,
                }),
              },
            ]}
          >
            <View
              style={[
                styles.menuHeader,
                {
                  flexDirection:
                    currentLanguage.code === "ar" ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={[styles.menuTitle, { color: theme.text }]}>
                {t.settings}
              </Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <X stroke={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuSection}>
              <Text
                style={[
                  styles.menuSectionTitle,
                  {
                    color: theme.text,
                    textAlign: currentLanguage.code === "ar" ? "right" : "left",
                  },
                ]}
              >
                {t.language}
              </Text>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: showLanguageMenu
                      ? theme.secondary
                      : "transparent",
                    flexDirection:
                      currentLanguage.code === "ar" ? "row-reverse" : "row",
                  },
                ]}
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <View
                  style={[
                    styles.menuItemContent,
                    {
                      flexDirection:
                        currentLanguage.code === "ar" ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <Globe stroke={theme.text} width={20} height={20} />
                  <Text
                    style={[
                      styles.menuItemText,
                      {
                        color: theme.text,
                        marginLeft: currentLanguage.code === "ar" ? 0 : 10,
                        marginRight: currentLanguage.code === "ar" ? 10 : 0,
                      },
                    ]}
                  >
                    {currentLanguage.name}
                  </Text>
                </View>
                <ChevronRight
                  stroke={theme.text}
                  width={20}
                  height={20}
                  style={
                    currentLanguage.code === "ar" && {
                      transform: [{ rotate: "180deg" }],
                    }
                  }
                />
              </TouchableOpacity>

              {showLanguageMenu && (
                <View
                  style={[
                    styles.submenu,
                    {
                      backgroundColor: theme.card,
                      alignItems:
                        currentLanguage.code === "ar"
                          ? "flex-end"
                          : "flex-start",
                    },
                  ]}
                >
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.submenuItem,
                        currentLanguage.code === lang.code && {
                          backgroundColor: theme.secondary,
                        },
                        {
                          alignSelf:
                            currentLanguage.code === "ar"
                              ? "flex-end"
                              : "flex-start",
                          width: "100%",
                        },
                      ]}
                      onPress={() => handleLanguageChange(lang)}
                    >
                      <Text
                        style={[
                          styles.submenuItemText,
                          {
                            color: theme.text,
                            textAlign:
                              currentLanguage.code === "ar" ? "right" : "left",
                          },
                        ]}
                      >
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.menuSection}>
              <Text
                style={[
                  styles.menuSectionTitle,
                  {
                    color: theme.text,
                    textAlign: currentLanguage.code === "ar" ? "right" : "left",
                  },
                ]}
              >
                {t.theme}
              </Text>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    flexDirection:
                      currentLanguage.code === "ar" ? "row-reverse" : "row",
                  },
                ]}
                onPress={handleThemeToggle}
              >
                <View
                  style={[
                    styles.menuItemContent,
                    {
                      flexDirection:
                        currentLanguage.code === "ar" ? "row-reverse" : "row",
                    },
                  ]}
                >
                  {isDarkMode ? (
                    <Sun stroke={theme.text} width={20} height={20} />
                  ) : (
                    <Moon stroke={theme.text} width={20} height={20} />
                  )}
                  <Text
                    style={[
                      styles.menuItemText,
                      {
                        color: theme.text,
                        marginLeft: currentLanguage.code === "ar" ? 0 : 10,
                        marginRight: currentLanguage.code === "ar" ? 10 : 0,
                      },
                    ]}
                  >
                    {isDarkMode ? t.lightMode : t.darkMode}
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: isDarkMode
                        ? theme.primary
                        : theme.secondary,
                      flexDirection:
                        currentLanguage.code === "ar" ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleDot,
                      {
                        backgroundColor: theme.background,
                        transform: [
                          {
                            translateX: isDarkMode
                              ? currentLanguage.code === "ar"
                                ? -16
                                : 16
                              : 0,
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </NavbarWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    position: "relative",
  },
  headerLogoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 130,
    height: 130,
  },
  menuButton: {
    padding: 8,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%",
    height: "100%",
    zIndex: 100,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  submenu: {
    marginLeft: 20,
    marginTop: 5,
    borderRadius: 8,
  },
  submenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  submenuItemText: {
    fontSize: 16,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});