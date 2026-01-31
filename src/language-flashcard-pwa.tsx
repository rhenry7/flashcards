import { useState, useEffect, useMemo } from 'react';
import {
  GrammarTab,
  VocabTab,
  QuizTab,
  TranslateTab,
  MatchTab,
  BottomNav,
} from './components';
import { allRules, generateFlashcardsFromRule, vocabData } from './data';
import type { GeneratedFlashcard, QuizQuestion, MatchCard } from './types';
import type { AddFlashcardFormData } from './types';
import './components/flashcard-styles.css';

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
  const [translationDirection, setTranslationDirection] = useState<'en-fr' | 'fr-en'>('en-fr');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchPairs, setMatchPairs] = useState(0);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [customFlashcards, setCustomFlashcards] = useState<GeneratedFlashcard[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('customFlashcards');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading custom flashcards from localStorage:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('customFlashcards', JSON.stringify(customFlashcards));
      }
    } catch (error) {
      console.error('Error saving custom flashcards to localStorage:', error);
      if (error instanceof DOMException && error.code === 22) {
        alert('Warning: Could not save flashcard to browser storage. Storage may be full.');
      }
    }
  }, [customFlashcards]);

  const allFlashcards = useMemo(() => allRules.flatMap(generateFlashcardsFromRule), []);
  const combinedFlashcards = useMemo(
    () => [...allFlashcards, ...customFlashcards],
    [allFlashcards, customFlashcards],
  );
  const filteredFlashcards = useMemo(
    () =>
      combinedFlashcards.filter((card) => {
        const levelMatch = selectedLevel === 'all' || card.level === selectedLevel;
        const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
        return levelMatch && categoryMatch;
      }),
    [combinedFlashcards, selectedLevel, selectedCategory],
  );

  const levels = useMemo(() => {
    const allLevels = [...allRules.map((r) => r.level), ...customFlashcards.map((c) => c.level)];
    return ['all', ...Array.from(new Set(allLevels))];
  }, [customFlashcards]);

  const categories = useMemo(() => {
    const allCategories = [
      ...allRules.map((r) => r.category),
      ...customFlashcards.map((c) => c.category),
    ];
    return ['all', ...Array.from(new Set(allCategories))];
  }, [customFlashcards]);

  useEffect(() => {
    setGrammarIndex(0);
    setFlipped(false);
  }, [selectedLevel, selectedCategory]);

  useEffect(() => {
    if (grammarIndex >= filteredFlashcards.length && filteredFlashcards.length > 0) {
      setGrammarIndex(0);
    }
  }, [filteredFlashcards.length]);

  const handleNext = (
    current: number,
    max: number,
    setCurrent: (val: number) => void,
  ) => {
    setCurrent((current + 1) % max);
    setFlipped(false);
  };

  const handlePrev = (
    current: number,
    max: number,
    setCurrent: (val: number) => void,
  ) => {
    setCurrent((current - 1 + max) % max);
    setFlipped(false);
  };

  const generateQuizQuestions = () => {
    const availableCards =
      filteredFlashcards.length > 0 ? filteredFlashcards : combinedFlashcards;
    if (availableCards.length === 0) {
      setQuizQuestions([]);
      return;
    }

    const numQuestions = Math.min(10, availableCards.length);
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, numQuestions);

    const questions: QuizQuestion[] = selectedCards.map((flashcard) => {
      const direction = Math.random() > 0.5 ? 'en-fr' : 'fr-en';
      const questionText =
        direction === 'en-fr' ? flashcard.english : flashcard.french;
      const correctAnswer =
        direction === 'en-fr' ? flashcard.french : flashcard.english;
      const otherCards = availableCards.filter((c) => c.id !== flashcard.id);
      const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
      const numWrongAnswers = Math.min(3, otherCards.length);
      const wrongAnswers = shuffledOthers
        .slice(0, numWrongAnswers)
        .map((c) => (direction === 'en-fr' ? c.french : c.english));
      const allOptions = [correctAnswer, ...wrongAnswers].sort(
        () => Math.random() - 0.5,
      );
      const correctIndex = allOptions.indexOf(correctAnswer);

      return {
        question:
          direction === 'en-fr'
            ? `Translate to French: "${questionText}"`
            : `Translate to English: "${questionText}"`,
        questionText,
        options: allOptions,
        correct: correctIndex,
        flashcardId: flashcard.id,
        direction,
      };
    });

    setQuizQuestions(questions.sort(() => Math.random() - 0.5));
    setQuizAnswers([]);
    setQuizIndex(0);
    setShowQuizResult(false);
  };

  const initializeMatchGame = () => {
    const availableCards =
      filteredFlashcards.length > 0 ? filteredFlashcards : combinedFlashcards;
    const numPairs = Math.min(6, Math.floor(availableCards.length / 2));

    if (numPairs === 0) {
      setMatchCards([]);
      return;
    }

    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffled.slice(0, numPairs);

    const cards: MatchCard[] = [];
    selectedPairs.forEach((flashcard) => {
      cards.push({
        id: `en_${flashcard.id}`,
        content: flashcard.english,
        language: 'en',
        flashcardId: flashcard.id,
        isFlipped: false,
        isMatched: false,
      });
      cards.push({
        id: `fr_${flashcard.id}`,
        content: flashcard.french,
        language: 'fr',
        flashcardId: flashcard.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchScore(0);
    setMatchPairs(0);
  };

  const handleMatchCardClick = (index: number) => {
    if (
      isCheckingMatch ||
      matchCards[index].isFlipped ||
      matchCards[index].isMatched
    ) {
      return;
    }

    const newSelectedCards = [...selectedCards, index];
    const newCards = [...matchCards];
    newCards[index].isFlipped = true;
    setMatchCards(newCards);
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setIsCheckingMatch(true);
      const [firstIndex, secondIndex] = newSelectedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (
        firstCard.flashcardId === secondCard.flashcardId &&
        firstCard.language !== secondCard.language
      ) {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setMatchCards(updatedCards);
          setSelectedCards([]);
          setMatchScore((prev) => prev + 1);
          setMatchPairs((prev) => prev + 1);
          setIsCheckingMatch(false);
        }, 500);
      } else {
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

  useEffect(() => {
    if (activeTab === 'match') initializeMatchGame();
  }, [activeTab, filteredFlashcards.length, combinedFlashcards.length]);

  useEffect(() => {
    if (activeTab !== 'match') {
      setMatchCards([]);
      setSelectedCards([]);
      setMatchScore(0);
      setMatchPairs(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'quiz') generateQuizQuestions();
  }, [activeTab, filteredFlashcards.length, combinedFlashcards.length]);

  useEffect(() => {
    if (activeTab !== 'quiz') {
      setQuizQuestions([]);
      setQuizAnswers([]);
      setQuizIndex(0);
      setShowQuizResult(false);
    }
  }, [activeTab]);

  const handleTranslate = () => {
    const input = translationInput.toLowerCase().trim();

    const vocab = vocabData.find((v) =>
      translationDirection === 'en-fr'
        ? v.english.toLowerCase() === input
        : v.french.toLowerCase() === input,
    );

    if (vocab) {
      setTranslationResult(
        translationDirection === 'en-fr' ? vocab.french : vocab.english,
      );
      return;
    }

    const flashcard = combinedFlashcards.find((card) =>
      translationDirection === 'en-fr'
        ? card.english.toLowerCase() === input
        : card.french.toLowerCase() === input,
    );

    if (flashcard) {
      setTranslationResult(
        translationDirection === 'en-fr' ? flashcard.french : flashcard.english,
      );
    } else {
      setTranslationResult('Translation not found');
    }
  };

  const handleAddFlashcard = (flashcardData: AddFlashcardFormData) => {
    const newFlashcard: GeneratedFlashcard = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: 'custom',
      ruleEnglish: flashcardData.ruleEnglish || 'Custom flashcard',
      ruleFrench: flashcardData.ruleFrench || 'Carte personnalisée',
      level: flashcardData.level,
      category: flashcardData.category,
      english: flashcardData.english,
      french: flashcardData.french,
      tags: flashcardData.tags || [],
    };

    setCustomFlashcards([...customFlashcards, newFlashcard]);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Language Learning
          </h1>
          <p className="text-gray-600">English ⇄ Français</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {activeTab === 'grammar' && (
            <GrammarTab
              filteredFlashcards={filteredFlashcards}
              grammarIndex={grammarIndex}
              flipped={flipped}
              selectedLevel={selectedLevel}
              selectedCategory={selectedCategory}
              levels={levels}
              categories={categories}
              showAddForm={showAddForm}
              onSetFlipped={setFlipped}
              onSetSelectedLevel={setSelectedLevel}
              onSetSelectedCategory={setSelectedCategory}
              onSetShowAddForm={setShowAddForm}
              onAddFlashcard={handleAddFlashcard}
              onPrev={() =>
                handlePrev(grammarIndex, filteredFlashcards.length, setGrammarIndex)
              }
              onNext={() =>
                handleNext(grammarIndex, filteredFlashcards.length, setGrammarIndex)
              }
            />
          )}

          {activeTab === 'vocab' && (
            <VocabTab
              vocabIndex={vocabIndex}
              flipped={flipped}
              onSetFlipped={setFlipped}
              onPrev={() => handlePrev(vocabIndex, vocabData.length, setVocabIndex)}
              onNext={() => handleNext(vocabIndex, vocabData.length, setVocabIndex)}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTab
              quizQuestions={quizQuestions}
              quizIndex={quizIndex}
              quizAnswers={quizAnswers}
              showQuizResult={showQuizResult}
              onAnswer={(answerIndex) => {
                const newAnswers = [...quizAnswers];
                newAnswers[quizIndex] = answerIndex;
                setQuizAnswers(newAnswers);
              }}
              onPrev={() => setQuizIndex(quizIndex - 1)}
              onNext={() => setQuizIndex(quizIndex + 1)}
              onFinish={() => setShowQuizResult(true)}
              onReset={generateQuizQuestions}
              onNewQuiz={generateQuizQuestions}
            />
          )}

          {activeTab === 'translate' && (
            <TranslateTab
              translationInput={translationInput}
              translationResult={translationResult}
              translationDirection={translationDirection}
              onSetTranslationInput={setTranslationInput}
              onSetTranslationDirection={setTranslationDirection}
              onTranslate={handleTranslate}
            />
          )}

          {activeTab === 'match' && (
            <MatchTab
              matchCards={matchCards}
              matchPairs={matchPairs}
              matchScore={matchScore}
              onNewGame={initializeMatchGame}
              onCardClick={handleMatchCardClick}
            />
          )}
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
