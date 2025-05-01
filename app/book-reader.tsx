import React from "react";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import BookReaderScreen from "@/components/BookReaderScreen";

export default function BookReader() {
  const params = useLocalSearchParams();

  return (
    <>
<Stack.Screen
  options={{
    headerShown: true,
    title: params.language === "ar" ? "عودة" :
          params.language === "fr" ? "Retour" : "Back"}}
/>
      <BookReaderScreen
        bookId={params.bookId as string}
        language={params.language as string}
      />
    </>
  );
}
