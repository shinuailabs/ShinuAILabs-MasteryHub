/**
 * Lab 943: Natural Language Testing Basics
 *
 * CONCEPT:
 * Natural Language Processing (NLP) enables writing tests in plain English
 * that are automatically converted to executable code. This makes tests
 * more accessible to non-technical stakeholders.
 *
 * BULLET POINTS:
 * - Write tests in plain English
 * - AI converts to executable code
 * - Accessible to business users
 * - Self-documenting tests
 * - Bridge between requirements and tests
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Natural language test parser
interface ParsedStep {
  action: 'navigate' | 'click' | 'fill' | 'verify' | 'wait';
  target?: string;
  value?: string;
  assertion?: string;
}

function parseNaturalLanguage(step: string): ParsedStep {
  const stepLower = step.toLowerCase();

  if (stepLower.includes('go to') || stepLower.includes('navigate to')) {
    const url = step.match(/(?:go to|navigate to)\s+["']?([^"']+)["']?/i)?.[1];
    return { action: 'navigate', value: url };
  }

  if (stepLower.includes('click')) {
    const target = step.match(/click\s+(?:on\s+)?(?:the\s+)?["']?([^"']+)["']?/i)?.[1];
    return { action: 'click', target };
  }

  if (stepLower.includes('enter') || stepLower.includes('type') || stepLower.includes('fill')) {
    const match = step.match(/(?:enter|type|fill)\s+["']([^"']+)["']\s+(?:in|into)\s+(?:the\s+)?["']?([^"']+)["']?/i);
    return { action: 'fill', value: match?.[1], target: match?.[2] };
  }

  if (stepLower.includes('should') || stepLower.includes('verify') || stepLower.includes('see')) {
    return { action: 'verify', assertion: step };
  }

  if (stepLower.includes('wait')) {
    return { action: 'wait', value: step };
  }

  return { action: 'verify', assertion: step };
}

// Example 2: Execute parsed steps
async function executeStep(page: Page, step: ParsedStep): Promise<void> {
  switch (step.action) {
    case 'navigate':
      await page.goto(step.value || '/');
      break;
    case 'click':
      await page.getByRole('button', { name: new RegExp(step.target || '', 'i') })
        .or(page.getByText(step.target || ''))
        .click();
      break;
    case 'fill':
      await page.getByLabel(new RegExp(step.target || '', 'i'))
        .or(page.getByPlaceholder(new RegExp(step.target || '', 'i')))
        .fill(step.value || '');
      break;
    case 'verify':
      if (step.assertion?.includes('visible')) {
        const text = step.assertion.match(/["']([^"']+)["']/)?.[1];
        if (text) {
          await expect(page.getByText(text)).toBeVisible();
        }
      }
      break;
    case 'wait':
      await page.waitForTimeout(1000);
      break;
  }
}

// Example 3: Natural language test runner
async function runNaturalLanguageTest(page: Page, steps: string[]): Promise<void> {
  for (const step of steps) {
    console.log(`Executing: ${step}`);
    const parsed = parseNaturalLanguage(step);
    await executeStep(page, parsed);
  }
}

// Example 4: Using natural language tests
test.describe('Natural Language Tests', () => {
  test('login flow in plain English', async ({ page }) => {
    const steps = [
      'Go to "/login"',
      'Enter "user@example.com" in the "Email" field',
      'Enter "password123" in the "Password" field',
      'Click on the "Log in" button',
      'I should see "Welcome" visible on the page',
    ];

    await runNaturalLanguageTest(page, steps);
  });

  test('search functionality', async ({ page }) => {
    const steps = [
      'Navigate to "/"',
      'Type "laptop" into the "Search" field',
      'Click the "Search" button',
      'Verify "results" is visible',
    ];

    await runNaturalLanguageTest(page, steps);
  });
});

// Example 5: AI-enhanced natural language understanding
interface NLPTestCase {
  description: string;
  steps: string[];
  expectedOutcome: string;
}

const nlpTestCases: NLPTestCase[] = [
  {
    description: 'User can complete checkout',
    steps: [
      'As a logged-in user',
      'When I add a product to my cart',
      'And I proceed to checkout',
      'And I enter my payment details',
      'Then I should see an order confirmation',
    ],
    expectedOutcome: 'Order confirmation page displayed',
  },
];

/**
 * EXERCISE:
 * 1. Write a test in plain English
 * 2. Parse it into executable steps
 * 3. Run the natural language test
 * 4. Improve the parser for your domain
 *
 * LEARNING:
 * - NLP makes tests accessible
 * - Plain English improves readability
 * - AI can parse natural language
 * - Bridge technical and business teams
 *
 * ONE LINER:
 * "Write tests like you're explaining to a colleague - AI handles the translation."
 */

export { parseNaturalLanguage, executeStep, runNaturalLanguageTest };

