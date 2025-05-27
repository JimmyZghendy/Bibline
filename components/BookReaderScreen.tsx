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
  I18nManager,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, Search, Filter, Book, X } from "react-native-feather";
import { useAppContext } from "@/contexts/AppContext";
import { getBookById, BibleBook, Chapter, Verse } from "@/data/BibleManager";

export default function BookReaderScreen({
  bookId = "genesis",
  language = "ar",
  isDarkMode = true
}: {
  bookId?: string;
  language?: string;
  isDarkMode?: boolean;
}) {
  const bookData = getBookById(language, bookId);

  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChapterFilter, setShowChapterFilter] = useState(false);
  const [chapterFilterQuery, setChapterFilterQuery] = useState("");

  const isRTL = language === "ar";

  const localization = {
    ar: {
      search: "ابحث عن كلمة، فصل، النطاق: 2-14",
      selectChapter: "اختر الفصل",
      chapter: "فصل",
      previous: "السابق",
      next: "التالي",
      noResults: "لا توجد آيات تطابق",
      bookNotFound: "الكتاب غير موجود",
      filterChapter: "البحث عن الفصل",
      clear: "مسح",
      close: "إغلاق"
    },
    en: {
      search: "Search a word, verse, range: 2-14",
      selectChapter: "Select Chapter",
      chapter: "Chapter",
      previous: "Previous",
      next: "Next",
      noResults: "No verses found matching",
      bookNotFound: "Book not found",
      filterChapter: "Filter chapter",
      clear: "Clear",
      close: "Close"
    },
    fr: {
      search: "Rechercher un mot, un verse, entre : 2-14",
      selectChapter: "Sélectionner un chapitre",
      chapter: "Chapitre",
      previous: "Précédent",
      next: "Suivant",
      noResults: "Aucun verset trouvé correspondant",
      bookNotFound: "Livre non trouvé",
      filterChapter: "Filtrer le chapitre",
      clear: "Effacer",
      close: "Fermer"
    }
  };

  const getText = (key: keyof typeof localization.en) => {
    return (localization[language as 'ar' | 'en'] || localization.en)[key];
  };

  const convertToArabicNumerals = (num: number) => {
    if (!isRTL) return num.toString();
    
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map((digit: string) => 
      !isNaN(parseInt(digit)) ? arabicNumerals[parseInt(digit)] : digit
    ).join('');
  };

  const formatNumber = (num: number) => {
    return isRTL ? convertToArabicNumerals(num) : num.toString();
  };

  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626",
    secondary: isDarkMode ? "#333333" : "#e2e8f0",
    accent: "#f59e0b",
    searchBackground: isDarkMode ? "#2c2c2c" : "#f1f5f9",
  };

  if (!bookData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.noResultsText, { color: theme.text }]}>
          {getText("bookNotFound")}
        </Text>
      </SafeAreaView>
    );
  }

  const currentChapterContent = bookData.chapters.find(
    (chapter) => chapter.number === currentChapter
  );

  const filteredVerses = useMemo(() => {
    if (!searchQuery || !currentChapterContent) return currentChapterContent?.verses || [];
    
    // Check if the query is a verse number (e.g., "5")
    if (/^\d+$/.test(searchQuery)) {
      return currentChapterContent.verses.filter(
        (verse) => verse.number.toString() === searchQuery
      );
    }
    
    // Check if the query is a verse range (e.g., "5-7")
    const rangeMatch = searchQuery.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      if (start <= end) {
        return currentChapterContent.verses.filter(
          (verse) => verse.number >= start && verse.number <= end
        );
      }
    }
    
    // Default to text search
    return currentChapterContent.verses.filter((verse) =>
      verse.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentChapterContent?.verses, searchQuery]);

  const goToChapter = (chapterNum: number) => {
    if (chapterNum >= 1 && chapterNum <= bookData.chapters.length) {
      setCurrentChapter(chapterNum);
      setShowChapterFilter(false);
      setChapterFilterQuery("");
    }
  };

  const filteredChapters = useMemo(() => {
    if (!chapterFilterQuery) return bookData.chapters;
    const query = chapterFilterQuery.toLowerCase();
    return bookData.chapters.filter((chapter) =>
      chapter.number.toString().includes(query)
    );
  }, [bookData.chapters, chapterFilterQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearChapterFilter = () => {
    setChapterFilterQuery("");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
        <Search 
          stroke={theme.text} 
          style={[styles.searchIcon, isRTL ? styles.searchIconRTL : styles.searchIconLTR]} 
          opacity={0.7} 
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.searchBackground,
              color: theme.text,
              borderColor: theme.secondary,
            },
            isRTL ? { paddingRight: 40, paddingLeft: 15, textAlign: 'right' } : { paddingLeft: 40, paddingRight: 15 }
          ]}
          placeholder={getText("search")}
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={isRTL ? 'right' : 'left'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, isRTL ? { left: 15 } : { right: 15 }]}
            onPress={clearSearch}
          >
            <X stroke={theme.text} width={18} height={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* Chapter Filter */}
      {showChapterFilter && (
        <View style={[styles.chapterFilterContainer, { backgroundColor: theme.card }]}>
          <View style={[styles.chapterFilterHeader, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
            <Text style={[styles.filterTitle, { color: theme.text }, isRTL ? { textAlign: 'right' } : {}]}>
              {getText("selectChapter")}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowChapterFilter(false)}
            >
              <Text style={{ color: theme.primary }}>{getText("close")}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.chapterSearchContainer, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
            <Search 
              stroke={theme.text} 
              style={[styles.chapterSearchIcon, isRTL ? styles.searchIconRTL : styles.searchIconLTR]} 
              width={16} 
              height={16} 
              opacity={0.7} 
            />
            <TextInput
              style={[
                styles.chapterSearchInput,
                {
                  backgroundColor: theme.searchBackground,
                  color: theme.text,
                  borderColor: theme.secondary,
                },
                isRTL ? { paddingRight: 40, paddingLeft: 15, textAlign: 'right' } : { paddingLeft: 40, paddingRight: 15 }
              ]}
              placeholder={getText("filterChapter")}
              placeholderTextColor={theme.text}
              value={chapterFilterQuery}
              onChangeText={setChapterFilterQuery}
              keyboardType="numeric"
              textAlign={isRTL ? 'right' : 'left'}
            />
            {chapterFilterQuery.length > 0 && (
              <TouchableOpacity
                style={[styles.chapterClearButton, isRTL ? { left: 15 } : { right: 15 }]}
                onPress={clearChapterFilter}
              >
                <X stroke={theme.text} width={16} height={16} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.chapterGrid}>
            {filteredChapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.number}
                style={[
                  styles.chapterButton,
                  {
                    backgroundColor:
                      currentChapter === chapter.number ? theme.primary : theme.secondary,
                  },
                ]}
                onPress={() => goToChapter(chapter.number)}
              >
                <Text
                  style={[
                    styles.chapterButtonText,
                    {
                      color: currentChapter === chapter.number ? "#ffffff" : theme.text,
                    },
                  ]}
                >
                  {formatNumber(chapter.number)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Chapter Title */}
      <View style={styles.chapterTitleContainer}>
        <Text style={[styles.chapterTitle, { color: theme.text }]}>
          {isRTL ? (
            `${bookData.name} ${getText("chapter")} ${formatNumber(currentChapter)}`
          ) : (
            `${bookData.name} ${getText("chapter")} ${currentChapter}`
          )}
        </Text>
      </View>

      {/* Chapter Content */}
      <ScrollView style={styles.contentContainer}>
        {filteredVerses.length > 0 ? (
          filteredVerses.map((verse) => (
            <View 
              key={verse.number} 
              style={[styles.verseContainer, isRTL ? styles.verseContainerRTL : styles.verseContainerLTR]}
            >
              <Text 
                style={[
                  styles.verseNumber, 
                  { color: theme.primary },
                  isRTL ? styles.verseNumberRTL : {}
                ]}
              >
                {formatNumber(verse.number)}
              </Text>
              <Text 
                style={[
                  styles.verseText, 
                  { color: theme.text },
                  isRTL ? { textAlign: 'right' } : {}
                ]}
              >
                {verse.text}
              </Text>
            </View>
          ))
        ) : searchQuery ? (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              {`${getText("noResults")} "${searchQuery}"`}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Navigation Buttons */}
      <View
        style={[
          styles.navigationContainer, 
          { backgroundColor: theme.card },
          isRTL ? { flexDirection: "row-reverse" } : {}
        ]}
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
            {getText("previous")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chapterIndicator,
            { backgroundColor: theme.secondary },
          ]}
          onPress={() => setShowChapterFilter(!showChapterFilter)}
        >
          <Text style={[styles.chapterIndicatorText, { color: theme.text }]}>
            {formatNumber(currentChapter)} / {formatNumber(bookData.chapters.length)}
          </Text>
        </TouchableOpacity>

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
            {getText("next")}
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
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    zIndex: 1,
  },
  searchIconLTR: {
    left: 25,
  },
  searchIconRTL: {
    right: 25,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  clearButton: {
    position: "absolute",
    zIndex: 1,
  },
  chapterFilterContainer: {
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  chapterFilterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  chapterSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  chapterSearchIcon: {
    position: "absolute",
    zIndex: 1,
  },
  chapterSearchInput: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  chapterClearButton: {
    position: "absolute",
    zIndex: 1,
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
    width: "100%",
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  verseContainer: {
    marginBottom: 15,
  },
  verseContainerLTR: {
    flexDirection: "row",
  },
  verseContainerRTL: {
    flexDirection: "row-reverse",
  },
  verseNumber: {
    fontWeight: "bold",
    fontSize: 16,
    minWidth: 25,
  },
  verseNumberRTL: {
    marginRight: 0,
    marginLeft: 10,
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