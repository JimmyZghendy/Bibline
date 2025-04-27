import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, Search, Filter, Book } from "react-native-feather";

// Import the AppContext
import { useAppContext } from "@/contexts/AppContext";

// Import dummy Bible data
import { getBookById, BibleBook, Chapter, Verse } from "@/data/bibleDummyData";

export default function BookReaderScreen({
  bookId = "genesis",
  icon = "📖",
}: {
  bookId?: string;
  icon?: string;
}) {
  const { isDarkMode } = useAppContext();

  // Get book data
  const bookData = getBookById(bookId);

  console.log("BookReaderScreen - Input:", { bookId, icon });
  console.log("BookReaderScreen - Book Data:", bookData);

  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChapterFilter, setShowChapterFilter] = useState(false);

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

  // If no book found, return error view
  if (!bookData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.noResultsText, { color: theme.text }]}>
          Book not found
        </Text>
      </SafeAreaView>
    );
  }

  // Get current chapter content
  const currentChapterContent = bookData.chapters.find(
    (chapter) => chapter.number === currentChapter
  );

  // Filter verses by search query
  const filteredVerses = useMemo(() => {
    if (!searchQuery || !currentChapterContent)
      return currentChapterContent?.verses || [];
    return currentChapterContent.verses.filter((verse) =>
      verse.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentChapterContent?.verses, searchQuery]);

  // Navigate to chapter
  const goToChapter = (chapterNum: number) => {
    if (chapterNum >= 1 && chapterNum <= bookData.chapters.length) {
      setCurrentChapter(chapterNum);
      setShowChapterFilter(false);
    }
  };

  // Generate chapter numbers for picker
  const chapterNumbers = bookData.chapters.map((chapter) => chapter.number);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
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
          placeholder="Search in this chapter..."
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chapter Filter */}
      {showChapterFilter && (
        <View
          style={[
            styles.chapterFilterContainer,
            { backgroundColor: theme.card },
          ]}
        >
          <Text style={[styles.filterTitle, { color: theme.text }]}>
            Select Chapter
          </Text>
          <View style={styles.chapterGrid}>
            {chapterNumbers.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.chapterButton,
                  {
                    backgroundColor:
                      currentChapter === num ? theme.primary : theme.secondary,
                  },
                ]}
                onPress={() => goToChapter(num)}
              >
                <Text
                  style={[
                    styles.chapterButtonText,
                    {
                      color: currentChapter === num ? "#ffffff" : theme.text,
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Chapter Title */}
      <View style={styles.chapterTitleContainer}>
        <Text style={[styles.chapterTitle, { color: theme.text }]}>
          {bookData.name} Chapter {currentChapter}
        </Text>
      </View>

      {/* Chapter Content */}
      <ScrollView style={styles.contentContainer}>
        {filteredVerses.length > 0 ? (
          filteredVerses.map((verse) => (
            <View key={verse.number} style={styles.verseContainer}>
              <Text style={[styles.verseNumber, { color: theme.primary }]}>
                {verse.number}
              </Text>
              <Text style={[styles.verseText, { color: theme.text }]}>
                {verse.text}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              No verses found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View
        style={[styles.navigationContainer, { backgroundColor: theme.card }]}
      >
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                currentChapter > 1 ? theme.primary : theme.secondary,
              opacity: currentChapter > 1 ? 1 : 0.5,
            },
          ]}
          onPress={() => currentChapter > 1 && goToChapter(currentChapter - 1)}
          disabled={currentChapter <= 1}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: currentChapter > 1 ? "#ffffff" : theme.text },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.chapterIndicator,
            { backgroundColor: theme.secondary },
          ]}
        >
          <Text style={[styles.chapterIndicatorText, { color: theme.text }]}>
            {currentChapter} / {bookData.chapters.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                currentChapter < bookData.chapters.length
                  ? theme.primary
                  : theme.secondary,
              opacity: currentChapter < bookData.chapters.length ? 1 : 0.5,
            },
          ]}
          onPress={() =>
            currentChapter < bookData.chapters.length &&
            goToChapter(currentChapter + 1)
          }
          disabled={currentChapter >= bookData.chapters.length}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentChapter < bookData.chapters.length
                    ? "#ffffff"
                    : theme.text,
              },
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    position: "absolute",
    left: 25,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 15,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  chapterFilterContainer: {
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chapterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  chapterButton: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
  },
  chapterButtonText: {
    fontWeight: "bold",
  },
  chapterTitleContainer: {
    alignItems: "center",
    padding: 15,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  verseContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  verseNumber: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    minWidth: 25,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: {
    fontWeight: "bold",
  },
  chapterIndicator: {
    padding: 10,
    borderRadius: 5,
  },
  chapterIndicatorText: {
    fontWeight: "bold",
  },
});
