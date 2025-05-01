export type LanguageCode = "en" | "ar" | "fr";

export type Language = {
  code: LanguageCode;
  name: string;
};

export type Translations = {
    welcome: string;
    explore: string;
    features: string;
    language: string;
    theme: string;
    darkMode: string;
    lightMode: string;
    settings: string;
    bibleCollections: string;
    studyResources: string;
    communityLearning: string;
    aboutBibleTitle: string;
    aboutBibleText: string;
    aboutAppTitle: string;
    aboutAppText: string;
    scriptureOfDayTitle: string;
    scriptureOfDayText: string;
    bibleBenefitsTitle: string;
    bibleBenefitsText: string;
  };