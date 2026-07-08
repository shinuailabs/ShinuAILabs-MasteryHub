/**
 * Lab 1000: AI Test Generator CLI - AI Test Generation
 *
 * CONCEPT:
 * This lab integrates OpenAI's GPT models to generate Playwright tests
 * based on the page analysis data. The AI understands the page structure
 * and creates meaningful, executable test cases.
 *
 * BULLET POINTS:
 * - OpenAI API integration for test generation
 * - Prompt engineering for quality test output
 * - Template-based code generation
 * - Test validation and formatting
 * - Error handling and retry logic
 */

import OpenAI from 'openai';
import { PageAnalysis } from './lab999_page_analyzer';

interface GeneratedTest {
  name: string;
  description: string;
  code: string;
  type: 'smoke' | 'functional' | 'e2e' | 'validation';
}

interface GenerationOptions {
  model: string;
  maxTests: number;
  includeComments: boolean;
  testStyle: 'descriptive' | 'concise';
}

class AITestGenerator {
  private openai: OpenAI;
  private defaultOptions: GenerationOptions = {
    model: 'gpt-4',
    maxTests: 10,
    includeComments: true,
    testStyle: 'descriptive'
  };

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateTests(
    analysis: PageAnalysis,
    options: Partial<GenerationOptions> = {}
  ): Promise<GeneratedTest[]> {
    const opts = { ...this.defaultOptions, ...options };
    const prompt = this.buildPrompt(analysis, opts);

    const response = await this.openai.chat.completions.create({
      model: opts.model,
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content || '';
    return this.parseGeneratedTests(content);
  }

  private getSystemPrompt(): string {
    return `You are an expert Playwright test automation engineer. 
Your task is to generate high-quality, maintainable Playwright tests.

Guidelines:
- Use TypeScript with proper type annotations
- Follow Page Object Model patterns when appropriate
- Include meaningful test descriptions
- Use role-based locators (getByRole, getByLabel) when possible
- Add appropriate assertions for each action
- Handle async operations properly
- Include error scenarios and edge cases

Output format: Return tests as JSON array with structure:
[{ "name": "test name", "description": "what it tests", "code": "full test code", "type": "test type" }]`;
  }

  private buildPrompt(analysis: PageAnalysis, options: GenerationOptions): string {
    return `Generate Playwright tests for this page:

URL: ${analysis.url}
Title: ${analysis.title}

Page Elements:
${JSON.stringify(analysis.elements.slice(0, 50), null, 2)}

Forms:
${JSON.stringify(analysis.forms, null, 2)}

Navigation:
${JSON.stringify(analysis.navigation.slice(0, 20), null, 2)}

Page Metadata:
${JSON.stringify(analysis.metadata, null, 2)}

Requirements:
- Generate up to ${options.maxTests} tests
- Test style: ${options.testStyle}
- Include comments: ${options.includeComments}
- Cover: happy paths, validation, error handling
- Use modern Playwright best practices

Generate comprehensive tests that a QA engineer would write.`;
  }

  private parseGeneratedTests(content: string): GeneratedTest[] {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Failed to parse generated tests:', error);
      return [];
    }
  }
}

// Example generated test output
const exampleGeneratedTest: GeneratedTest = {
  name: 'should login with valid credentials',
  description: 'Verifies that a user can successfully log in with valid email and password',
  type: 'functional',
  code: `
import { test, expect } from '@playwright/test';

test('should login with valid credentials', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in credentials
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  
  // Submit form
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Verify successful login
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
`
};

/**
 * EXERCISE:
 * 1. Implement retry logic for API failures
 * 2. Add test validation to ensure generated code is syntactically correct
 * 3. Create different prompt templates for different page types
 * 4. Add support for generating Page Objects alongside tests
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 */

// Q1: Validate generated test syntax
function validateTestSyntax(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!code.includes("import { test")) {
    errors.push('Missing Playwright test import');
  }
  if (!code.includes("async ({ page })")) {
    errors.push('Missing async page fixture');
  }
  if (!code.includes("await")) {
    errors.push('Missing await for async operations');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * LEARNING:
 * - Quality prompts produce quality tests
 * - AI-generated tests need human review
 * - Structured output makes parsing reliable
 * - Context (page analysis) improves generation accuracy
 *
 * ONE LINER:
 * "AI generates the tests, engineers validate the quality."
 */

export { AITestGenerator, GeneratedTest, GenerationOptions, validateTestSyntax };

