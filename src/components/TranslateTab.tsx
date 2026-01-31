interface TranslateTabProps {
  translationInput: string;
  translationResult: string;
  translationDirection: 'en-target' | 'target-en';
  targetLanguageLabel?: string;
  onSetTranslationInput: (value: string) => void;
  onSetTranslationDirection: (direction: 'en-target' | 'target-en') => void;
  onTranslate: () => void;
}

export default function TranslateTab({
  translationInput,
  translationResult,
  translationDirection,
  targetLanguageLabel = 'Français',
  onSetTranslationInput,
  onSetTranslationDirection,
  onTranslate,
}: TranslateTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Translation</h2>
      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => onSetTranslationDirection('en-target')}
          className={`px-4 py-2 rounded-lg ${
            translationDirection === 'en-target' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          English → {targetLanguageLabel}
        </button>
        <button
          onClick={() => onSetTranslationDirection('target-en')}
          className={`px-4 py-2 rounded-lg ${
            translationDirection === 'target-en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {targetLanguageLabel} → English
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translationDirection === 'en-target' ? 'English' : targetLanguageLabel}
          </label>
          <input
            type="text"
            value={translationInput}
            onChange={(e) => onSetTranslationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onTranslate()}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
            placeholder="Type a word..."
          />
        </div>
        <button
          onClick={onTranslate}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Translate
        </button>
        {translationResult && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              {translationDirection === 'en-target' ? targetLanguageLabel : 'English'}
            </p>
            <p className="text-xl font-semibold text-gray-800">{translationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
