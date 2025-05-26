import React from "react";
import { View } from "react-native";

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
