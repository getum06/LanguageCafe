export interface Flashcard {
  id: number;
  word: string;
  translation: string;
  language: string;
  example: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    word: "Bonjour",
    translation: "Hello",
    language: "French",
    example: "Bonjour, comment allez-vous?",
  },
  {
    id: 2,
    word: "Merci",
    translation: "Thank you",
    language: "French",
    example: "Merci beaucoup pour votre aide.",
  },
  {
    id: 3,
    word: "Hola",
    translation: "Hello",
    language: "Spanish",
    example: "¡Hola! ¿Cómo estás?",
  },
  {
    id: 4,
    word: "Gracias",
    translation: "Thank you",
    language: "Spanish",
    example: "Muchas gracias por tu ayuda.",
  },
  {
    id: 5,
    word: "Guten Tag",
    translation: "Good day",
    language: "German",
    example: "Guten Tag, wie geht es Ihnen?",
  },
  {
    id: 6,
    word: "Danke",
    translation: "Thank you",
    language: "German",
    example: "Danke schön für alles.",
  },
  {
    id: 7,
    word: "Ciao",
    translation: "Hello / Goodbye",
    language: "Italian",
    example: "Ciao, come stai?",
  },
  {
    id: 8,
    word: "Prego",
    translation: "You're welcome",
    language: "Italian",
    example: "Prego, non c'è di che.",
  },
  {
    id: 9,
    word: "こんにちは",
    translation: "Hello",
    language: "Japanese",
    example: "こんにちは、元気ですか？",
  },
  {
    id: 10,
    word: "ありがとう",
    translation: "Thank you",
    language: "Japanese",
    example: "ありがとうございます。",
  },
];

export function getFlashcardsByLanguage(language?: string): Flashcard[] {
  if (!language) return flashcards;
  return flashcards.filter(
    (card) => card.language.toLowerCase() === language.toLowerCase()
  );
}

export function getAvailableLanguages(): string[] {
  return [...new Set(flashcards.map((card) => card.language))];
}
