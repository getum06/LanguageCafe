import { useCallback } from 'react';
import { getLanguage, LANGUAGE_LIST } from '../data/languages';
import { getLanguagePack } from '../data/lessonContent';
import { getStoredLanguage, setStoredLanguage } from '../lib/languageStorage';

/**
 * Hook for language selection with localStorage-backed persistence.
 */
export function useLanguage(selectedLanguageId, selectLanguage) {
  const languageId = selectedLanguageId || getStoredLanguage();
  const language = languageId ? getLanguage(languageId) : null;
  const pack = languageId ? getLanguagePack(languageId) : null;

  const chooseLanguage = useCallback((id) => {
    setStoredLanguage(id);
    selectLanguage(id);
  }, [selectLanguage]);

  return {
    languageId,
    language,
    pack,
    languages: LANGUAGE_LIST,
    chooseLanguage,
    isSelected: (id) => languageId === id,
  };
}
