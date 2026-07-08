/**
 * Lab 982: Prompt Engineering for Test Automation
 *
 * CONCEPT:
 * Effective prompts are crucial for getting quality results from LLMs.
 * Learn techniques to craft prompts that generate reliable test code
 * and accurate analysis.
 *
 * BULLET POINTS:
 * - Prompt structure and components
 * - Few-shot learning
 * - Chain of thought prompting
 * - Context optimization
 * - Output formatting
 */

// Example 1: Prompt templates
interface PromptTemplate {
  name: string;
  template: string;
  variables: string[];
}

const testGenerationPrompt: PromptTemplate = {
  name: 'Test Generation',
  template: `You are an expert Playwright test engineer. Generate a comprehensive test.

CONTEXT:
Application: {appName}
Feature: {feature}
User Story: {userStory}

REQUIREMENTS:
- Use TypeScript with Playwright
- Use data-testid attributes for locators
- Include proper error handling
- Add meaningful assertions
- Follow AAA pattern (Arrange, Act, Assert)

EXAMPLE:
\`\`\`typescript
test('user can login successfully', async ({ page }) => {
  // Arrange
  await page.goto('/login');
  
  // Act
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  
  // Assert
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="welcome"]')).toBeVisible();
});
\`\`\`

Now generate a test for the given requirements. Return only the code.`,
  variables: ['appName', 'feature', 'userStory'],
};

// Example 2: Prompt builder
class TestPromptBuilder {
  private context: string = '';
  private examples: string[] = [];
  private constraints: string[] = [];
  private outputFormat: string = '';

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  addExample(example: string): this {
    this.examples.push(example);
    return this;
  }

  addConstraint(constraint: string): this {
    this.constraints.push(constraint);
    return this;
  }

  setOutputFormat(format: string): this {
    this.outputFormat = format;
    return this;
  }

  build(): string {
    let prompt = '';

    if (this.context) {
      prompt += `CONTEXT:\n${this.context}\n\n`;
    }

    if (this.constraints.length > 0) {
      prompt += 'REQUIREMENTS:\n';
      this.constraints.forEach((c) => (prompt += `- ${c}\n`));
      prompt += '\n';
    }

    if (this.examples.length > 0) {
      prompt += 'EXAMPLES:\n';
      this.examples.forEach((e, i) => (prompt += `Example ${i + 1}:\n${e}\n\n`));
    }

    if (this.outputFormat) {
      prompt += `OUTPUT FORMAT:\n${this.outputFormat}\n`;
    }

    return prompt;
  }
}

// Example 3: Chain of thought prompting
const chainOfThoughtPrompt = `Analyze this test failure step by step:

Error: {error}
Test Code: {testCode}

Think through this systematically:

1. UNDERSTAND: What is the test trying to do?
   [Your analysis]

2. IDENTIFY: What specific line or action failed?
   [Your analysis]

3. HYPOTHESIZE: What could cause this failure?
   [List 3 possible causes]

4. INVESTIGATE: What evidence supports each hypothesis?
   [Your analysis]

5. CONCLUDE: What is the most likely root cause?
   [Your conclusion]

6. FIX: How should we fix this?
   [Your recommendation]`;

// Example 4: Few-shot learning examples
const fewShotExamples = {
  testGeneration: [
    {
      input: 'Test login with invalid email',
      output: `test('shows error for invalid email', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'invalid-email');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email');
});`,
    },
  ],
  errorFix: [
    {
      input: 'Timeout waiting for selector [data-testid="submit"]',
      output: 'Add await page.waitForSelector before clicking, or check if element exists',
    },
  ],
};

// Example 5: Using the prompt builder
function createTestGenerationPrompt(requirement: string): string {
  return new TestPromptBuilder()
    .setContext(`Generate a Playwright test for: ${requirement}`)
    .addConstraint('Use TypeScript')
    .addConstraint('Use data-testid locators')
    .addConstraint('Include assertions')
    .addConstraint('Handle loading states')
    .addExample(fewShotExamples.testGeneration[0].output)
    .setOutputFormat('Return only valid TypeScript code')
    .build();
}

/**
 * EXERCISE:
 * 1. Create prompt templates
 * 2. Use few-shot examples
 * 3. Apply chain of thought
 * 4. Optimize for your use case
 *
 * CODING QUESTION:
 * Create a prompt for generating test data.
 *
 * SOLUTION:
 */
function createTestDataPrompt(schema: string): string {
  return new TestPromptBuilder()
    .setContext(`Generate realistic test data for: ${schema}`)
    .addConstraint('Data must be valid and realistic')
    .addConstraint('Include edge cases')
    .addConstraint('Return as JSON array')
    .setOutputFormat('JSON array with 5 test data objects')
    .build();
}

/**
 * LEARNING:
 * - Structure improves results
 * - Examples guide output
 * - Chain of thought aids reasoning
 * - Constraints ensure quality
 *
 * ONE LINER:
 * "Good prompts get good tests - craft your prompts like you craft your code."
 */

export { TestPromptBuilder, testGenerationPrompt, chainOfThoughtPrompt, createTestDataPrompt };

