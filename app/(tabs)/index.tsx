import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Import the AppContext
import { useAppContext } from "@/contexts/AppContext";

// Define types for languages and translations
type LanguageCode = "en" | "ar" | "fr";

type Translations = {
  welcome: string;
  explore: string;
  login: string;
  signup: string;
  features: string;
  multilingualBibles?: string;
  deepStudyTools?: string;
  personalNotes?: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  loginDescription?: string;
  settings: string;
  bibleCollections?: string;
  studyResources?: string;
  communityLearning?: string;
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

// Define navigation type
type RootStackParamList = {
  books: undefined;
};

export default function MainScreen() {
  // Use the AppContext
  const { isDarkMode, currentLanguage } = useAppContext();

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
      welcome: "Welcome to Bible Explorer",
      explore: "Discover and read biblical texts from around the world",
      login: "Explore Bibles",
      signup: "Create Account",
      features: "App Features",
      multilingualBibles: "Multilingual Bibles",
      deepStudyTools: "Deep Study Tools",
      personalNotes: "Personal Notes",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      loginDescription:
        "Access a comprehensive library of biblical texts and resources",
      settings: "Settings",
      bibleCollections: "Bible Collections",
      studyResources: "Study Resources",
      communityLearning: "Community & Learning",
    },
    ar: {
      welcome: "مرحبًا بكم في مستكشف الكتاب المقدس",
      explore: "اكتشف والقراءة النصوص الكتابية من جميع أنحاء العالم",
      login: "استكشف الكتب المقدسة",
      signup: "إنشاء حساب",
      features: "مميزات التطبيق",
      multilingualBibles: "ترجمات متعددة اللغات للكتاب المقدس",
      deepStudyTools: "موارد دراسة كتابية معمقة",
      personalNotes: "تعليقات شخصية للكتاب المقدس",
      language: "اللغة",
      theme: "المظهر",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      loginDescription: "الوصول إلى مكتبة شاملة من النصوص والموارد الكتابية",
      settings: "الإعدادات",
      bibleCollections: "مجموعات الكتاب المقدس",
      studyResources: "موارد دراسة الكتاب",
      communityLearning: "مجتمع وتعليم",
    },
    fr: {
      welcome: "Bienvenue sur Explorateur de Bibles",
      explore: "Découvrez et lisez des textes bibliques du monde entier",
      login: "Explorer les Bibles",
      signup: "Créer un compte",
      features: "Fonctionnalités de l'Application",
      multilingualBibles: "Traductions bibliques multilingues",
      deepStudyTools: "Ressources d'étude biblique approfondies",
      personalNotes: "Notes personnelles",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      loginDescription:
        "Accédez à une bibliothèque complète de textes et ressources bibliques",
      settings: "Paramètres",
      bibleCollections: "Collections de Bibles",
      studyResources: "Ressources d'Étude",
      communityLearning: "Communauté & Éducation",
    },
  };

  // Get current translations
  const t = translations[currentLanguage.code];

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Carousel section */}
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
            {t.loginDescription}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => navigation.navigate("books")}
          >
            <Text style={styles.buttonText}>{t.login}</Text>
          </TouchableOpacity>
        </View>

        {/* New Bible Collections Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.bibleCollections}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {[
              {
                title: "King James Version",
                description: "Classic English translation",
                icon: "📖",
              },
              {
                title: "Arabic Bible",
                description: "Complete Arabic translation",
                icon: "🕌",
              },
              {
                title: "French Bible",
                description: "Comprehensive French edition",
                icon: "🇫🇷",
              },
              {
                title: "Study Bible",
                description: "In-depth scholarly annotations",
                icon: "📚",
              },
            ].map((collection, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.collectionCard, { backgroundColor: theme.card }]}
                onPress={() => {
                  /* Navigate to collection */
                }}
              >
                <Text style={styles.collectionIcon}>{collection.icon}</Text>
                <View>
                  <Text style={[styles.collectionTitle, { color: theme.text }]}>
                    {collection.title}
                  </Text>
                  <Text
                    style={[
                      styles.collectionDescription,
                      { color: theme.text },
                    ]}
                  >
                    {collection.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bible Study Resources Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.studyResources}
          </Text>
          <View style={styles.resourcesGrid}>
            {[
              {
                title: "Commentaries",
                description: "Expert biblical insights",
                icon: "🔍",
              },
              {
                title: "Concordance",
                description: "Word studies and references",
                icon: "📋",
              },
              {
                title: "Historical Context",
                description: "Cultural and historical background",
                icon: "🏺",
              },
              {
                title: "Original Languages",
                description: "Hebrew and Greek texts",
                icon: "🌐",
              },
            ].map((resource, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.resourceCard, { backgroundColor: theme.card }]}
                onPress={() => {
                  /* Navigate to resource */
                }}
              >
                <Text style={styles.resourceIcon}>{resource.icon}</Text>
                <Text style={[styles.resourceTitle, { color: theme.text }]}>
                  {resource.title}
                </Text>
                <Text
                  style={[styles.resourceDescription, { color: theme.text }]}
                >
                  {resource.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Community and Learning Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.communityLearning}
          </Text>
          <View
            style={[styles.communitySection, { backgroundColor: theme.card }]}
          >
            <View style={styles.communityContent}>
              <Text style={[styles.communityTitle, { color: theme.text }]}>
                Join Bible Study Groups
              </Text>
              <Text
                style={[styles.communityDescription, { color: theme.text }]}
              >
                Connect with others, share insights, and grow together
              </Text>
              <TouchableOpacity
                style={[
                  styles.communityButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => {
                  /* Navigate to community */
                }}
              >
                <Text style={styles.communityButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("@/assets/images/LandingPage/Saint_jean_marc.jpg")}
              style={styles.communityImage}
              resizeMode="contain"
            />
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
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureCardFull: {
    width: "50%",
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  featureIconContainerFull: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featureIconFull: {
    fontSize: 24,
  },
  featureContentFull: {
    flex: 1,
    padding: 10,
  },
  featureTitleFull: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featureDescriptionFull: {
    fontSize: 14,
  },
  featureBanner: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
  },
  featureIconBanner: {
    fontSize: 24,
    marginBottom: 10,
  },
  featureContentBanner: {
    flex: 1,
  },
  featureTitleBanner: {
    fontSize: 16,
    fontWeight: "bold",
  },
  featureDescriptionBanner: {
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  horizontalScrollContainer: {
    padding: 10,
  },
  collectionCard: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  collectionDescription: {
    fontSize: 14,
  },
  resourcesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  resourceCard: {
    width: "50%",
    padding: 10,
  },
  resourceIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resourceDescription: {
    fontSize: 14,
  },
  communitySection: {
    flexDirection: "row",
    alignItems: "center",
  },
  communityContent: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  communityDescription: {
    fontSize: 16,
  },
  communityButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  communityButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  communityImage: {
    width: 150,
    height: 150,
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
