import { useState, useEffect, useMemo } from 'react';
import { BookOpen, MessageSquare, Brain, Languages, ChevronLeft, ChevronRight, RotateCw, Check, X, Filter, Plus, XCircle, Grid } from 'lucide-react';
import a1Data from './a1.json';
import a2Data from './a2.json';
import b1Data from './b1.json';
import b2Data from './b2.json';

// Type definitions
interface Example {
  en: string;
  fr: string;
}

interface GrammarRule {
  id: string;
  level: string;
  category: string;
  english: string;
  french: string;
  examples: Example[];
  tags: string[];
}

interface GeneratedFlashcard {
  id: string;
  ruleId: string;
  ruleEnglish: string;
  ruleFrench: string;
  level: string;
  category: string;
  english: string;
  french: string;
  tags: string[];
}

// Combine all rules
const allRules: GrammarRule[] = [
  ...(a1Data as unknown as GrammarRule[]),
  ...(a2Data as unknown as GrammarRule[]),
  ...(b1Data as unknown as GrammarRule[]),
  ...(b2Data as unknown as GrammarRule[])
];

// Function to generate flashcards from a rule's examples
function generateFlashcardsFromRule(rule: GrammarRule): GeneratedFlashcard[] {
  if (!rule || !Array.isArray((rule as any).examples)) return [];

  return rule.examples.map((example, idx) => ({
    id: `${rule.id}_${idx}`,
    ruleId: rule.id,
    ruleEnglish: rule.english,
    ruleFrench: rule.french,
    level: rule.level,
    category: rule.category,
    english: example.en,
    french: example.fr,
    tags: rule.tags
  }));
}

const vocabData = [
  { english: "Hello", french: "Bonjour", category: "Greetings" },
  { english: "Goodbye", french: "Au revoir", category: "Greetings" },
  { english: "Please", french: "S'il vous plaît", category: "Politeness" },
  { english: "Thank you", french: "Merci", category: "Politeness" },
  { english: "Water", french: "Eau", category: "Food & Drink" },
  { english: "Bread", french: "Pain", category: "Food & Drink" },
  { english: "House", french: "Maison", category: "Places" },
  { english: "School", french: "École", category: "Places" },
  { english: "Cat", french: "Chat", category: "Animals" },
  { english: "Dog", french: "Chien", category: "Animals" },
  { english: "Book", french: "Livre", category: "Objects" },
  { english: "Car", french: "Voiture", category: "Transport" }
];

interface QuizQuestion {
  question: string;
  questionText: string;
  options: string[];
  correct: number;
  flashcardId: string;
  direction: 'en-fr' | 'fr-en';
}

interface FlashCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

const FlashCard = ({ front, back, flipped, onFlip }: FlashCardProps) => (
  <div 
    onClick={onFlip}
    className="relative w-full h-64 cursor-pointer perspective-1000"
  >
    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
      <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden border-2 border-blue-200">
        <div className="text-sm text-gray-500 mb-2">English</div>
        <div className="text-xl font-semibold text-center">{front}</div>
      </div>
      <div className="absolute w-full h-full bg-blue-50 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden border-2 border-blue-400 rotate-y-180">
        <div className="text-sm text-gray-500 mb-2">Français</div>
        <div className="text-xl font-semibold text-center">{back}</div>
      </div>
    </div>
  </div>
);

interface AddFlashcardFormProps {
  onClose: () => void;
  onAdd: (data: {
    english: string;
    french: string;
    level: string;
    category: string;
    ruleEnglish?: string;
    ruleFrench?: string;
    tags?: string[];
  }) => void;
  availableLevels: string[];
  availableCategories: string[];
}

const AddFlashcardForm = ({ onClose, onAdd, availableLevels, availableCategories }: AddFlashcardFormProps) => {
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

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    onAdd({
      english: english.trim(),
      french: french.trim(),
      level,
      category,
      ruleEnglish: ruleEnglish.trim() || undefined,
      ruleFrench: ruleFrench.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined
    });

    // Reset form
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
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
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
                {availableLevels.map(l => (
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
                {availableCategories.map(c => (
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
};

interface MatchCard {
  id: string;
  content: string;
  language: 'en' | 'fr';
  flashcardId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function LanguageLearningApp() {
  const [activeTab, setActiveTab] = useState('grammar');
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [translationInput, setTranslationInput] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [translationDirection, setTranslationDirection] = useState('en-fr');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  // Memory match game state
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchPairs, setMatchPairs] = useState(0);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [customFlashcards, setCustomFlashcards] = useState<GeneratedFlashcard[]>(() => {
    // Load from localStorage on mount
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('customFlashcards');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate that it's an array
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.error('Error loading custom flashcards from localStorage:', error);
    }
    return [];
  });

  // Save custom flashcards to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('customFlashcards', JSON.stringify(customFlashcards));
      }
    } catch (error) {
      console.error('Error saving custom flashcards to localStorage:', error);
      // If localStorage is full or unavailable, show a warning
      if (error instanceof DOMException && error.code === 22) {
        alert('Warning: Could not save flashcard to browser storage. Storage may be full.');
      }
    }
  }, [customFlashcards]);

  // Generate all flashcards from rules
  const allFlashcards = useMemo(() => {
    return allRules.flatMap(rule => generateFlashcardsFromRule(rule));
  }, []);

  // Combine JSON flashcards with custom flashcards
  const combinedFlashcards = useMemo(() => {
    return [...allFlashcards, ...customFlashcards];
  }, [allFlashcards, customFlashcards]);

  // Filter flashcards by level and category
  const filteredFlashcards = useMemo(() => {
    return combinedFlashcards.filter(card => {
      const levelMatch = selectedLevel === 'all' || card.level === selectedLevel;
      const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
      return levelMatch && categoryMatch;
    });
  }, [combinedFlashcards, selectedLevel, selectedCategory]);

  // Get unique levels and categories (including custom flashcards)
  const levels = useMemo(() => {
    const allLevels = [...allRules.map(r => r.level), ...customFlashcards.map(c => c.level)];
    return ['all', ...Array.from(new Set(allLevels))];
  }, [customFlashcards]);
  
  const categories = useMemo(() => {
    const allCategories = [...allRules.map(r => r.category), ...customFlashcards.map(c => c.category)];
    return ['all', ...Array.from(new Set(allCategories))];
  }, [customFlashcards]);

  // Reset index when filters change
  useEffect(() => {
    setGrammarIndex(0);
    setFlipped(false);
  }, [selectedLevel, selectedCategory]);

  // Ensure grammarIndex is within bounds when filteredFlashcards changes
  useEffect(() => {
    if (grammarIndex >= filteredFlashcards.length && filteredFlashcards.length > 0) {
      setGrammarIndex(0);
    }
  }, [filteredFlashcards.length]);

  const handleNext = (current: number, max: number, setCurrent: (val: number) => void) => {
    setCurrent((current + 1) % max);
    setFlipped(false);
  };

  const handlePrev = (current: number, max: number, setCurrent: (val: number) => void) => {
    setCurrent((current - 1 + max) % max);
    setFlipped(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const calculateScore = () => {
    return quizAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index]?.correct ? 1 : 0);
    }, 0);
  };

  // Generate quiz questions from flashcards
  const generateQuizQuestions = () => {
    const availableCards = filteredFlashcards.length > 0 ? filteredFlashcards : combinedFlashcards;
    
    if (availableCards.length === 0) {
      setQuizQuestions([]);
      return;
    }

    // Select random flashcards for questions (10 questions or all available if less)
    const numQuestions = Math.min(10, availableCards.length);
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, numQuestions);

    const questions: QuizQuestion[] = selectedCards.map((flashcard) => {
      // Randomly decide if question is English->French or French->English
      const direction = Math.random() > 0.5 ? 'en-fr' : 'fr-en';
      const questionText = direction === 'en-fr' ? flashcard.english : flashcard.french;
      const correctAnswer = direction === 'en-fr' ? flashcard.french : flashcard.english;

      // Get wrong answers from other flashcards
      const otherCards = availableCards.filter(c => c.id !== flashcard.id);
      const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
      const numWrongAnswers = Math.min(3, otherCards.length);
      const wrongAnswers = shuffledOthers
        .slice(0, numWrongAnswers)
        .map(c => direction === 'en-fr' ? c.french : c.english);

      // If we don't have enough wrong answers, we'll have fewer options (minimum 2)
      const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = allOptions.indexOf(correctAnswer);

      return {
        question: direction === 'en-fr' 
          ? `Translate to French: "${questionText}"`
          : `Translate to English: "${questionText}"`,
        questionText,
        options: allOptions,
        correct: correctIndex,
        flashcardId: flashcard.id,
        direction
      };
    });

    // Shuffle the questions themselves
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffledQuestions);
    setQuizAnswers([]);
    setQuizIndex(0);
    setShowQuizResult(false);
  };

  const resetQuiz = () => {
    generateQuizQuestions();
  };

  const handleTranslate = () => {
    const input = translationInput.toLowerCase().trim();
    
    // First try vocabulary data
    const vocab = vocabData.find(v => 
      translationDirection === 'en-fr' 
        ? v.english.toLowerCase() === input 
        : v.french.toLowerCase() === input
    );
    
    if (vocab) {
      setTranslationResult(translationDirection === 'en-fr' ? vocab.french : vocab.english);
      return;
    }
    
    // Then try flashcards (including custom ones)
    const flashcard = combinedFlashcards.find(card =>
      translationDirection === 'en-fr'
        ? card.english.toLowerCase() === input
        : card.french.toLowerCase() === input
    );
    
    if (flashcard) {
      setTranslationResult(translationDirection === 'en-fr' ? flashcard.french : flashcard.english);
    } else {
      setTranslationResult('Translation not found');
    }
  };

  const handleAddFlashcard = (flashcardData: {
    english: string;
    french: string;
    level: string;
    category: string;
    ruleEnglish?: string;
    ruleFrench?: string;
    tags?: string[];
  }) => {
    const newFlashcard: GeneratedFlashcard = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: 'custom',
      ruleEnglish: flashcardData.ruleEnglish || 'Custom flashcard',
      ruleFrench: flashcardData.ruleFrench || 'Carte personnalisée',
      level: flashcardData.level,
      category: flashcardData.category,
      english: flashcardData.english,
      french: flashcardData.french,
      tags: flashcardData.tags || []
    };
    
    setCustomFlashcards([...customFlashcards, newFlashcard]);
    setShowAddForm(false);
  };

  // Initialize memory match game
  const initializeMatchGame = () => {
    // Get a random subset of flashcards (6-8 pairs)
    const availableCards = filteredFlashcards.length > 0 ? filteredFlashcards : combinedFlashcards;
    const numPairs = Math.min(6, Math.floor(availableCards.length / 2));
    
    if (numPairs === 0) {
      setMatchCards([]);
      return;
    }

    // Randomly select pairs
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffled.slice(0, numPairs);

    // Create match cards (English and French for each pair)
    const cards: MatchCard[] = [];
    selectedPairs.forEach((flashcard) => {
      cards.push({
        id: `en_${flashcard.id}`,
        content: flashcard.english,
        language: 'en',
        flashcardId: flashcard.id,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `fr_${flashcard.id}`,
        content: flashcard.french,
        language: 'fr',
        flashcardId: flashcard.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle the cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setMatchCards(shuffledCards);
    setSelectedCards([]);
    setMatchScore(0);
    setMatchPairs(0);
  };

  // Handle card click in memory match game
  const handleMatchCardClick = (index: number) => {
    if (isCheckingMatch || matchCards[index].isFlipped || matchCards[index].isMatched) {
      return;
    }

    const newSelectedCards = [...selectedCards, index];
    const newCards = [...matchCards];
    newCards[index].isFlipped = true;
    setMatchCards(newCards);
    setSelectedCards(newSelectedCards);

    // If two cards are selected, check for match
    if (newSelectedCards.length === 2) {
      setIsCheckingMatch(true);
      const [firstIndex, secondIndex] = newSelectedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      // Check if they match (same flashcardId and different languages)
      if (firstCard.flashcardId === secondCard.flashcardId && firstCard.language !== secondCard.language) {
        // Match found!
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setMatchCards(updatedCards);
          setSelectedCards([]);
          setMatchScore(prev => prev + 1);
          setMatchPairs(prev => prev + 1);
          setIsCheckingMatch(false);
        }, 500);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setMatchCards(updatedCards);
          setSelectedCards([]);
          setIsCheckingMatch(false);
        }, 1000);
      }
    }
  };

  // Initialize game when match tab is opened or filters change
  useEffect(() => {
    if (activeTab === 'match') {
      initializeMatchGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filteredFlashcards.length, combinedFlashcards.length]);

  // Reset game when switching away from match tab
  useEffect(() => {
    if (activeTab !== 'match') {
      setMatchCards([]);
      setSelectedCards([]);
      setMatchScore(0);
      setMatchPairs(0);
    }
  }, [activeTab]);

  // Initialize quiz when quiz tab is opened or filters change
  useEffect(() => {
    if (activeTab === 'quiz') {
      generateQuizQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filteredFlashcards.length, combinedFlashcards.length]);

  // Reset quiz when switching away from quiz tab
  useEffect(() => {
    if (activeTab !== 'quiz') {
      setQuizQuestions([]);
      setQuizAnswers([]);
      setQuizIndex(0);
      setShowQuizResult(false);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'grammar', icon: BookOpen, label: 'Grammar' },
    { id: 'vocab', icon: MessageSquare, label: 'Vocabulary' },
    { id: 'quiz', icon: Brain, label: 'Quiz' },
    { id: 'translate', icon: Languages, label: 'Translate' },
    { id: 'match', icon: Grid, label: 'Match' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Language Learning</h1>
          <p className="text-gray-600">English ⇄ Français</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {activeTab === 'grammar' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Grammar Flashcards</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={20} /> Add Flashcard
                </button>
              </div>

              {/* Add Flashcard Form Modal */}
              {showAddForm && (
                <AddFlashcardForm
                  onClose={() => setShowAddForm(false)}
                  onAdd={handleAddFlashcard}
                  availableLevels={levels.filter(l => l !== 'all')}
                  availableCategories={categories.filter(c => c !== 'all')}
                />
              )}
              
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <Filter size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Level:</span>
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredFlashcards.length} flashcards
                </div>
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
                    back={filteredFlashcards[grammarIndex].french}
                    flipped={flipped}
                    onFlip={() => setFlipped(!flipped)}
                  />
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Rule:</p>
                    <p className="text-gray-800 text-sm">{filteredFlashcards[grammarIndex].ruleEnglish}</p>
                    <p className="text-blue-600 text-sm">{filteredFlashcards[grammarIndex].ruleFrench}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => handlePrev(grammarIndex, filteredFlashcards.length, setGrammarIndex)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <ChevronLeft size={20} /> Previous
                    </button>
                    <span className="text-gray-600">{grammarIndex + 1} / {filteredFlashcards.length}</span>
                    <button
                      onClick={() => handleNext(grammarIndex, filteredFlashcards.length, setGrammarIndex)}
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
                      setSelectedLevel('all');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vocab' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Vocabulary</h2>
              <div className="mb-4 text-center">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {vocabData[vocabIndex].category}
                </span>
              </div>
              <FlashCard
                front={vocabData[vocabIndex].english}
                back={vocabData[vocabIndex].french}
                flipped={flipped}
                onFlip={() => setFlipped(!flipped)}
              />
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => handlePrev(vocabIndex, vocabData.length, setVocabIndex)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                <span className="text-gray-600">{vocabIndex + 1} / {vocabData.length}</span>
                <button
                  onClick={() => handleNext(vocabIndex, vocabData.length, setVocabIndex)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quiz</h2>
                <button
                  onClick={generateQuizQuestions}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <RotateCw size={20} /> New Quiz
                </button>
              </div>

              {quizQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No flashcards available for quiz.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or add more flashcards.</p>
                </div>
              ) : !showQuizResult ? (
                <>
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Question {quizIndex + 1} of {quizQuestions.length}</div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-xl font-semibold mb-4">{quizQuestions[quizIndex].question}</p>
                    <div className="space-y-3">
                      {quizQuestions[quizIndex].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            quizAnswers[quizIndex] === index
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    {quizIndex > 0 && (
                      <button
                        onClick={() => setQuizIndex(quizIndex - 1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        <ChevronLeft size={20} /> Back
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (quizIndex < quizQuestions.length - 1) {
                          setQuizIndex(quizIndex + 1);
                        } else {
                          setShowQuizResult(true);
                        }
                      }}
                      disabled={quizAnswers[quizIndex] === undefined}
                      className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {quizIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'} <ChevronRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-indigo-600 mb-2">
                      {calculateScore()} / {quizQuestions.length}
                    </div>
                    <p className="text-xl text-gray-600">
                      {calculateScore() === quizQuestions.length ? 'Perfect!' : calculateScore() >= quizQuestions.length * 0.7 ? 'Great job!' : 'Keep practicing!'}
                    </p>
                  </div>
                  <div className="space-y-3 mb-6">
                    {quizQuestions.map((q, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {quizAnswers[index] === q.correct ? (
                          <Check className="text-green-600" size={24} />
                        ) : (
                          <X className="text-red-600" size={24} />
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium">{q.question}</span>
                          {quizAnswers[index] !== q.correct && (
                            <div className="text-xs text-gray-500 mt-1">
                              Correct: {q.options[q.correct]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mx-auto"
                  >
                    <RotateCw size={20} /> Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'translate' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Translation</h2>
              <div className="mb-4 flex justify-center gap-4">
                <button
                  onClick={() => setTranslationDirection('en-fr')}
                  className={`px-4 py-2 rounded-lg ${
                    translationDirection === 'en-fr'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  English → French
                </button>
                <button
                  onClick={() => setTranslationDirection('fr-en')}
                  className={`px-4 py-2 rounded-lg ${
                    translationDirection === 'fr-en'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  French → English
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translationDirection === 'en-fr' ? 'English' : 'Français'}
                  </label>
                  <input
                    type="text"
                    value={translationInput}
                    onChange={(e) => setTranslationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    placeholder="Type a word..."
                  />
                </div>
                <button
                  onClick={handleTranslate}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Translate
                </button>
                {translationResult && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {translationDirection === 'en-fr' ? 'Français' : 'English'}
                    </p>
                    <p className="text-xl font-semibold text-gray-800">{translationResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'match' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Memory Match</h2>
                <button
                  onClick={initializeMatchGame}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <RotateCw size={20} /> New Game
                </button>
              </div>

              {/* Score display */}
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
                  {/* Game completion message */}
                  {matchPairs > 0 && matchPairs === matchCards.length / 2 && (
                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</div>
                      <p className="text-gray-700">You've matched all pairs!</p>
                    </div>
                  )}

                  {/* Card grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {matchCards.map((card, index) => (
                      <div
                        key={card.id}
                        onClick={() => handleMatchCardClick(index)}
                        className={`relative h-32 cursor-pointer perspective-1000 ${
                          card.isMatched ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div
                          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                            card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                          }`}
                        >
                          {/* Back of card (question mark) */}
                          <div className="absolute inset-0 rounded-lg bg-indigo-500 shadow-lg flex items-center justify-center backface-hidden">
                            <div className="text-white text-3xl font-bold">?</div>
                          </div>

                          {/* Front of card (content) */}
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
                              {card.language === 'en' ? 'English' : 'Français'}
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

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      Click cards to flip them. Match English cards with their French translations!
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-500'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}