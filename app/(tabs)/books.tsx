import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  TextInput,
  FlatList,
  Dimensions,
  I18nManager,
} from "react-native";
import { Book, Search, ChevronRight } from "react-native-feather";
import { router } from "expo-router";
import { useAppContext } from "@/contexts/AppContext";
import { getBooksByLanguageAndTestament } from "@/data/BibleManager";

const translations = {
  en: {
    searchPlaceholder: "Search books...",
    oldTestament: "Old Testament",
    oldTestamentDesc: "Foundational texts of faith and history",
    newTestament: "New Testament",
    newTestamentDesc: "Life and teachings of Jesus and early Christianity",
    noResults: "No books found",
    tryDifferent: "Try a different search term",
    chapters: "ch",
  },
  ar: {
    searchPlaceholder: "ابحث عن كتب...",
    oldTestament: "العهد القديم",
    oldTestamentDesc: "نصوص أساسية للإيمان والتاريخ",
    newTestament: "العهد الجديد",
    newTestamentDesc: "حياة وتعاليم يسوع والمسيحية المبكرة",
    noResults: "لا توجد كتب",
    tryDifferent: "جرب كلمة بحث مختلفة",
    chapters: "فصل",
  },
  fr: {
    searchPlaceholder: "Rechercher des livres...",
    oldTestament: "Ancien Testament",
    oldTestamentDesc: "Textes fondateurs de la foi et de l'histoire",
    newTestament: "Nouveau Testament",
    newTestamentDesc:
      "Vie et enseignements de Jésus et du christianisme primitif",
    noResults: "Aucun livre trouvé",
    tryDifferent: "Essayez un autre terme de recherche",
    chapters: "ch",
  },
};

const bookTranslations = {
  en: {
    names: {
      // Old Testament
      Genesis: "Genesis",
      Exodus: "Exodus",
      Leviticus: "Leviticus",
      Numbers: "Numbers",
      Deuteronomy: "Deuteronomy",
      Joshua: "Joshua",
      Judges: "Judges",
      Ruth: "Ruth",
      "I Samuel": "I Samuel",
      "II Samuel": "II Samuel",
      "I Kings": "I Kings",
      "II Kings": "II Kings",
      "I Chronicles": "I Chronicles",
      "II Chronicles": "II Chronicles",
      Ezra: "Ezra",
      Nehemiah: "Nehemiah",
      Esther: "Esther",
      Job: "Job",
      Psalms: "Psalms",
      Proverbs: "Proverbs",
      Ecclesiastes: "Ecclesiastes",
      "Song of Solomon": "Song of Solomon",
      Isaiah: "Isaiah",
      Jeremiah: "Jeremiah",
      Lamentations: "Lamentations",
      Ezekiel: "Ezekiel",
      Daniel: "Daniel",
      Hosea: "Hosea",
      Joel: "Joel",
      Amos: "Amos",
      Obadiah: "Obadiah",
      Jonah: "Jonah",
      Micah: "Micah",
      Nahum: "Nahum",
      Habakkuk: "Habakkuk",
      Zephaniah: "Zephaniah",
      Haggai: "Haggai",
      Zechariah: "Zechariah",
      Malachi: "Malachi",

      // New Testament
      Matthew: "Matthew",
      Mark: "Mark",
      Luke: "Luke",
      John: "John",
      Acts: "Acts",
      Romans: "Romans",
      "I Corinthians": "I Corinthians",
      "II Corinthians": "II Corinthians",
      Galatians: "Galatians",
      Ephesians: "Ephesians",
      Philippians: "Philippians",
      Colossians: "Colossians",
      "I Thessalonians": "I Thessalonians",
      "II Thessalonians": "II Thessalonians",
      "I Timothy": "1 Timothy",
      "II Timothy": "II Timothy",
      Titus: "Titus",
      Philemon: "Philemon",
      Hebrews: "Hebrews",
      James: "James",
      "I Peter": "I Peter",
      "II Peter": "II Peter",
      "I John": "I John",
      "II John": "II John",
      "III John": "III John",
      Jude: "Jude",
      Revelation: "Revelation",
    },
    descriptions: {
      Genesis: "Creation and early human history",
      Exodus: "Liberation and covenant",
      Leviticus: "Priestly laws and regulations",
      Numbers: "Wilderness wanderings",
      Deuteronomy: "Moses' final instructions",
      Joshua: "Conquest of Canaan",
      Judges: "Period of the judges",
      Ruth: "Story of loyalty and redemption",
      "I Samuel": "Rise of the monarchy",
      "II Samuel": "David's reign",
      "I Kings": "Solomon and divided kingdom",
      "II Kings": "Fall of Israel and Judah",
      "I Chronicles": "Genealogies and David's reign",
      "II Chronicles": "Kingdom of Judah",
      Ezra: "Return from Babylonian exile",
      Nehemiah: "Rebuilding Jerusalem",
      Esther: "Jewish survival in Persia",
      Job: "Suffering and faith",
      Psalms: "Poetic worship and lament",
      Proverbs: "Wisdom and moral teachings",
      Ecclesiastes: "Reflections on life's meaning",
      "Song of Solomon": "Love poetry",
      Isaiah: "Prophecy and messianic hope",
      Jeremiah: "Warnings and lamentations",
      Lamentations: "Grief over Jerusalem",
      Ezekiel: "Visions of restoration",
      Daniel: "Prophecy and divine intervention",
      Hosea: "Metaphor of God's love",
      Joel: "Day of the Lord",
      Amos: "Social justice",
      Obadiah: "Judgment on Edom",
      Jonah: "Mercy and compassion",
      Micah: "Social and religious critique",
      Nahum: "Prophecy against Nineveh",
      Habakkuk: "Dialogue with God",
      Zephaniah: "Day of judgment",
      Haggai: "Rebuilding the temple",
      Zechariah: "Messianic prophecies",
      Malachi: "Final prophetic message",

      Matthew: "Gospel of Jesus' life",
      Mark: "Concise account of Jesus",
      Luke: "Detailed narrative of Jesus",
      John: "Theological gospel",
      Acts: "Growth of early church",
      Romans: "Theological foundations",
      "I Corinthians": "Church challenges",
      "II Corinthians": "Paul's apostolic defense",
      Galatians: "Freedom in Christ",
      Ephesians: "Church and Christian life",
      Philippians: "Joy in suffering",
      Colossians: "Christ's supremacy",
      "I Thessalonians": "Second coming",
      "II Thessalonians": "Perseverance",
      "I Timothy": "Church leadership",
      "II Timothy": "Faithful ministry",
      Titus: "Practical Christianity",
      Philemon: "Forgiveness and reconciliation",
      Hebrews: "Christ's superior covenant",
      James: "Faith and works",
      "I Peter": "Hope in suffering",
      "II Peter": "False teachers",
      "I John": "Love and fellowship",
      "II John": "Walking in truth",
      "III John": "Supporting missionaries",
      Jude: "Contending for faith",
      Revelation: "Apocalyptic prophecy",
    },
  },
  ar: {
    names: {
      // Old Testament
      Genesis: "التكوين",
      Exodus: "الخروج",
      Leviticus: "اللاويين",
      Numbers: "العدد",
      Deuteronomy: "التثنية",
      Joshua: "يشوع",
      Judges: "القضاة",
      Ruth: "راعوث",
      "I Samuel": "صموئيل الأول",
      "II Samuel": "صموئيل الثاني",
      "I Kings": "ملوك الأول",
      "II Kings": "ملوك الثاني",
      "I Chronicles": "أخبار الأيام الأول",
      "II Chronicles": "أخبار الأيام الثاني",
      Ezra: "عزرا",
      Nehemiah: "نحميا",
      Esther: "أستير",
      Job: "أيوب",
      Psalms: "المزامير",
      Proverbs: "الأمثال",
      Ecclesiastes: "الجامعة",
      "Song of Solomon": "نشيد الأنشاد",
      Isaiah: "إشعياء",
      Jeremiah: "إرميا",
      Lamentations: "مراثي إرميا",
      Ezekiel: "حزقيال",
      Daniel: "دانيال",
      Hosea: "هوشع",
      Joel: "يوئيل",
      Amos: "عاموس",
      Obadiah: "عوبديا",
      Jonah: "يونان",
      Micah: "ميخا",
      Nahum: "ناحوم",
      Habakkuk: "حبقوق",
      Zephaniah: "صفنيا",
      Haggai: "حجي",
      Zechariah: "زكريا",
      Malachi: "ملاخي",

      // New Testament
      Matthew: "متى",
      Mark: "مرقس",
      Luke: "لوقا",
      John: "يوحنا",
      Acts: "أعمال الرسل",
      Romans: "رومية",
      "I Corinthians": "كورنثوس الأولى",
      "II Corinthians": "كورنثوس الثانية",
      Galatians: "غلاطية",
      Ephesians: "أفسس",
      Philippians: "فيلبي",
      Colossians: "كولوسي",
      "I Thessalonians": "تسالونيكي الأولى",
      "II Thessalonians": "تسالونيكي الثانية",
      "I Timothy": "تيموثاوس الأولى",
      "II Timothy": "تيموثاوس الثانية",
      Titus: "تيطس",
      Philemon: "فليمون",
      Hebrews: "العبرانيين",
      James: "يعقوب",
      "I Peter": "بطرس الأولى",
      "II Peter": "بطرس الثانية",
      "I John": "يوحنا الأولى",
      "II John": "يوحنا الثانية",
      "III John": "يوحنا الثالثة",
      Jude: "يهوذا",
      Revelation: "رؤيا يوحنا",
    },
    descriptions: {
      Genesis: "خلق وتاريخ البشرية المبكر",
      Exodus: "التحرير والعهد",
      Leviticus: "القوانين واللوائح الكهنوتية",
      Numbers: "ترحال في البرية",
      Deuteronomy: "تعليمات موسى الأخيرة",
      Joshua: "غزو كنعان",
      Judges: "فترة القضاة",
      Ruth: "قصة الولاء والخلاص",
      "I Samuel": "صعود الملكية",
      "II Samuel": "عهد داوود",
      "I Kings": "سليمان والمملكة المنقسمة",
      "II Kings": "سقوط إسرائيل ويهوذا",
      "I Chronicles": "أنساب وعهد داوود",
      "II Chronicles": "مملكة يهوذا",
      Ezra: "العودة من السبي البابلي",
      Nehemiah: "إعادة بناء أورشليم",
      Esther: "بقاء اليهود في بلاد فارس",
      Job: "المعاناة والإيمان",
      Psalms: "عبادة شعرية ورثاء",
      Proverbs: "تعاليم الحكمة والأخلاق",
      Ecclesiastes: "تأملات في معنى الحياة",
      "Song of Solomon": "شعر الحب",
      Isaiah: "نبوة ورجاء مسياني",
      Jeremiah: "تحذيرات ورثاء",
      Lamentations: "حزن على أورشليم",
      Ezekiel: "رؤى الاستعادة",
      Daniel: "نبوة وتدخل إلهي",
      Hosea: "استعارة لمحبة الله",
      Joel: "يوم الرب",
      Amos: "العدالة الاجتماعية",
      Obadiah: "دينونة على أدوم",
      Jonah: "الرحمة والشفقة",
      Micah: "نقد اجتماعي وديني",
      Nahum: "نبوة ضد نينوى",
      Habakkuk: "حوار مع الله",
      Zephaniah: "يوم الدينونة",
      Haggai: "إعادة بناء الهيكل",
      Zechariah: "نبوءات مسيانية",
      Malachi: "الرسالة النبوية الأخيرة",

      Matthew: "إنجيل حياة يسوع",
      Mark: "سرد موجز ليسوع",
      Luke: "سرد مفصل ليسوع",
      John: "إنجيل لاهوتي",
      Acts: "نمو الكنيسة الأولى",
      Romans: "أسس لاهوتية",
      "I Corinthians": "تحديات الكنيسة",
      "II Corinthians": "دفاع بولس الرسولي",
      Galatians: "الحرية في المسيح",
      Ephesians: "الكنيسة والحياة المسيحية",
      Philippians: "الفرح في المعاناة",
      Colossians: "سيادة المسيح",
      "I Thessalonians": "المجيء الثاني",
      "II Thessalonians": "المثابرة",
      "I Timothy": "قيادة الكنيسة",
      "II Timothy": "الخدمة الأمينة",
      Titus: "المسيحية العملية",
      Philemon: "المغفرة والمصالحة",
      Hebrews: "عهد المسيح الفائق",
      James: "الإيمان والأعمال",
      "I Peter": "الرجاء في المعاناة",
      "II Peter": "المعلمون الكذبة",
      "I John": "المحبة والشركة",
      "II John": "السير في الحق",
      "III John": "دعم المبشرين",
      Jude: "الدفاع عن الإيمان",
      Revelation: "نبوءة رؤيوية",
    },
  },
  fr: {
    names: {
      // Old Testament
      Genesis: "Genèse",
      Exodus: "Exode",
      Leviticus: "Lévitique",
      Numbers: "Nombres",
      Deuteronomy: "Deutéronome",
      Joshua: "Josué",
      Judges: "Juges",
      Ruth: "Ruth",
      "I Samuel": "I Samuel",
      "II Samuel": "II Samuel",
      "I Kings": "I Rois",
      "II Kings": "II Rois",
      "I Chronicles": "I Chroniques",
      "II Chronicles": "II Chroniques",
      Ezra: "Esdras",
      Nehemiah: "Néhémie",
      Esther: "Esther",
      Job: "Job",
      Psalms: "Psaumes",
      Proverbs: "Proverbes",
      Ecclesiastes: "Ecclésiaste",
      "Song of Solomon": "Cantique des Cantiques",
      Isaiah: "Ésaïe",
      Jeremiah: "Jérémie",
      Lamentations: "Lamentations",
      Ezekiel: "Ézéchiel",
      Daniel: "Daniel",
      Hosea: "Osée",
      Joel: "Joël",
      Amos: "Amos",
      Obadiah: "Abdias",
      Jonah: "Jonas",
      Micah: "Michée",
      Nahum: "Nahum",
      Habakkuk: "Habacuc",
      Zephaniah: "Sophonie",
      Haggai: "Aggée",
      Zechariah: "Zacharie",
      Malachi: "Malachie",

      // New Testament
      Matthew: "Matthieu",
      Mark: "Marc",
      Luke: "Luc",
      John: "Jean",
      Acts: "Actes",
      Romans: "Romains",
      "I Corinthians": "I Corinthiens",
      "II Corinthians": "II Corinthiens",
      Galatians: "Galates",
      Ephesians: "Éphésiens",
      Philippians: "Philippiens",
      Colossians: "Colossiens",
      "I Thessalonians": "1 Thessaloniciens",
      "II Thessalonians": "2 Thessaloniciens",
      "I Timothy": "I Timothée",
      "II Timothy": "II Timothée",
      Titus: "Tite",
      Philemon: "Philémon",
      Hebrews: "Hébreux",
      James: "Jacques",
      "I Peter": "I Pierre",
      "II Peter": "II Pierre",
      "I John": "I Jean",
      "II John": "II Jean",
      "III John": "III Jean",
      Jude: "Jude",
      Revelation: "Apocalypse",
    },
    descriptions: {
      Genesis: "Création et histoire humaine primitive",
      Exodus: "Libération et alliance",
      Leviticus: "Lois et règlements sacerdotaux",
      Numbers: "Errances dans le désert",
      Deuteronomy: "Dernières instructions de Moïse",
      Joshua: "Conquête de Canaan",
      Judges: "Période des juges",
      Ruth: "Histoire de loyauté et de rédemption",
      "I Samuel": "Avènement de la monarchie",
      "II Samuel": "Règne de David",
      "I Kings": "Salomon et le royaume divisé",
      "II Kings": "Chute d'Israël et de Juda",
      "I Chronicles": "Généalogies et règne de David",
      "II Chronicles": "Royaume de Juda",
      Ezra: "Retour de l'exil babylonien",
      Nehemiah: "Reconstruction de Jérusalem",
      Esther: "Survie juive en Perse",
      Job: "Souffrance et foi",
      Psalms: "Adoration poétique et lamentation",
      Proverbs: "Enseignements de sagesse et de morale",
      Ecclesiastes: "Réflexions sur le sens de la vie",
      "Song of Solomon": "Poésie d'amour",
      Isaiah: "Prophétie et espérance messianique",
      Jeremiah: "Avertissements et lamentations",
      Lamentations: "Deuil sur Jérusalem",
      Ezekiel: "Visions de restauration",
      Daniel: "Prophétie et intervention divine",
      Hosea: "Métaphore de l'amour de Dieu",
      Joel: "Jour du Seigneur",
      Amos: "Justice sociale",
      Obadiah: "Jugement sur Édom",
      Jonah: "Miséricorde et compassion",
      Micah: "Critique sociale et religieuse",
      Nahum: "Prophétie contre Ninive",
      Habakkuk: "Dialogue avec Dieu",
      Zephaniah: "Jour du jugement",
      Haggai: "Reconstruction du temple",
      Zechariah: "Prophéties messianiques",
      Malachi: "Dernier message prophétique",

      Matthew: "Évangile de la vie de Jésus",
      Mark: "Récit concis de Jésus",
      Luke: "Narratif détaillé de Jésus",
      John: "Évangile théologique",
      Acts: "Croissance de l'église primitive",
      Romans: "Fondements théologiques",
      "I Corinthians": "Défis de l'église",
      "II Corinthians": "Défense apostolique de Paul",
      Galatians: "Liberté en Christ",
      Ephesians: "Église et vie chrétienne",
      Philippians: "Joie dans la souffrance",
      Colossians: "Suprématie du Christ",
      "I Thessalonians": "Seconde venue",
      "II Thessalonians": "Persévérance",
      "I Timothy": "Direction de l'église",
      "II Timothy": "Ministère fidèle",
      Titus: "Christianisme pratique",
      Philemon: "Pardon et réconciliation",
      Hebrews: "Alliance supérieure du Christ",
      James: "Foi et œuvres",
      "I Peter": "Espoir dans la souffrance",
      "II Peter": "Faux enseignants",
      "I John": "Amour et communion",
      "II John": "Marcher dans la vérité",
      "III John": "Soutenir les missionnaires",
      Jude: "Défendre la foi",
      Revelation: "Prophétie apocalyptique",
    },
  },
};

const bibleSections = [
  {
    id: "testament1",
    title: "Old Testament",
    description: "Foundational texts of faith and history",
    books: [
      {
        id: "genesis",
        name: "Genesis",
        chapters: 50,
        description: "Creation and early human history",
        icon: "🌍",
      },
      {
        id: "exodus",
        name: "Exodus",
        chapters: 40,
        description: "Liberation and covenant",
        icon: "🕊️",
      },
      {
        id: "leviticus",
        name: "Leviticus",
        chapters: 27,
        description: "Priestly laws and regulations",
        icon: "📜",
      },
      {
        id: "numbers",
        name: "Numbers",
        chapters: 36,
        description: "Wilderness wanderings",
        icon: "🏜️",
      },
      {
        id: "deuteronomy",
        name: "Deuteronomy",
        chapters: 34,
        description: "Moses' final instructions",
        icon: "📖",
      },
      {
        id: "joshua",
        name: "Joshua",
        chapters: 24,
        description: "Conquest of Canaan",
        icon: "🏹",
      },
      {
        id: "judges",
        name: "Judges",
        chapters: 21,
        description: "Period of the judges",
        icon: "⚔️",
      },
      {
        id: "ruth",
        name: "Ruth",
        chapters: 4,
        description: "Story of loyalty and redemption",
        icon: "❤️",
      },
      {
        id: "i_samuel",
        name: "I Samuel",
        chapters: 31,
        description: "Rise of the monarchy",
        icon: "👑",
      },
      {
        id: "ii_samuel",
        name: "II Samuel",
        chapters: 24,
        description: "David's reign",
        icon: "🛡️",
      },
      {
        id: "i_kings",
        name: "I Kings",
        chapters: 22,
        description: "Solomon and divided kingdom",
        icon: "🏰",
      },
      {
        id: "ii_kings",
        name: "II Kings",
        chapters: 25,
        description: "Fall of Israel and Judah",
        icon: "🔥",
      },
      {
        id: "i_chronicles",
        name: "I Chronicles",
        chapters: 29,
        description: "Genealogies and David's reign",
        icon: "📋",
      },
      {
        id: "ii_chronicles",
        name: "II Chronicles",
        chapters: 36,
        description: "Kingdom of Judah",
        icon: "🕯️",
      },
      {
        id: "ezra",
        name: "Ezra",
        chapters: 10,
        description: "Return from Babylonian exile",
        icon: "🏛️",
      },
      {
        id: "nehemiah",
        name: "Nehemiah",
        chapters: 13,
        description: "Rebuilding Jerusalem",
        icon: "🧱",
      },
      {
        id: "esther",
        name: "Esther",
        chapters: 10,
        description: "Jewish survival in Persia",
        icon: "👑",
      },
      {
        id: "job",
        name: "Job",
        chapters: 42,
        description: "Suffering and faith",
        icon: "💔",
      },
      {
        id: "psalms",
        name: "Psalms",
        chapters: 150,
        description: "Poetic worship and lament",
        icon: "🎵",
      },
      {
        id: "proverbs",
        name: "Proverbs",
        chapters: 31,
        description: "Wisdom and moral teachings",
        icon: "🧠",
      },
      {
        id: "ecclesiastes",
        name: "Ecclesiastes",
        chapters: 12,
        description: "Reflections on life's meaning",
        icon: "🤔",
      },
      {
        id: "song_of_solomon",
        name: "Song of Solomon",
        chapters: 8,
        description: "Love poetry",
        icon: "❤️",
      },
      {
        id: "isaiah",
        name: "Isaiah",
        chapters: 66,
        description: "Prophecy and messianic hope",
        icon: "🕊️",
      },
      {
        id: "jeremiah",
        name: "Jeremiah",
        chapters: 52,
        description: "Warnings and lamentations",
        icon: "😢",
      },
      {
        id: "lamentations",
        name: "Lamentations",
        chapters: 5,
        description: "Grief over Jerusalem",
        icon: "😭",
      },
      {
        id: "ezekiel",
        name: "Ezekiel",
        chapters: 48,
        description: "Visions of restoration",
        icon: "👁️",
      },
      {
        id: "daniel",
        name: "Daniel",
        chapters: 12,
        description: "Prophecy and divine intervention",
        icon: "🦁",
      },
      {
        id: "hosea",
        name: "Hosea",
        chapters: 14,
        description: "Metaphor of God's love",
        icon: "❤️",
      },
      { 
        id: "joel", 
        name: "Joel", 
        chapters: 3, 
        description: "Day of the Lord", 
        icon: "🌪️" 
      },
      { 
        id: "amos", 
        name: "Amos", 
        chapters: 9, 
        description: "Social justice", 
        icon: "⚖️" 
      },
      {
        id: "obadiah",
        name: "Obadiah",
        chapters: 1,
        description: "Judgment on Edom",
        icon: "🏔️",
      },
      {
        id: "jonah",
        name: "Jonah",
        chapters: 4,
        description: "Mercy and compassion",
        icon: "🐳",
      },
      {
        id: "micah",
        name: "Micah",
        chapters: 7,
        description: "Social and religious critique",
        icon: "🗣️",
      },
      {
        id: "nahum",
        name: "Nahum",
        chapters: 3,
        description: "Prophecy against Nineveh",
        icon: "🏙️",
      },
      {
        id: "habakkuk",
        name: "Habakkuk",
        chapters: 3,
        description: "Dialogue with God",
        icon: "🤲",
      },
      {
        id: "zephaniah",
        name: "Zephaniah",
        chapters: 3,
        description: "Day of judgment",
        icon: "🌋",
      },
      {
        id: "haggai",
        name: "Haggai",
        chapters: 2,
        description: "Rebuilding the temple",
        icon: "🏗️",
      },
      {
        id: "zechariah",
        name: "Zechariah",
        chapters: 14,
        description: "Messianic prophecies",
        icon: "🕯️",
      },
      {
        id: "malachi",
        name: "Malachi",
        chapters: 4,
        description: "Final prophetic message",
        icon: "📯",
      },
    ],
  },
  {
    id: "testament2",
    title: "New Testament",
    description: "Life and teachings of Jesus and early Christianity",
    books: [
      {
        id: "matthew",
        name: "Matthew",
        chapters: 28,
        description: "Gospel of Jesus' life",
        icon: "👼",
      },
      {
        id: "mark",
        name: "Mark",
        chapters: 16,
        description: "Concise account of Jesus",
        icon: "🦁",
      },
      {
        id: "luke",
        name: "Luke",
        chapters: 24,
        description: "Detailed narrative of Jesus",
        icon: "🐂",
      },
      {
        id: "john",
        name: "John",
        chapters: 21,
        description: "Theological gospel",
        icon: " 🦅",
      },
      {
        id: "acts",
        name: "Acts",
        chapters: 28,
        description: "Growth of early church",
        icon: "⛪",
      },
      {
        id: "romans",
        name: "Romans",
        chapters: 16,
        description: "Theological foundations",
        icon: "📖",
      },
      {
        id: "i_corinthians",
        name: "I Corinthians",
        chapters: 16,
        description: "Church challenges",
        icon: "🤝",
      },
      {
        id: "ii_corinthians",
        name: "II Corinthians",
        chapters: 13,
        description: "Paul's apostolic defense",
        icon: "💪",
      },
      {
        id: "galatians",
        name: "Galatians",
        chapters: 6,
        description: "Freedom in Christ",
        icon: "🕊️",
      },
      {
        id: "ephesians",
        name: "Ephesians",
        chapters: 6,
        description: "Church and Christian life",
        icon: "🏛️",
      },
      {
        id: "philippians",
        name: "Philippians",
        chapters: 4,
        description: "Joy in suffering",
        icon: "😊",
      },
      {
        id: "colossians",
        name: "Colossians",
        chapters: 4,
        description: "Christ's supremacy",
        icon: "👑",
      },
      {
        id: "i_thessalonians",
        name: "I Thessalonians",
        chapters: 5,
        description: "Second coming",
        icon: "🌅",
      },
      {
        id: "ii_thessalonians",
        name: "II Thessalonians",
        chapters: 3,
        description: "Perseverance",
        icon: "🛡️",
      },
      {
        id: "i_timothy",
        name: "I Timothy",
        chapters: 6,
        description: "Church leadership",
        icon: "🤲",
      },
      {
        id: "ii_timothy",
        name: "II Timothy",
        chapters: 4,
        description: "Faithful ministry",
        icon: "📯",
      },
      {
        id: "titus",
        name: "Titus",
        chapters: 3,
        description: "Practical Christianity",
        icon: "🤝",
      },
      {
        id: "philemon",
        name: "Philemon",
        chapters: 1,
        description: "Forgiveness and reconciliation",
        icon: "❤️",
      },
      {
        id: "hebrews",
        name: "Hebrews",
        chapters: 13,
        description: "Christ's superior covenant",
        icon: "🕯️",
      },
      {
        id: "james",
        name: "James",
        chapters: 5,
        description: "Faith and works",
        icon: "✋",
      },
      {
        id: "i_peter",
        name: "I Peter",
        chapters: 5,
        description: "Hope in suffering",
        icon: "🕊️",
      },
      {
        id: "ii_peter",
        name: "II Peter",
        chapters: 3,
        description: "False teachers",
        icon: "⚠️",
      },
      {
        id: "i_john",
        name: "I John",
        chapters: 5,
        description: "Love and fellowship",
        icon: "❤️",
      },
      {
        id: "ii_john",
        name: "II John",
        chapters: 1,
        description: "Walking in truth",
        icon: "🚶",
      },
      {
        id: "iii_john",
        name: "III John",
        chapters: 1,
        description: "Supporting missionaries",
        icon: "🤲",
      },
      {
        id: "jude",
        name: "Jude",
        chapters: 1,
        description: "Contending for faith",
        icon: "🛡️",
      },
      {
        id: "revelation",
        name: "Revelation",
        chapters: 22,
        description: "Apocalyptic prophecy",
        icon: "🌟",
      },
    ],
  },
];

const convertToArabicNumerals = (num: number) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)])
    .join("");
};

export default function BooksScreen() {
  const { isDarkMode, currentLanguage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Get translations for current language
  const t = translations[currentLanguage.code];
  const bookT = bookTranslations[currentLanguage.code];

  const theme = {
    background: isDarkMode ? "#121212" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#121212",
    card: isDarkMode ? "#1e1e1e" : "#f5f5f5",
    primary: "#dc2626",
    secondary: isDarkMode ? "#333333" : "#e2e8f0",
    accent: "#f59e0b",
    searchBackground: isDarkMode ? "#2c2c2c" : "#f1f5f9",
  };

  const getIconForBook = (bookId: string): string => {
    // Find the book in either testament
    for (const testament of bibleSections) {
      const foundBook = testament.books.find(book => book.id === bookId);
      if (foundBook) {
        return foundBook.icon;
      }
    }
    return "📖";
  };

  // Get localized section data
  const localizedSections = useMemo(() => {
    return bibleSections.map((section) => {
      const testament = section.id === "testament1" ? "Old" : "New";
      const books = getBooksByLanguageAndTestament(currentLanguage.code, testament);
      
      return {
        ...section,
        title: section.id === "testament1" ? t.oldTestament : t.newTestament,
        description: section.id === "testament1" ? t.oldTestamentDesc : t.newTestamentDesc,
        books: books.map((book, index) => ({
          name: `${index + 1}. ${book.name}`,
          chapters: book.chapters.length,
          description: (bookT.descriptions as Record<string, string>)[book.name] || "",
          id: book.id,
          icon: getIconForBook(book.id),
        }))
      };
    });
  }, [currentLanguage]);


  const filteredSections = useMemo(() => {
    return localizedSections
      .map((section) => ({
        ...section,
        books: section.books.filter(
          (book) =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.books.length > 0);
  }, [searchQuery, localizedSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const openBookReader = (book: { id: string, name:string, language: string }) => {
    router.push({
      pathname: "/book-reader",
      params: {
        bookId: book.id,
        bookName: book.name,
        language: currentLanguage.code
      }
    });
  };

  const renderBookItem = ({
    item: book,
    index,
    sectionId,
  }: {
    item: {
      name: string;
      chapters: number;
      description: string;
      icon: string;
      id: string;
    };
    index: number;
    sectionId: string;
  }) => {
    // Calculate the book number based on section
    const bookNumber = index + 1; // Always start from 1 for each section

    // Format the number based on language
    const formattedNumber =
      currentLanguage.code === "ar"
        ? convertToArabicNumerals(bookNumber)
        : bookNumber.toString();

    return (
      <TouchableOpacity
        style={[
          styles.bookItem,
          {
            backgroundColor: theme.background,
            borderColor: theme.secondary,
          },
        ]}
        onPress={() => openBookReader({
          id: book.id,
          name: book.name,
          language: currentLanguage.code
        })}
      >
        <Text style={styles.bookIcon}>{book.icon}</Text>
        <Text
          style={[
            styles.bookTitle,
            {
              color: theme.text,
              writingDirection: currentLanguage.code === "ar" ? "rtl" : "ltr",
            },
          ]}
          numberOfLines={1}
        >
          {formattedNumber}. {book.name.replace(/^\d+\.\s*/, "")}
        </Text>
        <Text
          style={[styles.bookChapters, { color: theme.text }]}
          numberOfLines={1}
        >
          {currentLanguage.code === "ar"
            ? convertToArabicNumerals(book.chapters)
            : book.chapters}{" "}
          {t.chapters}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
        },
      ]}
    >
      <RNStatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={true}
      />

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          currentLanguage.code === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <Search
          stroke={theme.text}
          style={[
            styles.searchIcon,
            currentLanguage.code === "ar" ? { right: 30, left: "auto" } : {},
          ]}
          opacity={0.7}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.searchBackground,
              color: theme.text,
              borderColor: theme.secondary,
              textAlign: currentLanguage.code === "ar" ? "right" : "left",
              paddingLeft: currentLanguage.code === "ar" ? 15 : 40,
              paddingRight: currentLanguage.code === "ar" ? 40 : 15,
            },
          ]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={currentLanguage.code === "ar" ? "right" : "left"}
        />
      </View>

      <FlatList
        data={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item: section }) => (
          <View
            key={section.id}
            style={[
              styles.sectionContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.secondary,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sectionHeader,
                currentLanguage.code === "ar" && {
                  flexDirection: "row-reverse",
                },
              ]}
              onPress={() => toggleSection(section.id)}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {section.title}
              </Text>
              <ChevronRight
                stroke={theme.text}
                style={[
                  styles.chevron,
                  {
                    transform: [
                      {
                        rotate: expandedSections.includes(section.id)
                          ? currentLanguage.code === "ar"
                            ? "-90deg"
                            : "90deg"
                          : "0deg",
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>

            <Text style={[styles.sectionDescription, { color: theme.text }]}>
              {section.description}
            </Text>

            {expandedSections.includes(section.id) && (
              <FlatList
                data={section.books}
                keyExtractor={(item) => item.name}
                renderItem={(props) =>
                  renderBookItem({
                    ...props,
                    sectionId: section.id,
                  })
                }
                numColumns={3}
                columnWrapperStyle={[
                  styles.gridRow,
                  currentLanguage.code === "ar" && {
                    flexDirection: "row-reverse",
                  },
                ]}
                contentContainerStyle={styles.gridContainer}
              />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.text }]}>
              {t.noResults}
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.text }]}>
              {t.tryDifferent}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchIcon: {
    position: "absolute",
    left: 30,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 15,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
  sectionContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: "90%",
    marginHorizontal: "5%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chevron: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  gridContainer: {
    alignItems: "stretch",
  },
  gridRow: {
    justifyContent: "space-between",
  },
  bookItem: {
    width: '32%',
    aspectRatio: 0.8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    flexShrink: 1,
  },
  bookChapters: {
    fontSize: 12,
    opacity: 0.7,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
