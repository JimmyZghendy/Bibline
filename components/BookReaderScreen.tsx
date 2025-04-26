import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Search, Filter, Book } from 'react-native-feather';

// Import the AppContext
import { useAppContext } from '@/contexts/AppContext';

// Example Bible content (you would replace this with actual content fetch)
const generateChapterContent = (bookName: string, chapterNum: number) => {
  return {
    title: `${bookName} Chapter ${chapterNum}`,
    verses: Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      text: `This is verse ${i + 1} of chapter ${chapterNum} in the book of ${bookName}.`,
    })),
  };
};

export default function BookReaderScreen() {
  const { isDarkMode } = useAppContext();
  const params = useLocalSearchParams();
  const { bookName = 'Unknown', totalChapters = '1', icon = '📖' } = params;
  const totalChaptersStr = Array.isArray(totalChapters) ? totalChapters[0] : totalChapters;
  const totalChaptersNum = parseInt(totalChaptersStr, 10);
  const isValidTotalChapters = !isNaN(totalChaptersNum) && totalChaptersNum > 0;
  
  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChapterFilter, setShowChapterFilter] = useState(false);
  
  // Theme colors
  const theme = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#121212',
    card: isDarkMode ? '#1e1e1e' : '#f5f5f5',
    primary: '#dc2626', // Tailwind red-600
    secondary: isDarkMode ? '#333333' : '#e2e8f0',
    accent: '#f59e0b',
    searchBackground: isDarkMode ? '#2c2c2c' : '#f1f5f9',
  };

  const bookNameStr = Array.isArray(bookName) ? bookName[0] : bookName;

  // Get chapter content
  const chapterContent = useMemo(() => {
    return generateChapterContent(bookNameStr, currentChapter);
  }, [bookNameStr, currentChapter]);

  // Filter verses by search query
  const filteredVerses = useMemo(() => {
    if (!searchQuery) return chapterContent.verses;
    return chapterContent.verses.filter(verse => 
      verse.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chapterContent.verses, searchQuery]);

  // Navigate to chapter
  const goToChapter = (chapterNum: string | number) => {
    const num = parseInt(chapterNum as string, 10);
    if (num >= 1 && num <= totalChaptersNum) {
      setCurrentChapter(num);
      setShowChapterFilter(false);
    }
  };

  // Generate chapter numbers for picker
  const chapterNumbers = Array.from(
    { length: totalChaptersNum },
    (_, i) => i + 1
  );

  // Navigation
  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
        },
      ]}
    >
      <RNStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        translucent={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ChevronLeft stroke={theme.text} width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.icon]}>{icon}</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {bookName}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowChapterFilter(!showChapterFilter)}
        >
          <Filter stroke={theme.text} width={20} height={20} />
        </TouchableOpacity>
      </View>

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
        <View style={[styles.chapterFilterContainer, { backgroundColor: theme.card }]}>
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
                      color:
                        currentChapter === num
                          ? '#ffffff'
                          : theme.text,
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
          {chapterContent.title}
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
      <View style={[styles.navigationContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: currentChapter > 1 ? theme.primary : theme.secondary,
              opacity: currentChapter > 1 ? 1 : 0.5,
            },
          ]}
          onPress={() => currentChapter > 1 && goToChapter(currentChapter - 1)}
          disabled={currentChapter <= 1}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: currentChapter > 1 ? '#ffffff' : theme.text },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.chapterIndicator, { backgroundColor: theme.secondary }]}>
          <Text style={[styles.chapterIndicatorText, { color: theme.text }]}>
            {currentChapter} / {totalChapters}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: currentChapter < totalChaptersNum ? theme.primary : theme.secondary,
              opacity: currentChapter < totalChaptersNum ? 1 : 0.5,
            },
          ]}
          onPress={() => currentChapter < totalChaptersNum && goToChapter(currentChapter + 1)}
          disabled={currentChapter >= totalChaptersNum}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: currentChapter < totalChaptersNum ? '#ffffff' : theme.text },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    position: 'absolute',
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chapterButton: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  chapterButtonText: {
    fontWeight: 'bold',
  },
  chapterTitleContainer: {
    alignItems: 'center',
    padding: 15,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  verseNumber: {
    fontWeight: 'bold',
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: {
    fontWeight: 'bold',
  },
  chapterIndicator: {
    padding: 10,
    borderRadius: 5,
  },
  chapterIndicatorText: {
    fontWeight: 'bold',
  },
});