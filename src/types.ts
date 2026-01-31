export type TargetLanguage = 'fr' | 'es';

export interface Example {
  en: string;
  target: string; // French or Spanish translation
}

export interface GrammarRule {
  id: string;
  level: string;
  category: string;
  english: string;
  ruleTarget: string; // Rule description in target language
  examples: Example[];
  tags: string[];
}

export interface GeneratedFlashcard {
  id: string;
  ruleId: string;
  ruleEnglish: string;
  ruleTarget: string;
  level: string;
  category: string;
  english: string;
  target: string; // Translation in target language
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
  language: 'en' | 'target';
  flashcardId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface AddFlashcardFormData {
  english: string;
  target: string;
  level: string;
  category: string;
  ruleEnglish?: string;
  ruleTarget?: string;
  tags?: string[];
}
