import React from "react";
import { useLocalSearchParams } from "expo-router";
import BookReaderScreen from "@/components/BookReaderScreen";

export default function Book() {
  const params = useLocalSearchParams();

  return (
    <BookReaderScreen
      bookId={params.bookId as string}
      icon={params.icon as string}
    />
  );
}
