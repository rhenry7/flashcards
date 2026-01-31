import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlashCard from './FlashCard';

interface VocabItem {
  english: string;
  target: string;
  category: string;
}

interface VocabTabProps {
  vocabData: VocabItem[];
  vocabIndex: number;
  flipped: boolean;
  targetLanguageLabel?: string;
  onSetFlipped: (flipped: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function VocabTab({ vocabData, vocabIndex, flipped, targetLanguageLabel = 'Français', onSetFlipped, onPrev, onNext }: VocabTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vocabulary</h2>
      <div className="mb-4 text-center">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          {vocabData[vocabIndex].category}
        </span>
      </div>
      <FlashCard
        front={vocabData[vocabIndex].english}
        back={vocabData[vocabIndex].target}
        flipped={flipped}
        onFlip={() => onSetFlipped(!flipped)}
        targetLanguageLabel={targetLanguageLabel}
      />
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <span className="text-gray-600">
          {vocabIndex + 1} / {vocabData.length}
        </span>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
