import React, { useState, useMemo } from "react";
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
  FlatList,
  Dimensions,
} from "react-native";
import { Book, Search, ChevronRight } from "react-native-feather";

// Import the AppContext
import { useAppContext } from "@/contexts/AppContext";

// Comprehensive Bible content with more books
const bibleSections = [
  {
    id: "testament1",
    title: "Old Testament",
    description: "Foundational texts of faith and history",
    books: [
      {
        name: "1. Genesis",
        chapters: 50,
        description: "Creation and early human history",
        icon: "🌍",
      },
      {
        name: "2. Exodus",
        chapters: 40,
        description: "Liberation and covenant",
        icon: "🕊️",
      },
      {
        name: "3. Leviticus",
        chapters: 27,
        description: "Priestly laws and regulations",
        icon: "📜",
      },
      {
        name: "4. Numbers",
        chapters: 36,
        description: "Wilderness wanderings",
        icon: "🏜️",
      },
      {
        name: "5. Deuteronomy",
        chapters: 34,
        description: "Moses' final instructions",
        icon: "📖",
      },
      {
        name: "6. Joshua",
        chapters: 24,
        description: "Conquest of Canaan",
        icon: "🏹",
      },
      {
        name: "7. Judges",
        chapters: 21,
        description: "Period of the judges",
        icon: "⚔️",
      },
      {
        name: "8. Ruth",
        chapters: 4,
        description: "Story of loyalty and redemption",
        icon: "❤️",
      },
      {
        name: "9. 1 Samuel",
        chapters: 31,
        description: "Rise of the monarchy",
        icon: "👑",
      },
      {
        name: "10. 2 Samuel",
        chapters: 24,
        description: "David's reign",
        icon: "🛡️",
      },
      {
        name: "11. 1 Kings",
        chapters: 22,
        description: "Solomon and divided kingdom",
        icon: "🏰",
      },
      {
        name: "12. 2 Kings",
        chapters: 25,
        description: "Fall of Israel and Judah",
        icon: "🔥",
      },
      {
        name: "13. 1 Chronicles",
        chapters: 29,
        description: "Genealogies and David's reign",
        icon: "📋",
      },
      {
        name: "14. 2 Chronicles",
        chapters: 36,
        description: "Kingdom of Judah",
        icon: "🕯️",
      },
      {
        name: "15. Ezra",
        chapters: 10,
        description: "Return from Babylonian exile",
        icon: "🏛️",
      },
      {
        name: "16. Nehemiah",
        chapters: 13,
        description: "Rebuilding Jerusalem",
        icon: "🧱",
      },
      {
        name: "17. Esther",
        chapters: 10,
        description: "Jewish survival in Persia",
        icon: "👑",
      },
      {
        name: "18. Job",
        chapters: 42,
        description: "Suffering and faith",
        icon: "💔",
      },
      {
        name: "19. Psalms",
        chapters: 150,
        description: "Poetic worship and lament",
        icon: "🎵",
      },
      {
        name: "20. Proverbs",
        chapters: 31,
        description: "Wisdom and moral teachings",
        icon: "🧠",
      },
      {
        name: "Ecclesiastes",
        chapters: 12,
        description: "Reflections on life's meaning",
        icon: "🤔",
      },
      {
        name: "Song of Solomon",
        chapters: 8,
        description: "Love poetry",
        icon: "❤️",
      },
      {
        name: "Isaiah",
        chapters: 66,
        description: "Prophecy and messianic hope",
        icon: "🕊️",
      },
      {
        name: "Jeremiah",
        chapters: 52,
        description: "Warnings and lamentations",
        icon: "😢",
      },
      {
        name: "Lamentations",
        chapters: 5,
        description: "Grief over Jerusalem",
        icon: "😭",
      },
      {
        name: "Ezekiel",
        chapters: 48,
        description: "Visions of restoration",
        icon: "👁️",
      },
      {
        name: "Daniel",
        chapters: 12,
        description: "Prophecy and divine intervention",
        icon: "🦁",
      },
      {
        name: "Hosea",
        chapters: 14,
        description: "Metaphor of God's love",
        icon: "❤️",
      },
      { name: "Joel", chapters: 3, description: "Day of the Lord", icon: "🌪️" },
      { name: "Amos", chapters: 9, description: "Social justice", icon: "⚖️" },
      {
        name: "Obadiah",
        chapters: 1,
        description: "Judgment on Edom",
        icon: "🏔️",
      },
      {
        name: "Jonah",
        chapters: 4,
        description: "Mercy and compassion",
        icon: "🐳",
      },
      {
        name: "Micah",
        chapters: 7,
        description: "Social and religious critique",
        icon: "🗣️",
      },
      {
        name: "Nahum",
        chapters: 3,
        description: "Prophecy against Nineveh",
        icon: "🏙️",
      },
      {
        name: "Habakkuk",
        chapters: 3,
        description: "Dialogue with God",
        icon: "🤲",
      },
      {
        name: "Zephaniah",
        chapters: 3,
        description: "Day of judgment",
        icon: "🌋",
      },
      {
        name: "Haggai",
        chapters: 2,
        description: "Rebuilding the temple",
        icon: "🏗️",
      },
      {
        name: "Zechariah",
        chapters: 14,
        description: "Messianic prophecies",
        icon: "🕯️",
      },
      {
        name: "Malachi",
        chapters: 4,
        description: "Final prophetic message",
        icon: "📯",
      },
    ],
  },
  {
    id: "testament2",
    title: "New Testament",
    description: "Life and teachings of Jesus and early Christianity",
    books: [
      {
        name: "Matthew",
        chapters: 28,
        description: "Gospel of Jesus' life",
        icon: "📖",
      },
      {
        name: "Mark",
        chapters: 16,
        description: "Concise account of Jesus",
        icon: "✝️",
      },
      {
        name: "Luke",
        chapters: 24,
        description: "Detailed narrative of Jesus",
        icon: "📜",
      },
      {
        name: "John",
        chapters: 21,
        description: "Theological gospel",
        icon: "🕯️",
      },
      {
        name: "Acts",
        chapters: 28,
        description: "Growth of early church",
        icon: "⛪",
      },
      {
        name: "Romans",
        chapters: 16,
        description: "Theological foundations",
        icon: "📖",
      },
      {
        name: "1 Corinthians",
        chapters: 16,
        description: "Church challenges",
        icon: "🤝",
      },
      {
        name: "2 Corinthians",
        chapters: 13,
        description: "Paul's apostolic defense",
        icon: "💪",
      },
      {
        name: "Galatians",
        chapters: 6,
        description: "Freedom in Christ",
        icon: "🕊️",
      },
      {
        name: "Ephesians",
        chapters: 6,
        description: "Church and Christian life",
        icon: "🏛️",
      },
      {
        name: "Philippians",
        chapters: 4,
        description: "Joy in suffering",
        icon: "😊",
      },
      {
        name: "Colossians",
        chapters: 4,
        description: "Christ's supremacy",
        icon: "👑",
      },
      {
        name: "1 Thessalonians",
        chapters: 5,
        description: "Second coming",
        icon: "🌅",
      },
      {
        name: "2 Thessalonians",
        chapters: 3,
        description: "Perseverance",
        icon: "🛡️",
      },
      {
        name: "1 Timothy",
        chapters: 6,
        description: "Church leadership",
        icon: "🤲",
      },
      {
        name: "2 Timothy",
        chapters: 4,
        description: "Faithful ministry",
        icon: "📯",
      },
      {
        name: "Titus",
        chapters: 3,
        description: "Practical Christianity",
        icon: "🤝",
      },
      {
        name: "Philemon",
        chapters: 1,
        description: "Forgiveness and reconciliation",
        icon: "❤️",
      },
      {
        name: "Hebrews",
        chapters: 13,
        description: "Christ's superior covenant",
        icon: "🕯️",
      },
      {
        name: "James",
        chapters: 5,
        description: "Faith and works",
        icon: "✋",
      },
      {
        name: "1 Peter",
        chapters: 5,
        description: "Hope in suffering",
        icon: "🕊️",
      },
      {
        name: "2 Peter",
        chapters: 3,
        description: "False teachers",
        icon: "⚠️",
      },
      {
        name: "1 John",
        chapters: 5,
        description: "Love and fellowship",
        icon: "❤️",
      },
      {
        name: "2 John",
        chapters: 1,
        description: "Walking in truth",
        icon: "🚶",
      },
      {
        name: "3 John",
        chapters: 1,
        description: "Supporting missionaries",
        icon: "🤲",
      },
      {
        name: "Jude",
        chapters: 1,
        description: "Contending for faith",
        icon: "🛡️",
      },
      {
        name: "Revelation",
        chapters: 22,
        description: "Apocalyptic prophecy",
        icon: "🌟",
      },
    ],
  },
];

export default function BooksScreen() {
  // Use the AppContext
  const { isDarkMode, currentLanguage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Theme colors
  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626", // Tailwind red-600
    secondary: isDarkMode ? "#333333" : "#e2e8f0",
    accent: "#f59e0b",
    searchBackground: isDarkMode ? "#2c2c2c" : "#f1f5f9",
  };

  // Filter and memoize books
  const filteredSections = useMemo(() => {
    return bibleSections
      .map((section) => ({
        ...section,
        books: section.books.filter(
          (book) =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.books.length > 0);
  }, [searchQuery]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Render book item
  const renderBookItem = ({
    item: book,
  }: {
    item: {
      name: string;
      chapters: number;
      description: string;
      icon: string;
    };
  }) => (
    <TouchableOpacity
      style={[
        styles.bookItem,
        {
          backgroundColor: theme.background,
          borderColor: theme.secondary,
        },
      ]}
    >
      <Text style={styles.bookIcon}>{book.icon}</Text>
      <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1}>
        {book.name.replace(/^\d+\.\s*/, "")}
      </Text>
      <Text
        style={[styles.bookChapters, { color: theme.text }]}
        numberOfLines={1}
      >
        {book.chapters} ch
      </Text>
    </TouchableOpacity>
  );

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
              borderColor: theme.secondary,
            },
          ]}
          placeholder="Search books..."
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item: section }) => (
          <View
            key={section.id}
            style={[
              styles.sectionContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.secondary,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {section.title}
              </Text>
              <ChevronRight
                stroke={theme.text}
                style={[
                  styles.chevron,
                  {
                    transform: [
                      {
                        rotate: expandedSections.includes(section.id)
                          ? "90deg"
                          : "0deg",
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>

            <Text style={[styles.sectionDescription, { color: theme.text }]}>
              {section.description}
            </Text>

            {expandedSections.includes(section.id) && (
              <FlatList
                data={section.books}
                keyExtractor={(item) => item.name}
                renderItem={renderBookItem}
                numColumns={3}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridContainer}
              />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              No books found
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.text }]}>
              Try a different search term
            </Text>
          </View>
        )}
      />
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
  sectionContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: "90%",
    margin: "auto",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chevron: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  gridContainer: {
    alignItems: "stretch",
  },
  gridRow: {
    justifyContent: "space-between",
  },
  bookItem: {
    width: Dimensions.get("window").width / 3.7,
    aspectRatio: 0.8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 12,
    opacity: 0.7,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
