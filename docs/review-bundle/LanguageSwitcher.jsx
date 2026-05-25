import { LANGUAGE_LIST } from '../data/languages';
import LanguageButton from './LanguageButton';

/**
 * Compact horizontal language switcher with anime flag buttons.
 */
export default function LanguageSwitcher({ selectedId, onSelect, className = '' }) {
  return (
    <div className={`${className}`}>
      <p className="text-xs font-black text-gray-500 mb-2 text-center">Quick switch</p>
      <div className="flex justify-center gap-2 flex-wrap">
        {LANGUAGE_LIST.map(lang => (
          <LanguageButton
            key={lang.id}
            language={lang}
            isSelected={selectedId === lang.id}
            isCurrent={selectedId === lang.id}
            onSelect={onSelect}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
