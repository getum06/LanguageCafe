import { SUPPORTED_LANGUAGE_IDS } from '../lib/languageStorage';
import { LANGUAGE_LIST, getLanguageMeta } from './languageMeta';

export { SUPPORTED_LANGUAGE_IDS, LANGUAGE_LIST };

export function getLanguage(id) {
  return getLanguageMeta(id);
}
