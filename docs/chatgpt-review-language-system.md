# Lingo Café Quest — Language Selection System (Code Review Package)

**Purpose:** Share this document with ChatGPT (or any reviewer) to evaluate the language selection feature.  
**Repo:** https://github.com/getum06/LanguageCafe  
**PR:** https://github.com/getum06/LanguageCafe/pull/4  
**Branch:** `cursor/language-selection-system-f23d`  
**Commit:** `b09e4b6` — Add language selection system with reusable lesson content  
**Stack:** Vite + React 19 + Tailwind CSS 3 (SPA, not Next.js)

---

## Review prompt (copy-paste into ChatGPT)

```
Please review this language selection system for a React learning app called Lingo Café Quest.

Focus on:
1. Architecture — Is the data layer (getLanguagePack) reusable and scalable?
2. localStorage — Is persistence correct and are there edge cases (dual keys, migration)?
3. UX — Are the language selector components accessible and clear?
4. Dynamic content — Do Lesson, Quiz, and Chat correctly switch per language?
5. Security / robustness — Invalid language IDs, missing data, i18n gaps
6. Suggestions — What would you improve before shipping?

The full spec and file list are in the document below.
```

---

## 1. Feature requirements (what was requested)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Spanish, French, Japanese, Korean, Italian | Done | `SUPPORTED_LANGUAGE_IDS` in `src/lib/languageStorage.js` |
| Save selected language in localStorage | Done | Key `lingoCafeQuest.language` + sync in `lingoCafeQuest` JSON |
| Reusable lesson data for lessons/quizzes/chat | Done | `getLanguagePack()` in `src/data/lessonContent.js` |
| Anime-inspired buttons with flag icons | Done | `LanguageButton.jsx` + CSS in `index.css` |

---

## 2. Architecture overview

```
User picks language
       │
       ▼
LanguageSelect / LanguageSwitcher / Header badge
       │
       ▼
selectLanguage(id) ──► setStoredLanguage(id)     [lingoCafeQuest.language]
       │              └──► game state             [lingoCafeQuest JSON]
       ▼
getLanguagePack(selectedLanguageId)
       │
       ├──► Lesson.jsx   (lesson.vocab, dialogue, tips)
       ├──► Quiz.jsx     (quiz.questions)
       └──► ChatPractice.jsx (chat.prompts + getVocabByKey feedback)
```

**Data sources:**
- `src/data/languages.js` — Raw content per language (~400 lines, 5 languages)
- `src/data/lessonContent.js` — Schema, IDs, normalized `getLanguagePack()`
- `src/lib/languageStorage.js` — localStorage read/write

**Removed:** `src/data/lessonData.js` (unused Spanish-only legacy)

---

## 3. File change summary

| File | Change |
|------|--------|
| `src/lib/languageStorage.js` | **NEW** — Dedicated localStorage API |
| `src/data/lessonContent.js` | **NEW** — Content pack schema + accessors |
| `src/hooks/useLanguage.js` | **NEW** — Language selection hook |
| `src/components/LanguageButton.jsx` | **NEW** — Anime flag buttons (card + compact) |
| `src/components/LanguageSwitcher.jsx` | **NEW** — Horizontal quick-switch |
| `src/components/LanguageSelect.jsx` | Refactored to use new components |
| `src/components/HomePage.jsx` | Inline LanguageSwitcher |
| `src/components/Lesson.jsx` | Uses `getLanguagePack()` |
| `src/components/Quiz.jsx` | Uses `getLanguagePack()` |
| `src/components/ChatPractice.jsx` | Uses `getLanguagePack()` + `getVocabByKey()` |
| `src/hooks/useGameState.js` | Syncs dedicated language key |
| `src/index.css` | `.lang-btn-*` anime styles |
| `src/data/languages.js` | Re-exports `SUPPORTED_LANGUAGE_IDS` |
| `src/data/lessonData.js` | **DELETED** |

---

## 4. Data schemas

### 4.1 Language metadata + content (per language in `languages.js`)

```javascript
{
  id: 'spanish',
  name: 'Spanish',
  nativeName: 'Español',
  flag: '🇪🇸',
  emoji: '🌮',
  // Tailwind theme: color, borderColor, bgColor, badgeColor, hoverColor
  vocab: [{ key, english, word, pronunciation, emoji }],
  dialogue: [{ speaker, line, translation }],
  tips: [{ icon, title, body }],
  quiz: [{ id, question, emoji, options[], correct, explanation }],
  chatPrompts: [{ id, prompt, hint, keywords[], type }],
}
```

### 4.2 Normalized pack (`getLanguagePack(languageId)`)

```javascript
{
  meta: { id, name, nativeName, flag, emoji, theme colors, funFact, description },
  lesson: {
    id: 'cafe-ordering-spanish',  // getLessonId()
    slideTypes: ['intro','vocab','dialogue','tips','summary'],
    vocab, dialogue, tips,
    xpReward: 50,
  },
  quiz: {
    id: 'quiz-cafe-spanish',       // getQuizId()
    questions: [...],
    xpReward: 75,
  },
  chat: {
    prompts: [...],
    xpPerCorrect: 10,
  },
}
```

### 4.3 Chat prompt types

`greeting` | `order` | `size` | `price` | `thanks` — used for keyword matching and feedback templates.

---

## 5. Key source code

### 5.1 localStorage (`src/lib/languageStorage.js`)

```javascript
export const LANGUAGE_STORAGE_KEY = 'lingoCafeQuest.language';

export const SUPPORTED_LANGUAGE_IDS = [
  'spanish', 'french', 'japanese', 'korean', 'italian',
];

export function getStoredLanguage() { /* reads + validates id */ }
export function setStoredLanguage(languageId) { /* set or remove */ }
```

### 5.2 Content accessor (`src/data/lessonContent.js`)

```javascript
export function getLanguagePack(languageId) {
  const lang = getLanguage(languageId); // falls back to Spanish
  return { meta: {...}, lesson: {...}, quiz: {...}, chat: {...} };
}

export function getVocabByKey(languageId, key) {
  return getLessonContent(languageId).vocab.find(v => v.key === key);
}
```

### 5.3 Game state sync (`src/hooks/useGameState.js`)

On **load:** `getStoredLanguage()` overrides `parsed.selectedLanguage` if present.  
On **save:** writes both `lingoCafeQuest` JSON and `setStoredLanguage(state.selectedLanguage)`.

### 5.4 Component usage pattern

**Lesson.jsx:**
```javascript
const pack = getLanguagePack(state.selectedLanguage);
const { meta: language, lesson } = pack;
const lessonId = lesson.id;
// slides read lesson.vocab, lesson.dialogue, lesson.tips
```

**Quiz.jsx:**
```javascript
const { meta: language, quiz } = getLanguagePack(state.selectedLanguage);
const questions = quiz.questions;
```

**ChatPractice.jsx:**
```javascript
const { meta: language, chat } = getLanguagePack(state.selectedLanguage);
const prompts = chat.prompts;
buildFeedback(language.id, language.name, prompt.type, result);
```

### 5.5 UI entry points

1. **Onboarding** — `LanguageSelect` page (full cards + confirm button)
2. **Bottom nav** — "Language" tab → `language-select`
3. **Header** — Flag badge button → `language-select`
4. **Home** — `LanguageSwitcher` compact flags (instant switch, no confirm)

---

## 6. Sample language content (Spanish excerpt)

```javascript
vocab: [
  { key: 'hello', english: 'Hello', word: 'Hola', pronunciation: 'OH-lah', emoji: '👋' },
  { key: 'coffee', english: 'Coffee', word: 'Café', pronunciation: 'kah-FEH', emoji: '☕' },
  // ... 6 more
],
chatPrompts: [
  {
    id: 1,
    prompt: '¡Hola! You just walked into a Spanish café...',
    hint: 'Try: Hola / Buenos días',
    keywords: ['hola', 'buenos', 'días', 'buenas'],
    type: 'greeting',
  },
  // ... 4 more
],
```

Full content for all 5 languages: see `src/data/languages.js` in the zip/repo.

---

## 7. CSS additions (anime buttons)

```css
.lang-btn-card::before { /* shine sweep on hover */ }
.lang-btn-selected { /* pink/purple glow ring */ }
.lang-btn-confirm { /* animated gradient on confirm CTA */ }
.lang-btn-flag { /* drop-shadow on flag container */ }
```

---

## 8. Manual test checklist

- [ ] Fresh visit → redirected to language select
- [ ] Pick Spanish → confirm → character select or home
- [ ] Refresh browser → Spanish still selected (check DevTools → Application → localStorage)
- [ ] Lesson shows Spanish vocab/dialogue
- [ ] Quiz shows Spanish questions
- [ ] Chat shows Spanish prompts; typing "Hola" passes greeting
- [ ] Switch to Japanese via home quick-switch → lesson/quiz/chat update
- [ ] Keys in localStorage: `lingoCafeQuest` and `lingoCafeQuest.language` both set
- [ ] Progress IDs are per-language: `cafe-ordering-japanese`, `quiz-cafe-japanese`

**Run locally:** `npm install && npm run dev` → http://localhost:5173

---

## 9. Known limitations (for reviewer)

1. **UI is English-only** — Only the *learned* language content changes, not app chrome/labels.
2. **Single lesson topic** — All languages share the "café ordering" template; adding new topics needs component + data work.
3. **Dual localStorage keys** — Language stored in two places; could drift if edited externally (load prefers dedicated key).
4. **Emoji flags** — Not SVG/country icons; accessibility varies by OS.
5. **ESLint** — Pre-existing issues in `App.jsx` (setState in effect) and `Quiz.jsx` (Math.random in render); not introduced by this PR but still present.
6. **Character feedback** — Buddy messages in `characters.js` are not fully localized per target language.

---

## 10. Questions for the reviewer

1. Should `languages.js` be split into 5 files or generated from a CMS?
2. Is `getLanguagePack` the right abstraction for future lessons (e.g. "bakery", "hotel")?
3. Should home quick-switch call `chooseLanguage` with a confirmation modal?
4. Any bugs in the dual-key localStorage strategy?
5. Accessibility audit for `LanguageButton` (aria-pressed, keyboard nav)?

---

## 11. How to run / build

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run lint     # ESLint (some pre-existing errors)
```

---

*End of review package. Source files included in `language-system-review.zip` if downloaded from the repo.*
