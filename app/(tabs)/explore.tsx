import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  TextInput,
  Linking,
} from "react-native";
import {
  Search,
  BookOpen,
  Compass,
  Heart,
  Users,
  Video,
  Radio,
} from "react-native-feather";

// Import the AppContext
import { useAppContext } from "@/contexts/AppContext";
import { LanguageCode } from "@/utils/types";

// Static data for explore screen with translations
const exploreCategories = {
  en: [
    {
      id: "spiritual-growth",
      title: "Spiritual Enrichment",
      description: "Deepen your faith journey",
      youtubeLink: "https://www.youtube.com/watch?v=gstHXedfA4Y",
      items: [
        {
          name: "Daily Devotionals",
          icon: (color: string) => <Heart stroke={color} />,
          description: "Inspirational daily readings",
          iconColor: "#dc2626",
          lightColor: "#FFF5F5",
          darkColor: "#2C1F1F",
        },
        {
          name: "Prayer Guides",
          icon: (color: string) => <BookOpen stroke={color} />,
          description: "Structured prayer techniques",
          iconColor: "#10b981",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
    {
      id: "learning",
      title: "Biblical Learning",
      description: "Expand your biblical knowledge",
      youtubeLink: "https://www.youtube.com/playlist?list=PLH0Szn1yYNedn4FbBMMtOlGN-BPLQ54IH",
      items: [
        {
          name: "Bible Study Resources",
          icon: (color: string) => <Video stroke={color} />,
          description: "In-depth theological insights",
          iconColor: "#8b5cf6",
          lightColor: "#EFF6FF",
          darkColor: "#1F2C3C",
        },
        {
          name: "Online Courses",
          icon: (color: string) => <Radio stroke={color} />,
          description: "Structured biblical education",
          iconColor: "#f59e0b",
          lightColor: "#F5F3FF",
          darkColor: "#2C2C1F",
        },
      ],
    },
    {
      id: "community",
      title: "Community Connections",
      description: "Connect with fellow believers",
      youtubeLink: "https://www.youtube.com/watch?v=BO1Y9XyWKTw",
      items: [
        {
          name: "Local Church Finder",
          icon: (color: string) => <Users stroke={color} />,
          description: "Discover nearby worship communities",
          iconColor: "#f59e0b",
          lightColor: "#FFFBEB",
          darkColor: "#2C2C1F",
        },
        {
          name: "Global Missions",
          icon: (color: string) => <Compass stroke={color} />,
          description: "Explore missionary opportunities",
          iconColor: "#22c55e",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
  ],
  ar: [
    {
      id: "spiritual-growth",
      title: "الإثراء الروحي",
      description: "تعميق رحلة إيمانك",
      youtubeLink: "https://www.youtube.com/c/bibleprojectstandardarabic",
      items: [
        {
          name: "التأملات اليومية",
          icon: (color: string) => <Heart stroke={color} />,
          description: "قراءات يومية ملهمة",
          iconColor: "#dc2626",
          lightColor: "#FFF5F5",
          darkColor: "#2C1F1F",
        },
        {
          name: "دليل الصلاة",
          icon: (color: string) => <BookOpen stroke={color} />,
          description: "تقنيات صلاة منظمة",
          iconColor: "#10b981",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
    {
      id: "learning",
      title: "التعلم الكتابي",
      description: "توسيع معرفتك الكتابية",
      youtubeLink: "https://www.youtube.com/c/bibleprojectstandardarabic",
      items: [
        {
          name: "موارد دراسة الكتاب المقدس",
          icon: (color: string) => <Video stroke={color} />,
          description: "رؤى لاهوتية متعمقة",
          iconColor: "#8b5cf6",
          lightColor: "#EFF6FF",
          darkColor: "#1F2C3C",
        },
        {
          name: "دورات عبر الإنترنت",
          icon: (color: string) => <Radio stroke={color} />,
          description: "تعليم كتابي منظم",
          iconColor: "#f59e0b",
          lightColor: "#F5F3FF",
          darkColor: "#2C2C1F",
        },
      ],
    },
    {
      id: "community",
      title: "روابط المجتمع",
      description: "تواصل مع المؤمنين الآخرين",
      youtubeLink: "https://www.youtube.com/watch?v=WlOiMX3-LHs",
      items: [
        {
          name: "باحث الكنيسة المحلية",
          icon: (color: string) => <Users stroke={color} />,
          description: "اكتشف مجتمعات العبادة القريبة",
          iconColor: "#f59e0b",
          lightColor: "#FFFBEB",
          darkColor: "#2C2C1F",
        },
        {
          name: "البعثات العالمية",
          icon: (color: string) => <Compass stroke={color} />,
          description: "استكشاف فرص التبشير",
          iconColor: "#22c55e",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
  ],
  fr: [
    {
      id: "spiritual-growth",
      title: "Enrichissement Spirituel",
      description: "Approfondissez votre voyage de foi",
      youtubeLink: "https://www.youtube.com/c/BibleProjectFran%C3%A7ais",
      items: [
        {
          name: "Dévotions Quotidiennes",
          icon: (color: string) => <Heart stroke={color} />,
          description: "Lectures quotidiennes inspirantes",
          iconColor: "#dc2626",
          lightColor: "#FFF5F5",
          darkColor: "#2C1F1F",
        },
        {
          name: "Guides de Prière",
          icon: (color: string) => <BookOpen stroke={color} />,
          description: "Techniques de prière structurées",
          iconColor: "#10b981",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
    {
      id: "learning",
      title: "Apprentissage Biblique",
      description: "Élargissez vos connaissances bibliques",
      youtubeLink: "https://www.youtube.com/c/BibleProjectFran%C3%A7ais",
      items: [
        {
          name: "Ressources d'Étude Biblique",
          icon: (color: string) => <Video stroke={color} />,
          description: "Perspectives théologiques approfondies",
          iconColor: "#8b5cf6",
          lightColor: "#EFF6FF",
          darkColor: "#1F2C3C",
        },
        {
          name: "Cours en Ligne",
          icon: (color: string) => <Radio stroke={color} />,
          description: "Éducation biblique structurée",
          iconColor: "#f59e0b",
          lightColor: "#F5F3FF",
          darkColor: "#2C2C1F",
        },
      ],
    },
    {
      id: "community",
      title: "Connexions Communautaires",
      description: "Connectez-vous avec d'autres croyants",
      youtubeLink: "https://www.youtube.com/c/BibleProjectFran%C3%A7ais",
      items: [
        {
          name: "Recherche d'Églises Locales",
          icon: (color: string) => <Users stroke={color} />,
          description: "Découvrez les communautés de culte à proximité",
          iconColor: "#f59e0b",
          lightColor: "#FFFBEB",
          darkColor: "#2C2C1F",
        },
        {
          name: "Missions Globales",
          icon: (color: string) => <Compass stroke={color} />,
          description: "Explorez les opportunités missionnaires",
          iconColor: "#22c55e",
          lightColor: "#F0FDF4",
          darkColor: "#1F2C25",
        },
      ],
    },
  ],
};

// UI translation strings
const translations = {
  en: {
    searchPlaceholder: "Search resources...",
    noResultsTitle: "No resources found",
    noResultsSubtext: "Try a different search term",
  },
  ar: {
    searchPlaceholder: "البحث عن الموارد...",
    noResultsTitle: "لم يتم العثور على موارد",
    noResultsSubtext: "جرب مصطلح بحث مختلف",
  },
  fr: {
    searchPlaceholder: "Rechercher des ressources...",
    noResultsTitle: "Aucune ressource trouvée",
    noResultsSubtext: "Essayez un terme de recherche différent",
  },
};

export default function ExploreScreen() {
  // Use the AppContext
  const { isDarkMode, currentLanguage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Theme colors with enhanced dark mode support
  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626", // Tailwind red-600
    secondary: isDarkMode ? "#333333" : "#e2e8f0",
    accent: "#f59e0b",
    searchBackground: isDarkMode ? "#2c2c2c" : "#f1f5f9",
    border: isDarkMode ? "#333333" : "#e2e8f0",
  };

  // Get translated content based on current language
  const categories = exploreCategories[currentLanguage.code as LanguageCode];
  const t = translations[currentLanguage.code as LanguageCode];

  // Function to open YouTube links
  const handleCategoryPress = (youtubeLink: string) => {
    Linking.openURL(youtubeLink);
  };

  // Filter categories based on search query
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

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

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          currentLanguage.code === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <Search
          stroke={theme.text}
          style={[
            styles.searchIcon,
            currentLanguage.code === "ar" ? { right: 30, left: "auto" } : {},
          ]}
          opacity={0.7}
        />
                <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.searchBackground,
              color: theme.text,
              borderColor: theme.secondary,
              textAlign: currentLanguage.code === "ar" ? "right" : "left",
              paddingLeft: currentLanguage.code === "ar" ? 15 : 40,
              paddingRight: currentLanguage.code === "ar" ? 40 : 15,
            },
          ]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={currentLanguage.code === "ar" ? "right" : "left"}
        />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => handleCategoryPress(category.youtubeLink)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryHeaderContainer}>
              <View style={styles.categoryTextContainer}>
                <Text style={[styles.categoryTitle, { color: theme.text }]}>
                  {category.title}
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.text }]}>
                  {category.description}
                </Text>
              </View>
              <View style={styles.videoIconContainer}>
                <Video stroke={theme.primary} width={24} height={24} />
              </View>
            </View>

            {category.items.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: isDarkMode
                      ? item.darkColor
                      : item.lightColor,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.itemIconContainer}>
                  {item.icon(isDarkMode ? theme.text : item.iconColor)}
                </View>
                <View style={styles.itemContent}>
                  <Text style={[styles.itemTitle, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemDescription, { color: theme.text }]}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        ))}

        {/* No results message */}
        {filteredCategories.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              {t.noResultsTitle}
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.text }]}>
              {t.noResultsSubtext}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchIcon: {
    position: "absolute",
    left: 30,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 15,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
  scrollContent: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTextContainer: {
    flex: 1,
  },
  videoIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryDescription: {
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  itemIconContainer: {
    marginRight: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 16,
  },
});