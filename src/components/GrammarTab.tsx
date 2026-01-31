import { Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import FlashCard from './FlashCard';
import AddFlashcardForm from './AddFlashcardForm';
import type { GeneratedFlashcard } from '../types';
import type { AddFlashcardFormData } from '../types';

interface GrammarTabProps {
  filteredFlashcards: GeneratedFlashcard[];
  grammarIndex: number;
  flipped: boolean;
  selectedLevel: string;
  selectedCategory: string;
  levels: string[];
  categories: string[];
  showAddForm: boolean;
  targetLanguageLabel?: string;
  onSetFlipped: (flipped: boolean) => void;
  onSetSelectedLevel: (level: string) => void;
  onSetSelectedCategory: (category: string) => void;
  onSetShowAddForm: (show: boolean) => void;
  onAddFlashcard: (data: AddFlashcardFormData) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function GrammarTab({
  filteredFlashcards,
  grammarIndex,
  flipped,
  selectedLevel,
  selectedCategory,
  levels,
  categories,
  showAddForm,
  targetLanguageLabel = 'Français',
  onSetFlipped,
  onSetSelectedLevel,
  onSetSelectedCategory,
  onSetShowAddForm,
  onAddFlashcard,
  onPrev,
  onNext,
}: GrammarTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Grammar Flashcards</h2>
        <button
          onClick={() => onSetShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> Add Flashcard
        </button>
      </div>

      {showAddForm && (
        <AddFlashcardForm
          onClose={() => onSetShowAddForm(false)}
          onAdd={onAddFlashcard}
          availableLevels={levels.filter((l) => l !== 'all')}
          availableCategories={categories.filter((c) => c !== 'all')}
          targetLanguageLabel={targetLanguageLabel}
        />
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Level:</span>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onSetSelectedLevel(level)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === level ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSetSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">Showing {filteredFlashcards.length} flashcards</div>
      </div>

      {filteredFlashcards.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {filteredFlashcards[grammarIndex].level}
            </span>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
              {filteredFlashcards[grammarIndex].category}
            </span>
          </div>

          <FlashCard
            front={filteredFlashcards[grammarIndex].english}
            back={filteredFlashcards[grammarIndex].target}
            flipped={flipped}
            onFlip={() => onSetFlipped(!flipped)}
            targetLanguageLabel={targetLanguageLabel}
          />

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Rule:</p>
            <p className="text-gray-800 text-sm">{filteredFlashcards[grammarIndex].ruleEnglish}</p>
            <p className="text-blue-600 text-sm">{filteredFlashcards[grammarIndex].ruleTarget}</p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <span className="text-gray-600">
              {grammarIndex + 1} / {filteredFlashcards.length}
            </span>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No flashcards found for the selected filters.</p>
          <button
            onClick={() => {
              onSetSelectedLevel('all');
              onSetSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
