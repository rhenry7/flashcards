import type { GrammarRule, GeneratedFlashcard } from '../types';
import a1Data from '../a1.json';
import a2Data from '../a2.json';
import b1Data from '../b1.json';
import b2Data from '../b2.json';

export const allRules: GrammarRule[] = [
  ...(a1Data as unknown as GrammarRule[]),
  ...(a2Data as unknown as GrammarRule[]),
  ...(b1Data as unknown as GrammarRule[]),
  ...(b2Data as unknown as GrammarRule[]),
];

export function generateFlashcardsFromRule(rule: GrammarRule): GeneratedFlashcard[] {
  if (!rule || !Array.isArray(rule.examples)) {
    return [];
  }

  return rule.examples.map((example, idx) => ({
    id: `${rule.id}_${idx}`,
    ruleId: rule.id,
    ruleEnglish: rule.english,
    ruleFrench: rule.french,
    level: rule.level,
    category: rule.category,
    english: example.en,
    french: example.fr,
    tags: rule.tags,
  }));
}

export const vocabData = [
  { english: 'Hello', french: 'Bonjour', category: 'Greetings' },
  { english: 'Goodbye', french: 'Au revoir', category: 'Greetings' },
  { english: 'Please', french: "S'il vous plaît", category: 'Politeness' },
  { english: 'Thank you', french: 'Merci', category: 'Politeness' },
  { english: 'Water', french: 'Eau', category: 'Food & Drink' },
  { english: 'Bread', french: 'Pain', category: 'Food & Drink' },
  { english: 'House', french: 'Maison', category: 'Places' },
  { english: 'School', french: 'École', category: 'Places' },
  { english: 'Cat', french: 'Chat', category: 'Animals' },
  { english: 'Dog', french: 'Chien', category: 'Animals' },
  { english: 'Book', french: 'Livre', category: 'Objects' },
  { english: 'Car', french: 'Voiture', category: 'Transport' },
];
