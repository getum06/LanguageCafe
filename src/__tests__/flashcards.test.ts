import {
  flashcards,
  getFlashcardsByLanguage,
  getAvailableLanguages,
} from "@/lib/flashcards";

describe("flashcards data", () => {
  it("should have at least one flashcard", () => {
    expect(flashcards.length).toBeGreaterThan(0);
  });

  it("each flashcard should have required fields", () => {
    for (const card of flashcards) {
      expect(card).toHaveProperty("id");
      expect(card).toHaveProperty("word");
      expect(card).toHaveProperty("translation");
      expect(card).toHaveProperty("language");
      expect(card).toHaveProperty("example");
      expect(typeof card.word).toBe("string");
      expect(typeof card.translation).toBe("string");
    }
  });
});

describe("getFlashcardsByLanguage", () => {
  it("returns all cards when no language specified", () => {
    const result = getFlashcardsByLanguage();
    expect(result).toEqual(flashcards);
  });

  it("filters cards by language (case-insensitive)", () => {
    const french = getFlashcardsByLanguage("french");
    expect(french.length).toBeGreaterThan(0);
    expect(french.every((c) => c.language === "French")).toBe(true);
  });

  it("returns empty array for unknown language", () => {
    const result = getFlashcardsByLanguage("Klingon");
    expect(result).toEqual([]);
  });
});

describe("getAvailableLanguages", () => {
  it("returns unique languages", () => {
    const langs = getAvailableLanguages();
    expect(langs.length).toBeGreaterThan(0);
    expect(new Set(langs).size).toBe(langs.length);
  });

  it("includes French and Spanish", () => {
    const langs = getAvailableLanguages();
    expect(langs).toContain("French");
    expect(langs).toContain("Spanish");
  });
});
