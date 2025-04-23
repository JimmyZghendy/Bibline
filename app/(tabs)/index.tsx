import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
  useColorScheme,
  PanResponder,
  Animated,
  Easing,
} from "react-native";
import { Globe, Moon, Sun, Menu, X, ChevronRight } from "react-native-feather";
import LoginPopup from "@/components/LoginPopup";

// Define types for languages and translations
type LanguageCode = "en" | "ar" | "fr";

type Translations = {
  welcome: string;
  explore: string;
  login: string;
  signup: string;
  features: string;
  feature1: string;
  feature2: string;
  feature3: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  loginDescription?: string;
  settings: string;
};

type Language = {
  code: LanguageCode;
  name: string;
};

// Define available languages
const languages: Language[] = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
];

export default function MainScreen() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Add state for login popup
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);

  // Handler for successful login
  const handleLoginSuccess = (phoneNumber: string) => {
    // TODO: Implement your login logic here
    console.log(`Logged in with phone number: ${phoneNumber}`);
    setIsLoginPopupVisible(false);
  };

  // Carousel images with multilingual titles
  const carouselItems = [
    {
      image: require("@/assets/images/LandingPage/Saint_charbel_church.jpg"),
      titles: {
        en: "Saint Charbel Church",
        ar: "كنيسة القديس شربل",
        fr: "Église Saint Charbel",
      },
    },
    {
      image: require("@/assets/images/LandingPage/Our_lady.jpg"),
      titles: {
        en: "Our Lady of Lebanon",
        ar: "سيدة لبنان",
        fr: "Notre-Dame du Liban",
      },
    },
    {
      image: require("@/assets/images/LandingPage/Saint_jean_marc.jpg"),
      titles: {
        en: "Saint Jean Marc Church",
        ar: "كنيسة القديس يوحنا مرقس",
        fr: "Église Saint Jean Marc",
      },
    },
    {
      image: require("@/assets/images/LandingPage/Saint_georges_church.jpg"),
      titles: {
        en: "Saint Georges Church",
        ar: "كنيسة القديس جاورجيوس",
        fr: "Église Saint Georges",
      },
    },
  ];

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Animated value for image transitions
  const fadeAnim = new Animated.Value(1);

  // Animate image change
  const animateImageChange = () => {
    // Reset to 0, then animate to 1
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  // PanResponder for swiping
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderEnd: (evt, gestureState) => {
      const { dx } = gestureState;
      const SWIPE_THRESHOLD = 50;

      if (dx > SWIPE_THRESHOLD) {
        // Swiped right - go to previous image
        setCurrentImageIndex((prevIndex) => {
          animateImageChange();
          return prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1;
        });
      } else if (dx < -SWIPE_THRESHOLD) {
        // Swiped left - go to next image
        setCurrentImageIndex((prevIndex) => {
          animateImageChange();
          return (prevIndex + 1) % carouselItems.length;
        });
      }
    },
  });

  // Carousel effect (optional, can be removed or modified)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselItems.length
      );
    }, 30000); // 30 seconds

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Theme colors
  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626", // Changed from purple to red (Tailwind red-600)
    secondary: "#e2e8f0",
    accent: "#f59e0b",
  };

  // Translations (simplified example)
  const translations: Record<LanguageCode, Translations> = {
    en: {
      welcome: "Welcome to Church News",
      explore: "Explore the latest news and events from churches in Lebanon",
      login: "Login",
      signup: "Sign Up",
      features: "App Features",
      feature1: "Daily devotionals and inspirational content",
      feature2: "Live streaming of church services",
      feature3: "Community events and announcements",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      loginDescription:
        "To access more features and personalized content, please login",
      settings: "Settings",
    },
    ar: {
      welcome: "مرحبًا بكم في أخبار الكنيسة",
      explore: "استكشف أحدث الأخبار والفعاليات من الكنائس في لبنان",
      login: "تسجيل الدخول",
      signup: "التسجيل",
      features: "مميزات التطبيق",
      feature1: "تأملات يومية ومحتوى ملهم",
      feature2: "بث مباشر لخدمات الكنيسة",
      feature3: "فعاليات مجتمعية وإعلانات",
      language: "اللغة",
      theme: "المظهر",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      loginDescription:
        "للوصول إلى المزيد من الميزات والمحتوى الشخصي، يرجى تسجيل الدخول",
      settings: "الإعدادات",
    },
    fr: {
      welcome: "Bienvenue aux Nouvelles de l'Église",
      explore:
        "Explorez les dernières nouvelles et événements des églises au Liban",
      login: "Connexion",
      signup: "S'inscrire",
      features: "Fonctionnalités de l'Application",
      feature1: "Dévotions quotidiennes et contenu inspirant",
      feature2: "Diffusion en direct des services religieux",
      feature3: "Événements communautaires et annonces",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      loginDescription:
        "Pour accéder à plus de fonctionnalités et de contenu personnalisé, veuillez vous connecter",
      settings: "Paramètres",
    },
  };

  // Get current translations
  const t = translations[currentLanguage.code];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
        },
      ]}
    >
      <RNStatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={true}
      />

      {/* Header with menu button */}
      <View
        style={[
          styles.header,
          {
            flexDirection:
              currentLanguage.code === "ar" ? "row-reverse" : "row",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={[
            styles.menuButton,
            {
              zIndex: 10,
              // Adjust positioning for Arabic
              ...(currentLanguage.code === "ar" && {
                position: "absolute",
                right: 16,
              }),
            },
          ]}
        >
          {showMenu ? <X stroke={theme.text} /> : <Menu stroke={theme.text} />}
        </TouchableOpacity>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require("@/assets/images/Kanisati_logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        {/* Empty view to balance layout */}
        <View style={{ width: 50 }} />
      </View>

      {/* Side menu */}
      {showMenu && (
        <View
          style={[
            styles.sideMenu,
            {
              backgroundColor: theme.card,
              paddingTop:
                Platform.OS === "android"
                  ? (RNStatusBar.currentHeight || 0) + 20
                  : 20,
              // Adjust for Arabic language
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

          {/* Language selector */}
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
                      currentLanguage.code === "ar" ? "flex-end" : "flex-start",
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
                    onPress={() => {
                      setCurrentLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
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

          {/* Theme selector */}
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
              onPress={() => setIsDarkMode(!isDarkMode)}
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
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <View style={styles.carouselContainer} {...panResponder.panHandlers}>
            <Animated.Image
              source={carouselItems[currentImageIndex].image}
              style={[
                styles.carouselImage,
                {
                  opacity: fadeAnim,
                },
              ]}
              key={currentImageIndex}
            />
            <Text style={[styles.welcomeTitle, { color: theme.text }]}>
              {carouselItems[currentImageIndex].titles[currentLanguage.code]}
            </Text>
            <View style={styles.indicators}>
              {carouselItems.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        index === currentImageIndex
                          ? theme.primary
                          : theme.secondary,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={[styles.welcomeSubtitle, { color: theme.text }]}>
            {t.welcome}
          </Text>
        </View>

        {/* Auth buttons */}
        <View style={styles.authButtonsContainer}>
          <Text style={[styles.loginDescriptionText, { color: theme.text }]}>
            {t.loginDescription ||
              "To access more features and personalized content, please login"}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => setIsLoginPopupVisible(true)}
          >
            <Text style={styles.buttonText}>{t.login}</Text>
          </TouchableOpacity>
        </View>

        {/* Login Popup */}
        <LoginPopup
          visible={isLoginPopupVisible}
          onClose={() => setIsLoginPopupVisible(false)}
          onLoginSuccess={handleLoginSuccess}
          theme={{
            primary: theme.primary || "#dc2626",
            text: theme.text,
            card: theme.card,
            background: theme.background,
            border: theme.secondary,
          }}
        />

        {/* Features section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.features}
          </Text>

          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: "https://placeholder.svg?height=60&width=60" }}
              style={styles.featureIcon}
            />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {t.feature1}
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: "https://placeholder.svg?height=60&width=60" }}
              style={styles.featureIcon}
            />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {t.feature2}
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: "https://placeholder.svg?height=60&width=60" }}
              style={styles.featureIcon}
            />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {t.feature3}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles (copied from the original code)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerLogoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
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
  themeToggle: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  carouselImage: {
    width: "90%",
    height: 250,
    borderRadius: 15,
    resizeMode: "cover",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  authButtonsContainer: {
    marginBottom: 40,
    paddingHorizontal: 20, // Add horizontal padding
  },
  loginDescriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%",
    height: "100%",
    zIndex: 100,
    padding: 20,
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight || 0) + 20 : 20,
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
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
