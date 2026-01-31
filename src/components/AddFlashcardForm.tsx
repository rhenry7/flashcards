import { useState } from 'react';
import { XCircle } from 'lucide-react';
import type { AddFlashcardFormData } from '../types';

interface AddFlashcardFormProps {
  onClose: () => void;
  onAdd: (data: AddFlashcardFormData) => void;
  availableLevels: string[];
  availableCategories: string[];
}

export default function AddFlashcardForm({
  onClose,
  onAdd,
  availableLevels,
  availableCategories,
}: AddFlashcardFormProps) {
  const [english, setEnglish] = useState('');
  const [french, setFrench] = useState('');
  const [level, setLevel] = useState(availableLevels[0] || 'A1');
  const [category, setCategory] = useState(availableCategories[0] || '');
  const [ruleEnglish, setRuleEnglish] = useState('');
  const [ruleFrench, setRuleFrench] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!english.trim() || !french.trim() || !level || !category) {
      alert('Please fill in all required fields (English, French, Level, Category)');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAdd({
      english: english.trim(),
      french: french.trim(),
      level,
      category,
      ruleEnglish: ruleEnglish.trim() || undefined,
      ruleFrench: ruleFrench.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    setEnglish('');
    setFrench('');
    setRuleEnglish('');
    setRuleFrench('');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Add New Flashcard</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="Enter English text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              French <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={french}
              onChange={(e) => setFrench(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="Enter French text"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                list="levels-list"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                placeholder="Enter or select level (A1, A2, B1, B2)"
                required
              />
              <datalist id="levels-list">
                {availableLevels.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories-list"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                placeholder="Enter or select category"
                required
              />
              <datalist id="categories-list">
                {availableCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule (English) <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={ruleEnglish}
              onChange={(e) => setRuleEnglish(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="e.g., Subject + Verb + Object"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule (French) <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={ruleFrench}
              onChange={(e) => setRuleFrench(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="e.g., Sujet + Verbe + Complément"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags <span className="text-gray-400 text-xs">(optional, comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="e.g., present, tense, verb"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Add Flashcard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
