"use client";

import { useState, useMemo } from "react";
import type { Flashcard } from "@/lib/flashcards";

interface FlashcardDeckProps {
  cards: Flashcard[];
  languages: string[];
}

export default function FlashcardDeck({ cards, languages }: FlashcardDeckProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const filteredCards = useMemo(
    () =>
      selectedLanguage
        ? cards.filter(
            (c) => c.language.toLowerCase() === selectedLanguage.toLowerCase()
          )
        : cards,
    [cards, selectedLanguage]
  );

  const currentCard = filteredCards[currentIndex];

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleKnew = () => {
    setScore((prev) => ({
      correct: prev.correct + 1,
      total: prev.total + 1,
    }));
    handleNext();
  };

  const handleDidntKnow = () => {
    setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    handleNext();
  };

  const handleReset = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (filteredCards.length === 0) {
    return (
      <p className="text-center text-lg text-foreground/60">
        No flashcards found.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      {/* Language Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleLanguageChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedLanguage === ""
              ? "bg-accent text-white"
              : "bg-card-bg text-foreground/70 hover:bg-accent/10"
          }`}
        >
          All
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedLanguage === lang
                ? "bg-accent text-white"
                : "bg-card-bg text-foreground/70 hover:bg-accent/10"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex gap-6 text-sm font-medium">
        <span className="text-success">✓ {score.correct} correct</span>
        <span className="text-foreground/50">{score.total} reviewed</span>
        {score.total > 0 && (
          <button
            onClick={handleReset}
            className="text-accent hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Flashcard */}
      <button
        onClick={handleFlip}
        className="w-full aspect-[3/2] rounded-2xl bg-card-bg shadow-lg border border-foreground/5 flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        aria-label={isFlipped ? "Show word" : "Show translation"}
      >
        <span className="text-xs uppercase tracking-widest text-foreground/40 mb-2">
          {currentCard.language}
        </span>
        {isFlipped ? (
          <>
            <span className="text-2xl font-bold text-success mb-3">
              {currentCard.translation}
            </span>
            <span className="text-base text-foreground/60 italic text-center">
              &quot;{currentCard.example}&quot;
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold">{currentCard.word}</span>
        )}
        <span className="text-xs text-foreground/30 mt-4">
          {isFlipped ? "Click to see word" : "Click to reveal"}
        </span>
      </button>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-card-bg shadow hover:bg-accent/10 transition-colors"
          aria-label="Previous card"
        >
          ←
        </button>
        <span className="text-sm text-foreground/50 min-w-[60px] text-center">
          {currentIndex + 1} / {filteredCards.length}
        </span>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-card-bg shadow hover:bg-accent/10 transition-colors"
          aria-label="Next card"
        >
          →
        </button>
      </div>

      {/* Score Buttons */}
      <div className="flex gap-4 w-full">
        <button
          onClick={handleDidntKnow}
          className="flex-1 py-3 rounded-xl bg-warning/10 text-warning font-medium hover:bg-warning/20 transition-colors"
        >
          Still Learning
        </button>
        <button
          onClick={handleKnew}
          className="flex-1 py-3 rounded-xl bg-success/10 text-success font-medium hover:bg-success/20 transition-colors"
        >
          Knew It!
        </button>
      </div>
    </div>
  );
}
