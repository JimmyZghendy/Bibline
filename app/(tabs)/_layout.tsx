import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BookOpen, Compass } from "react-native-feather";

// Import the new context provider and NavbarWithSidebar
import { AppContextProvider } from "@/contexts/AppContext";
import { NavbarWithSidebar } from "@/components/NavbarWithSidebar";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppContextProvider>
      <View style={{ flex: 1 }}>
        <NavbarWithSidebar />
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
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => <Compass color={color} />,
            }}
          />
          <Tabs.Screen
            name="books"
            options={{
              title: "Books",
              tabBarIcon: ({ color }) => <BookOpen color={color} />,
            }}
          />
        </Tabs>
      </View>
    </AppContextProvider>
  );
}
