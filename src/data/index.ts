import type { GrammarRule, GeneratedFlashcard, TargetLanguage } from '../types';
import a1Data from '../a1.json';
import a2Data from '../a2.json';
import b1Data from '../b1.json';
import b2Data from '../b2.json';
import a1EsData from '../a1-es.json';
import a2EsData from '../a2-es.json';
import b1EsData from '../b1-es.json';
import b2EsData from '../b2-es.json';

// Raw JSON structure for French files (uses fr, french)
interface RawFrenchExample {
  en: string;
  fr: string;
}
interface RawFrenchRule {
  id: string;
  level: string;
  category: string;
  english: string;
  french: string;
  examples: RawFrenchExample[];
  tags: string[];
}

// Raw JSON structure for Spanish files (uses es, spanish)
interface RawSpanishExample {
  en: string;
  es: string;
}
interface RawSpanishRule {
  id: string;
  level: string;
  category: string;
  english: string;
  spanish: string;
  examples: RawSpanishExample[];
  tags: string[];
}

function normalizeFrenchRules(raw: unknown[]): GrammarRule[] {
  return (raw as RawFrenchRule[]).map((r) => ({
    id: r.id,
    level: r.level,
    category: r.category,
    english: r.english,
    ruleTarget: r.french,
    examples: r.examples.map((e) => ({ en: e.en, target: e.fr })),
    tags: r.tags,
  }));
}

function normalizeSpanishRules(raw: unknown[]): GrammarRule[] {
  return (raw as RawSpanishRule[]).map((r) => ({
    id: r.id,
    level: r.level,
    category: r.category,
    english: r.english,
    ruleTarget: r.spanish,
    examples: r.examples.map((e) => ({ en: e.en, target: e.es })),
    tags: r.tags,
  }));
}

const allRulesFr: GrammarRule[] = [
  ...normalizeFrenchRules(a1Data as unknown[]),
  ...normalizeFrenchRules(a2Data as unknown[]),
  ...normalizeFrenchRules(b1Data as unknown[]),
  ...normalizeFrenchRules(b2Data as unknown[]),
];

const allRulesEs: GrammarRule[] = [
  ...normalizeSpanishRules(a1EsData as unknown[]),
  ...normalizeSpanishRules(a2EsData as unknown[]),
  ...normalizeSpanishRules(b1EsData as unknown[]),
  ...normalizeSpanishRules(b2EsData as unknown[]),
];

export function getAllRules(lang: TargetLanguage): GrammarRule[] {
  return lang === 'fr' ? allRulesFr : allRulesEs;
}

export function generateFlashcardsFromRule(
  rule: GrammarRule
): GeneratedFlashcard[] {
  if (!rule || !Array.isArray(rule.examples)) {
    return [];
  }

  return rule.examples.map((example, idx) => ({
    id: `${rule.id}_${idx}`,
    ruleId: rule.id,
    ruleEnglish: rule.english,
    ruleTarget: rule.ruleTarget,
    level: rule.level,
    category: rule.category,
    english: example.en,
    target: example.target,
    tags: rule.tags,
  }));
}

// French vocab
export const vocabDataFr = [
  { english: 'Hello', target: 'Bonjour', category: 'Greetings' },
  { english: 'Goodbye', target: 'Au revoir', category: 'Greetings' },
  { english: 'Please', target: "S'il vous plaît", category: 'Politeness' },
  { english: 'Thank you', target: 'Merci', category: 'Politeness' },
  { english: 'Water', target: 'Eau', category: 'Food & Drink' },
  { english: 'Bread', target: 'Pain', category: 'Food & Drink' },
  { english: 'House', target: 'Maison', category: 'Places' },
  { english: 'School', target: 'École', category: 'Places' },
  { english: 'Cat', target: 'Chat', category: 'Animals' },
  { english: 'Dog', target: 'Chien', category: 'Animals' },
  { english: 'Book', target: 'Livre', category: 'Objects' },
  { english: 'Car', target: 'Voiture', category: 'Transport' },
];

// Spanish vocab
export const vocabDataEs = [
  { english: 'Hello', target: 'Hola', category: 'Greetings' },
  { english: 'Goodbye', target: 'Adiós', category: 'Greetings' },
  { english: 'Please', target: 'Por favor', category: 'Politeness' },
  { english: 'Thank you', target: 'Gracias', category: 'Politeness' },
  { english: 'Water', target: 'Agua', category: 'Food & Drink' },
  { english: 'Bread', target: 'Pan', category: 'Food & Drink' },
  { english: 'House', target: 'Casa', category: 'Places' },
  { english: 'School', target: 'Escuela', category: 'Places' },
  { english: 'Cat', target: 'Gato', category: 'Animals' },
  { english: 'Dog', target: 'Perro', category: 'Animals' },
  { english: 'Book', target: 'Libro', category: 'Objects' },
  { english: 'Car', target: 'Coche', category: 'Transport' },
];

export function getVocabData(lang: TargetLanguage) {
  return lang === 'fr' ? vocabDataFr : vocabDataEs;
}
