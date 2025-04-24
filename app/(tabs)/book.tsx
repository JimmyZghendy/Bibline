import { StyleSheet, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BibleBooksScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="book.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bible Books</ThemedText>
      </ThemedView>
      <ThemedText>Explore books from the Old and New Testament.</ThemedText>
      
      {/* Old Testament Section */}
      <Collapsible title="Old Testament">
        <ThemedText type="defaultSemiBold">Torah (Pentateuch)</ThemedText>
        <ThemedText style={styles.bookList}>
          Genesis • Exodus • Leviticus • Numbers • Deuteronomy
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Historical Books</ThemedText>
        <ThemedText style={styles.bookList}>
          Joshua • Judges • Ruth • 1 Samuel • 2 Samuel • 1 Kings • 2 Kings • 
          1 Chronicles • 2 Chronicles • Ezra • Nehemiah • Esther
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Wisdom Literature</ThemedText>
        <ThemedText style={styles.bookList}>
          Job • Psalms • Proverbs • Ecclesiastes • Song of Solomon
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Major Prophets</ThemedText>
        <ThemedText style={styles.bookList}>
          Isaiah • Jeremiah • Lamentations • Ezekiel • Daniel
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Minor Prophets</ThemedText>
        <ThemedText style={styles.bookList}>
          Hosea • Joel • Amos • Obadiah • Jonah • Micah • Nahum • 
          Habakkuk • Zephaniah • Haggai • Zechariah • Malachi
        </ThemedText>
        
        <ExternalLink href="https://www.bible.com/bible/111/GEN.1.NIV">
          <ThemedText type="link">Read the Old Testament</ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* New Testament Section */}
      <Collapsible title="New Testament">
        <ThemedText type="defaultSemiBold">Gospels</ThemedText>
        <ThemedText style={styles.bookList}>
          Matthew • Mark • Luke • John
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Historical</ThemedText>
        <ThemedText style={styles.bookList}>
          Acts
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Pauline Epistles</ThemedText>
        <ThemedText style={styles.bookList}>
          Romans • 1 Corinthians • 2 Corinthians • Galatians • Ephesians • 
          Philippians • Colossians • 1 Thessalonians • 2 Thessalonians • 
          1 Timothy • 2 Timothy • Titus • Philemon
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>General Epistles</ThemedText>
        <ThemedText style={styles.bookList}>
          Hebrews • James • 1 Peter • 2 Peter • 1 John • 2 John • 3 John • Jude
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Apocalyptic</ThemedText>
        <ThemedText style={styles.bookList}>
          Revelation
        </ThemedText>
        
        <ExternalLink href="https://www.bible.com/bible/111/MAT.1.NIV">
          <ThemedText type="link">Read the New Testament</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Study Resources">
        <ThemedText>
          Use these resources to enhance your Bible reading experience:
        </ThemedText>
        <ThemedText style={styles.resourceList}>
          • Concordances{'\n'}
          • Commentaries{'\n'}
          • Bible Dictionaries{'\n'}
          • Maps & Historical Context{'\n'}
          • Original Language Studies
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText style={styles.appTip}>
              You can bookmark your favorite passages for quick access later.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 4,
  },
  bookList: {
    marginBottom: 10,
    lineHeight: 22,
  },
  resourceList: {
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 24,
  },
  appTip: {
    marginTop: 12,
    fontStyle: 'italic',
  }
});