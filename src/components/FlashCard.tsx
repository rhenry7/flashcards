interface FlashCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
  targetLanguageLabel?: string; // e.g., "Français" or "Español"
}

export default function FlashCard({ front, back, flipped, onFlip, targetLanguageLabel = 'Français' }: FlashCardProps) {
  return (
    <div
      onClick={onFlip}
      className="relative w-full h-64 cursor-pointer perspective-1000"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden border-2 border-blue-200">
          <div className="text-sm text-gray-500 mb-2">English</div>
          <div className="text-xl font-semibold text-center">{front}</div>
        </div>
        <div className="absolute w-full h-full bg-blue-50 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden border-2 border-blue-400 rotate-y-180">
          <div className="text-sm text-gray-500 mb-2">{targetLanguageLabel}</div>
          <div className="text-xl font-semibold text-center">{back}</div>
        </div>
      </div>
    </div>
  );
}
