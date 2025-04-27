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
  icon?: string;
};

export const dummyBibleBooks: BibleBook[] = [
  {
    id: "genesis",
    name: "Genesis",
    testament: "Old",
    icon: "🌍",
    chapters: [
      {
        number: 1,
        verses: [
          {
            number: 1,
            text: "In the beginning God created the heavens and the earth.",
          },
          {
            number: 2,
            text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
          },
          {
            number: 3,
            text: "And God said, 'Let there be light,' and there was light.",
          },
        ],
      },
      {
        number: 2,
        verses: [
          {
            number: 1,
            text: "Thus the heavens and the earth were completed in all their vast array.",
          },
          {
            number: 2,
            text: "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.",
          },
        ],
      },
    ],
  },
  {
    id: "exodus",
    name: "Exodus",
    testament: "Old",
    icon: "🏞️",
    chapters: [
      {
        number: 1,
        verses: [
          {
            number: 1,
            text: "These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:",
          },
          { number: 2, text: "Reuben, Simeon, Levi and Judah;" },
          { number: 3, text: "Issachar, Zebulun and Benjamin;" },
        ],
      },
    ],
  },
];

// Function to get book by ID
export const getBookById = (id: string): BibleBook | undefined => {
  return dummyBibleBooks.find(
    (book) => book.id.toLowerCase() === id.toLowerCase()
  );
};
