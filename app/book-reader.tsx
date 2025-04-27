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
          title: params.bookId
            ? (params.bookId as string).charAt(0).toUpperCase() +
              (params.bookId as string).slice(1)
            : "Book Reader",
        }}
      />
      <BookReaderScreen
        bookId={params.bookId as string}
        icon={params.icon as string}
      />
    </>
  );
}
