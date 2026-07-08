/**
 * Lab 951: NLP Testing Best Practices
 *
 * CONCEPT:
 * Following best practices for natural language testing ensures accurate
 * interpretation and high-quality test generation. This lab consolidates
 * key principles for effective NLP-based testing.
 *
 * BULLET POINTS:
 * - Write clear, unambiguous descriptions
 * - Use consistent terminology
 * - Provide context when needed
 * - Review generated tests
 * - Iterate on unclear inputs
 */

import { test, expect, Page } from '@playwright/test';

// Best Practice 1: Clear and specific descriptions
const goodDescriptions = [
  'Test that a registered user can login with valid email and password',
  'Verify that clicking "Add to Cart" increases cart count by 1',
  'Check that invalid email format shows error message "Please enter valid email"',
];

const badDescriptions = [
  'Test login', // Too vague
  'Check the thing works', // Unclear
  'Make sure it does what it should', // No specifics
];

// Best Practice 2: Consistent terminology glossary
const terminologyGlossary: Record<string, string[]> = {
  user: ['user', 'customer', 'member', 'account holder'],
  login: ['login', 'sign in', 'authenticate', 'log in'],
  button: ['button', 'btn', 'CTA', 'action'],
  error: ['error', 'validation message', 'alert', 'warning'],
};

function normalizeTerminology(text: string): string {
  let normalized = text.toLowerCase();

  for (const [standard, variants] of Object.entries(terminologyGlossary)) {
    for (const variant of variants) {
      normalized = normalized.replace(new RegExp(variant, 'gi'), standard);
    }
  }

  return normalized;
}

// Best Practice 3: Structured input format
interface StructuredTestInput {
  feature: string;
  scenario: string;
  given: string[];
  when: string[];
  then: string[];
}

function parseStructuredInput(input: string): StructuredTestInput {
  const lines = input.split('\n').map((l) => l.trim());

  const result: StructuredTestInput = {
    feature: '',
    scenario: '',
    given: [],
    when: [],
    then: [],
  };

  let currentSection: 'given' | 'when' | 'then' | null = null;

  for (const line of lines) {
    if (line.startsWith('Feature:')) result.feature = line.replace('Feature:', '').trim();
    else if (line.startsWith('Scenario:')) result.scenario = line.replace('Scenario:', '').trim();
    else if (line.startsWith('Given')) {
      currentSection = 'given';
      result.given.push(line.replace('Given', '').trim());
    } else if (line.startsWith('When')) {
      currentSection = 'when';
      result.when.push(line.replace('When', '').trim());
    } else if (line.startsWith('Then')) {
      currentSection = 'then';
      result.then.push(line.replace('Then', '').trim());
    } else if (line.startsWith('And') && currentSection) {
      result[currentSection].push(line.replace('And', '').trim());
    }
  }

  return result;
}

// Best Practice 4: Validation and feedback
interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

function validateNLPInput(input: string): ValidationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for vague terms
  const vagueTerms = ['it', 'thing', 'stuff', 'something'];
  for (const term of vagueTerms) {
    if (new RegExp(`\\b${term}\\b`, 'i').test(input)) {
      issues.push(`Vague term "${term}" found - be more specific`);
    }
  }

  // Check for missing action
  const actionWords = ['click', 'enter', 'verify', 'check', 'navigate', 'fill'];
  if (!actionWords.some((a) => input.toLowerCase().includes(a))) {
    suggestions.push('Consider adding an action (click, enter, verify, etc.)');
  }

  // Check for missing assertion
  const assertionWords = ['should', 'expect', 'verify', 'must', 'will'];
  if (!assertionWords.some((a) => input.toLowerCase().includes(a))) {
    suggestions.push('Consider adding an expected outcome (should see, must display, etc.)');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Best Practice 5: Iterative refinement
class NLPTestRefiner {
  private history: { input: string; feedback: string }[] = [];

  refine(input: string): { refined: string; changes: string[] } {
    const changes: string[] = [];
    let refined = input;

    // Normalize terminology
    const normalized = normalizeTerminology(input);
    if (normalized !== input.toLowerCase()) {
      changes.push('Normalized terminology');
      refined = normalized;
    }

    // Add missing context
    if (!refined.includes('page') && !refined.includes('url')) {
      refined = `On the login page, ${refined}`;
      changes.push('Added page context');
    }

    // Validate
    const validation = validateNLPInput(refined);
    if (!validation.isValid) {
      changes.push(...validation.issues);
    }

    this.history.push({ input, feedback: changes.join('; ') });

    return { refined, changes };
  }
}

// Example usage
test.describe('NLP Best Practices', () => {
  test('demonstrates good NLP input', async ({ page }) => {
    const input = `
      Feature: User Authentication
      Scenario: Successful login
      Given I am on the login page
      When I enter "user@example.com" in the email field
      And I enter "password123" in the password field
      And I click the login button
      Then I should see the dashboard
      And I should see "Welcome" message
    `;

    const parsed = parseStructuredInput(input);
    console.log('Parsed input:', parsed);

    // Execute based on parsed structure
    await page.goto('/login');
    // ... implement steps
  });
});

/**
 * EXERCISE:
 * 1. Write test descriptions following best practices
 * 2. Validate your inputs
 * 3. Refine unclear descriptions
 * 4. Create a terminology glossary
 *
 * LEARNING:
 * - Clear descriptions = better tests
 * - Consistent terminology helps AI
 * - Validate inputs before generation
 * - Iterate to improve quality
 *
 * ONE LINER:
 * "Garbage in, garbage out - clear descriptions lead to quality tests."
 */

export { normalizeTerminology, parseStructuredInput, validateNLPInput, NLPTestRefiner };

