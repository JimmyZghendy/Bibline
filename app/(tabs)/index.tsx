import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
  PanResponder,
  Animated,
  Easing,
} from "react-native";

import { useAppContext } from "@/contexts/AppContext";
import { Language, LanguageCode, Translations } from "@/utils/types";

const languages: Language[] = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
];

export default function MainScreen() {
  const { isDarkMode, currentLanguage } = useAppContext();

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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fadeAnim = new Animated.Value(1);

  const animateImageChange = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderEnd: (evt, gestureState) => {
      const { dx } = gestureState;
      const SWIPE_THRESHOLD = 50;

      if (dx > SWIPE_THRESHOLD) {
        setCurrentImageIndex((prevIndex) => {
          animateImageChange();
          return prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1;
        });
      } else if (dx < -SWIPE_THRESHOLD) {
        setCurrentImageIndex((prevIndex) => {
          animateImageChange();
          return (prevIndex + 1) % carouselItems.length;
        });
      }
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselItems.length
      );
    }, 30000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626",
    secondary: "#e2e8f0",
    accent: "#f59e0b",
  };

  const translations: Record<LanguageCode, Translations> = {
    en: {
      welcome: "Welcome to Bible Explorer",
      explore: "Discover and read biblical texts from around the world",
      features: "App Features",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      settings: "Settings",
      bibleCollections: "Bible Collections",
      studyResources: "Study Resources",
      communityLearning: "Community & Learning",
      aboutBibleTitle: "The Word of God",
      aboutBibleText: "The Bible is a collection of sacred texts that contains the religious texts and scriptures sacred in Christianity, Judaism and Samaritanism. It is an anthology—a compilation of texts of a variety of forms—originally written in Hebrew, Aramaic, and Koine Greek. These texts include instructions, stories, poetry, and prophecies, and are studied worldwide.",
      aboutAppTitle: "About Bible Explorer",
      aboutAppText: "Bible Explorer is your comprehensive digital companion for studying sacred texts. Our app provides multiple translations, study tools, historical context, and personalized features to deepen your understanding of scripture. Whether you're a scholar, student, or simply seeking spiritual guidance, Bible Explorer offers resources for every level of biblical exploration.",
      scriptureOfDayTitle: "Scripture of the Day",
      scriptureOfDayText: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16',
      bibleBenefitsTitle: "Benefits of Bible Study",
      bibleBenefitsText: "Regular Bible study offers spiritual growth, moral guidance, and inner peace. It provides wisdom for everyday decisions, strengthens faith, and builds community through shared understanding. The Bible offers timeless truths that have guided generations through life's challenges and celebrations.",
    },
    ar: {
      welcome: "مرحبًا بكم في مستكشف الكتاب المقدس",
      explore: "اكتشف والقراءة النصوص الكتابية من جميع أنحاء العالم",
      features: "مميزات التطبيق",
      language: "اللغة",
      theme: "المظهر",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      settings: "الإعدادات",
      bibleCollections: "مجموعات الكتاب المقدس",
      studyResources: "موارد دراسة الكتاب",
      communityLearning: "مجتمع وتعليم",
      // New text sections
      aboutBibleTitle: "كلمة الله",
      aboutBibleText: "الكتاب المقدس هو مجموعة من النصوص المقدسة التي تحتوي على النصوص الدينية والكتب المقدسة في المسيحية واليهودية والسامرية. إنه مجموعة مختارة - تجميع لنصوص بأشكال متنوعة - كتبت أصلاً باللغة العبرية والآرامية واليونانية. تتضمن هذه النصوص تعليمات وقصص وشعر ونبوءات، وتدرس في جميع أنحاء العالم.",
      aboutAppTitle: "حول مستكشف الكتاب المقدس",
      aboutAppText: "مستكشف الكتاب المقدس هو رفيقك الرقمي الشامل لدراسة النصوص المقدسة. يوفر تطبيقنا ترجمات متعددة وأدوات دراسة وسياق تاريخي وميزات مخصصة لتعميق فهمك للكتاب المقدس. سواء كنت باحثًا أو طالبًا أو تبحث ببساطة عن إرشاد روحي، يقدم مستكشف الكتاب المقدس موارد لكل مستوى من مستويات استكشاف الكتاب المقدس.",
      scriptureOfDayTitle: "آية اليوم",
      scriptureOfDayText: '"لأنه هكذا أحب الله العالم حتى بذل ابنه الوحيد، لكي لا يهلك كل من يؤمن به، بل تكون له الحياة الأبدية. - يوحنا ٣:١٦',
      bibleBenefitsTitle: "فوائد دراسة الكتاب المقدس",
      bibleBenefitsText: "توفر دراسة الكتاب المقدس المنتظمة النمو الروحي والإرشاد الأخلاقي والسلام الداخلي. كما توفر الحكمة للقرارات اليومية، وتقوي الإيمان، وتبني المجتمع من خلال الفهم المشترك. يقدم الكتاب المقدس حقائق خالدة أرشدت الأجيال عبر تحديات الحياة واحتفالاتها.",
    },
    fr: {
      welcome: "Bienvenue sur Explorateur de Bibles",
      explore: "Découvrez et lisez des textes bibliques du monde entier",
      features: "Fonctionnalités de l'Application",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      settings: "Paramètres",
      bibleCollections: "Collections de Bibles",
      studyResources: "Ressources d'Étude",
      communityLearning: "Communauté & Éducation",
      // New text sections
      aboutBibleTitle: "La Parole de Dieu",
      aboutBibleText: "La Bible est un recueil de textes sacrés qui contient les textes religieux et les écritures sacrées dans le christianisme, le judaïsme et le samaritanisme. C'est une anthologie - une compilation de textes de diverses formes - écrite à l'origine en hébreu, en araméen et en grec koinè. Ces textes comprennent des instructions, des histoires, de la poésie et des prophéties, et sont étudiés partout dans le monde.",
      aboutAppTitle: "À propos de l'Explorateur de Bibles",
      aboutAppText: "L'Explorateur de Bibles est votre compagnon numérique complet pour l'étude des textes sacrés. Notre application propose de multiples traductions, des outils d'étude, des contextes historiques et des fonctionnalités personnalisées pour approfondir votre compréhension des écritures. Que vous soyez érudit, étudiant ou simplement à la recherche d'une guidance spirituelle, l'Explorateur de Bibles offre des ressources pour tous les niveaux d'exploration biblique.",
      scriptureOfDayTitle: "Verset du Jour",
      scriptureOfDayText: "'Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.' - Jean 3:16",
      bibleBenefitsTitle: "Bienfaits de l'Étude Biblique",
      bibleBenefitsText: "L'étude régulière de la Bible offre croissance spirituelle, guidance morale et paix intérieure. Elle fournit de la sagesse pour les décisions quotidiennes, renforce la foi et construit la communauté par une compréhension partagée. La Bible offre des vérités intemporelles qui ont guidé des générations à travers les défis et les célébrations de la vie.",
    },
  };

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
                <View
                  key={index}
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
          <Text style={[styles.exploreText, { color: theme.text }]}>
            {t.explore}
          </Text>
        </View>

        {/* About Bible Section - Replacing Auth buttons */}
        <View style={styles.textSectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.aboutBibleTitle}
          </Text>
          <View style={[styles.textCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.textCardContent, { color: theme.text }]}>
              {t.aboutBibleText}
            </Text>
          </View>
        </View>

        {/* About App Section */}
        <View style={styles.textSectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.aboutAppTitle}
          </Text>
          <View style={[styles.textCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.textCardContent, { color: theme.text }]}>
              {t.aboutAppText}
            </Text>
          </View>
        </View>

        {/* Scripture of the Day */}
        <View style={styles.textSectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.scriptureOfDayTitle}
          </Text>
          <View style={[styles.quoteCard, { backgroundColor: theme.primary }]}>
            <Text style={[styles.quoteText, { color: "#ffffff" }]}>
              {t.scriptureOfDayText}
            </Text>
          </View>
        </View>

        {/* Bible Collections Section */}
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
              <View
                key={index}
                style={[styles.collectionCard, { backgroundColor: theme.card }]}
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
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bible Benefits Section - Replacing Bible Study Resources */}
        <View style={styles.textSectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.bibleBenefitsTitle}
          </Text>
          <View style={[styles.textCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.textCardContent, { color: theme.text }]}>
              {t.bibleBenefitsText}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  exploreText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  textSectionContainer: {
    marginBottom: 30,
  },
  textCard: {
    borderRadius: 10,
    padding: 15,
  },
  textCardContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  quoteCard: {
    borderRadius: 10,
    padding: 15,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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
  communityImageContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  communityImage: {
    width: "100%",
    height: 200,
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