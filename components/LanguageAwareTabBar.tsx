import { Tabs } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/contexts/AppContext";
import { BookOpen, Compass } from "react-native-feather";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";


const tabTranslations = {
    en: { home: "Home", books: "Books", explore: "Explore" },
    fr: { home: "Accueil", books: "Livres", explore: "Explorer" },
    ar: { home: "الرئيسية", books: "الكتب", explore: "استكشف" }
  };
  
  export const LanguageAwareTabs = () => {
    const colorScheme = useColorScheme();
    const { isDarkMode, currentLanguage } = useAppContext();
    const t = tabTranslations[currentLanguage.code] || tabTranslations.en;
  
    return (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t.home,
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="books"
            options={{
              title: t.books,
              tabBarIcon: ({ color }) => <BookOpen color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: t.explore,
              tabBarIcon: ({ color }) => <Compass color={color} />,
            }}
          />
        </Tabs>
    )};