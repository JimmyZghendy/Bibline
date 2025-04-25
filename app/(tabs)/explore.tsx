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

// Static data for explore screen with more comprehensive sections
const exploreCategories = [
  {
    id: "spiritual-growth",
    title: "Spiritual Enrichment",
    description: "Deepen your faith journey",
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
];

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

  // Filter categories based on search query
  const filteredCategories = exploreCategories
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
      <View style={styles.searchContainer}>
        <Search stroke={theme.text} style={styles.searchIcon} opacity={0.7} />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.searchBackground,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Search resources..."
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredCategories.map((category) => (
          <View
            key={category.id}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.categoryTitle, { color: theme.text }]}>
              {category.title}
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.text }]}>
              {category.description}
            </Text>

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
          </View>
        ))}

        {/* No results message */}
        {filteredCategories.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              No resources found
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.text }]}>
              Try a different search term
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
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryDescription: {
    fontSize: 16,
    marginBottom: 15,
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
