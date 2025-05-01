import React from "react";
import { Platform, View } from "react-native";

// Import the new context provider and NavbarWithSidebar
import { AppContextProvider } from "@/contexts/AppContext";
import { NavbarWithSidebar } from "@/components/NavbarWithSidebar";
import { LanguageAwareTabs } from "@/components/LanguageAwareTabBar";

export default function TabLayout() {
  return (
    <AppContextProvider>
      <View style={{ flex: 1 }}>
        <NavbarWithSidebar />
    <LanguageAwareTabs/>
      </View>
    </AppContextProvider>
  );
}
