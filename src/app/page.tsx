import FlashcardDeck from "@/components/FlashcardDeck";
import { flashcards, getAvailableLanguages } from "@/lib/flashcards";

export default function Home() {
  const cards = flashcards;
  const languages = getAvailableLanguages();

  return (
    <div className="flex flex-col flex-1 items-center bg-background font-sans">
      <header className="w-full py-6 text-center border-b border-foreground/5">
        <h1 className="text-3xl font-bold tracking-tight">
          ☕ LanguageCafe
        </h1>
        <p className="text-foreground/60 mt-1">Learn languages the fun way</p>
      </header>
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center py-10 px-4">
        <h2 className="text-xl font-semibold mb-6">Vocabulary Flashcards</h2>
        <FlashcardDeck cards={cards} languages={languages} />
      </main>
      <footer className="w-full py-4 text-center text-sm text-foreground/40 border-t border-foreground/5">
        LanguageCafe &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
