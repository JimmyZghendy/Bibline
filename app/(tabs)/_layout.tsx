import React from "react";
import { View } from "react-native";

import { NavbarWithSidebar } from "@/components/NavbarWithSidebar";
import { LanguageAwareTabs } from "@/components/LanguageAwareTabBar";

export default function TabLayout() {
  return (
      <View style={{ flex: 1 }}>
        <NavbarWithSidebar />
        <LanguageAwareTabs/>
      </View>
  );
}
