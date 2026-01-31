import { RotateCw, Check } from 'lucide-react';
import type { MatchCard as MatchCardType } from '../types';

interface MatchTabProps {
  matchCards: MatchCardType[];
  matchPairs: number;
  matchScore: number;
  targetLanguageLabel?: string;
  onNewGame: () => void;
  onCardClick: (index: number) => void;
}

export default function MatchTab({
  matchCards,
  matchPairs,
  matchScore,
  targetLanguageLabel = 'Français',
  onNewGame,
  onCardClick,
}: MatchTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Memory Match</h2>
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RotateCw size={20} /> New Game
        </button>
      </div>

      <div className="mb-6 flex justify-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{matchPairs}</div>
          <div className="text-sm text-gray-600">Pairs Matched</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{matchScore}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {matchCards.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No flashcards available for matching.</p>
          <p className="text-sm mt-2">Try adjusting your filters or add more flashcards.</p>
        </div>
      ) : (
        <>
          {matchPairs > 0 && matchPairs === matchCards.length / 2 && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</div>
              <p className="text-gray-700">You&apos;ve matched all pairs!</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {matchCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => onCardClick(index)}
                className={`relative h-32 cursor-pointer perspective-1000 ${
                  card.isMatched ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                  }`}
                >
                  <div className="absolute inset-0 rounded-lg bg-indigo-500 shadow-lg flex items-center justify-center backface-hidden">
                    <div className="text-white text-3xl font-bold">?</div>
                  </div>

                  <div
                    className={`absolute inset-0 rounded-lg shadow-lg flex flex-col items-center justify-center p-3 backface-hidden rotate-y-180 ${
                      card.isMatched
                        ? 'bg-green-100 border-2 border-green-400'
                        : card.language === 'en'
                          ? 'bg-white border-2 border-blue-200'
                          : 'bg-blue-50 border-2 border-blue-400'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        card.language === 'en' ? 'text-gray-500' : 'text-blue-600'
                      }`}
                    >
                      {card.language === 'en' ? 'English' : targetLanguageLabel}
                    </div>
                    <div
                      className={`text-sm font-semibold text-center ${
                        card.isMatched ? 'text-green-700' : 'text-gray-800'
                      }`}
                    >
                      {card.content}
                    </div>
                    {card.isMatched && (
                      <Check className="absolute top-2 right-2 text-green-600" size={20} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Click cards to flip them. Match English cards with their {targetLanguageLabel} translations!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
