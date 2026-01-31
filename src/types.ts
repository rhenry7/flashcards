export interface Example {
  en: string;
  fr: string;
}

export interface GrammarRule {
  id: string;
  level: string;
  category: string;
  english: string;
  french: string;
  examples: Example[];
  tags: string[];
}

export interface GeneratedFlashcard {
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

export interface QuizQuestion {
  question: string;
  questionText: string;
  options: string[];
  correct: number;
  flashcardId: string;
  direction: 'en-fr' | 'fr-en';
}

export interface MatchCard {
  id: string;
  content: string;
  language: 'en' | 'fr';
  flashcardId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface AddFlashcardFormData {
  english: string;
  french: string;
  level: string;
  category: string;
  ruleEnglish?: string;
  ruleFrench?: string;
  tags?: string[];
}
