import { NextRequest, NextResponse } from "next/server";
import {
  getFlashcardsByLanguage,
  getAvailableLanguages,
} from "@/lib/flashcards";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const language = searchParams.get("language") ?? undefined;

  const cards = getFlashcardsByLanguage(language);
  const languages = getAvailableLanguages();

  return NextResponse.json({ cards, languages });
}
