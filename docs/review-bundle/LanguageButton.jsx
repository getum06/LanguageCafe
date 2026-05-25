/**
 * Anime-inspired language selection button with flag icon.
 */
export default function LanguageButton({
  language,
  isSelected,
  isCurrent,
  onSelect,
  variant = 'card',
}) {
  const { flag, emoji, name, nativeName, color, borderColor, bgColor, badgeColor, hoverColor, description, funFact } = language;

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => onSelect(language.id)}
        title={`${name} (${nativeName})`}
        aria-pressed={isSelected}
        className={`lang-btn-compact flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all duration-200
          ${isSelected
            ? `${bgColor} ${borderColor} scale-110 shadow-lg ring-2 ring-pink-300 ring-offset-1`
            : `bg-white border-gray-200 ${hoverColor} hover:shadow-md hover:-translate-y-0.5`
          }`}
      >
        <span className="text-2xl leading-none" role="img" aria-label={`${name} flag`}>{flag}</span>
        <span className="text-[10px] font-black text-gray-600 truncate max-w-[52px]">{name}</span>
        {isSelected && <span className="text-[8px] text-pink-500 font-black">✓</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(language.id)}
      aria-pressed={isSelected}
      className={`lang-btn-card w-full text-left rounded-3xl border-2 p-4 transition-all duration-300
        ${isSelected
          ? `${bgColor} ${borderColor} scale-[1.02] shadow-xl border-4 lang-btn-selected`
          : `bg-white border-gray-200 hover:shadow-lg ${hoverColor} hover:-translate-y-0.5`
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`lang-btn-flag w-16 h-16 rounded-2xl bg-gradient-to-br ${color}
            flex flex-col items-center justify-center border-2 ${borderColor}
            shadow-sm flex-shrink-0 transition-all duration-200
            ${isSelected ? 'scale-110 shadow-md animate-bounce-soft' : ''}`}
        >
          <span className="text-3xl leading-none" role="img" aria-label={`${name} flag`}>{flag}</span>
          <span className="text-base leading-none mt-0.5">{emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-black text-xl text-gray-800">{name}</h3>
            <span className="text-gray-400 font-bold text-sm">{nativeName}</span>
            {isCurrent && !isSelected && (
              <span className="text-xs font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full border border-green-300">
                ✓ active
              </span>
            )}
            {isSelected && (
              <span className="text-xs font-black bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full border border-pink-300 animate-sparkle">
                ✨ chosen
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm font-medium truncate">{description}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor} border ${borderColor}`}>
            {language.speakers}
          </span>
        </div>

        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${isSelected ? `${borderColor} bg-gradient-to-br ${color} shadow-inner` : 'border-gray-300 bg-gray-50'}`}
        >
          {isSelected ? <span className="text-sm font-black text-gray-700">✓</span> : null}
        </div>
      </div>

      {isSelected && funFact && (
        <div className={`mt-3 pt-3 border-t ${borderColor} text-sm font-medium text-gray-600 flex items-start gap-2`}>
          <span className="text-lg flex-shrink-0">✨</span>
          <span>{funFact}</span>
        </div>
      )}
    </button>
  );
}
