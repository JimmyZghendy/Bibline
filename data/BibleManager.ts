import ar_old_testament from './ar/old_testament.json';
import ar_new_testament from './ar/new_testament.json';

import fr_old_testament from './fr/old_testament.json';
import fr_new_testament from './fr/new_testament.json';

import en_old_testament from './en/old_testament.json';
import en_new_testament from './en/new_testament.json';

export type Verse = {
  number: number;
  text: string;
};

export type Chapter = {
  number: number;
  verses: Verse[];
};

export type BibleBook = {
  id: string;
  name: string;
  testament: "Old" | "New";
  chapters: Chapter[];
};

type BibleData = {
  [language: string]: {
    old_testament: BibleBook[];
    new_testament: BibleBook[];
  };
};

const bibleData: BibleData = {
  ar: {
    old_testament: ar_old_testament as BibleBook[],
    new_testament: ar_new_testament as BibleBook[]
  },
  fr: {
    old_testament: fr_old_testament as BibleBook[],
    new_testament: fr_new_testament as BibleBook[]
  },
  en: {
    old_testament: en_old_testament as BibleBook[],
    new_testament: en_new_testament as BibleBook[]
  },
};

export const getBooksByLanguageAndTestament = (
  language: string,
  testament: "Old" | "New"
): BibleBook[] => {
  const langData = bibleData[language];
  if (!langData) return [];

  return testament === "Old"
    ? langData.old_testament
    : langData.new_testament;
};

// Function to get book by ID
export const getBookById = (
  language: string,
  id: string
): BibleBook | undefined => {
  const langData = bibleData[language];
  if (!langData) return undefined;
  
  return [...langData.old_testament, ...langData.new_testament].find(
    book => book.id.toLowerCase() === id.toLowerCase()
  );
};
