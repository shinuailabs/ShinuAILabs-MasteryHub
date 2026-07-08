# Lab 908: Large Language Models (LLMs) Overview

## Concept
Large Language Models (LLMs) are AI models trained on massive text datasets that can understand and generate human-like text. For QA engineers, LLMs like GPT-4, Claude, and Gemini can generate tests, explain code, debug failures, and even write documentation. Understanding how LLMs work helps you use them effectively in testing.

## Bullet Points
- **LLM**: Neural network trained on billions of text tokens
- **Tokens**: Basic units of text (words, subwords, characters)
- **Context Window**: Maximum input size the model can process
- **Temperature**: Controls randomness in outputs (0=deterministic, 1=creative)
- **Prompt**: Input text that guides the model's response
- **Fine-tuning**: Customizing a model for specific tasks
- **RAG**: Retrieval-Augmented Generation - combining LLMs with external knowledge
- **Hallucination**: When LLMs generate plausible but incorrect information

## Examples

### Example 1: Popular LLMs for Testing
```typescript
// LLM Comparison for QA Tasks
const llmComparison = {
  'GPT-4': {
    provider: 'OpenAI',
    strengths: ['Code generation', 'Complex reasoning', 'Large context'],
    contextWindow: '128K tokens',
    bestFor: 'Complex test scenarios, debugging'
  },
  'Claude': {
    provider: 'Anthropic',
    strengths: ['Long documents', 'Detailed analysis', 'Safety'],
    contextWindow: '200K tokens',
    bestFor: 'Test documentation, code review'
  },
  'Gemini': {
    provider: 'Google',
    strengths: ['Multimodal', 'Fast', 'Integration'],
    contextWindow: '1M tokens',
    bestFor: 'Visual testing, large codebases'
  },
  'Llama': {
    provider: 'Meta (Open Source)',
    strengths: ['Free', 'Customizable', 'Privacy'],
    contextWindow: '8K-128K tokens',
    bestFor: 'Local deployment, sensitive data'
  }
};
```

### Example 2: Using LLM for Test Generation
```typescript
// Prompt for generating Playwright tests
const prompt = `
Generate a Playwright test for the following user story:

User Story: As a user, I want to reset my password so I can regain access to my account.

Acceptance Criteria:
1. User clicks "Forgot Password" link
2. User enters email address
3. User receives confirmation message
4. Email validation shows error for invalid format

Generate TypeScript Playwright test with proper assertions.
`;

// LLM Response (Generated Test)
import { test, expect } from '@playwright/test';

test.describe('Password Reset', () => {
  test('should allow user to request password reset', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot Password');
    await page.fill('[name="email"]', 'user@example.com');
    await page.click('button:has-text("Reset Password")');
    await expect(page.locator('.success-message')).toContainText('Check your email');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('[name="email"]', 'invalid-email');
    await page.click('button:has-text("Reset Password")');
    await expect(page.locator('.error-message')).toContainText('Invalid email');
  });
});
```

### Example 3: LLM for Debugging Test Failures
```typescript
// Prompt for debugging
const debugPrompt = `
My Playwright test is failing with this error:

Error: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for locator('#submit-button')
============================================================

Test code:
await page.click('#submit-button');

The button exists on the page but test times out. What could be wrong?
`;

// LLM Analysis Response:
/*
Possible causes and solutions:

1. **Button is not visible**: The button might be hidden or off-screen
   Solution: await page.locator('#submit-button').scrollIntoViewIfNeeded();

2. **Button is disabled**: Check if button is enabled
   Solution: await expect(page.locator('#submit-button')).toBeEnabled();

3. **Overlay blocking**: Modal or loading spinner might be covering it
   Solution: await page.waitForSelector('.loading', { state: 'hidden' });

4. **Dynamic ID**: ID might be dynamically generated
   Solution: Use more stable locator like data-testid or role

5. **iframe**: Button might be inside an iframe
   Solution: const frame = page.frameLocator('iframe');
            await frame.locator('#submit-button').click();
*/
```

## Exercise

### Task 1: Compare LLMs
Use 3 different LLMs to generate a login test and compare the quality.

### Task 2: Prompt Engineering
Write 3 different prompts for the same test scenario and evaluate which produces better results.

### Task 3: Identify Hallucinations
Ask an LLM to generate tests for a fictional API and identify any hallucinated methods or assertions.

## Coding Questions & Solutions

### Question 1: Create an LLM prompt builder
```typescript
// Solution:
interface TestPromptConfig {
  feature: string;
  userStory: string;
  acceptanceCriteria: string[];
  framework: 'playwright' | 'cypress' | 'selenium';
  language: 'typescript' | 'javascript';
}

function buildTestGenerationPrompt(config: TestPromptConfig): string {
  return `
Generate a ${config.framework} test in ${config.language}.

Feature: ${config.feature}
User Story: ${config.userStory}

Acceptance Criteria:
${config.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Requirements:
- Use Page Object Model pattern
- Include proper assertions
- Add meaningful test descriptions
- Handle potential errors gracefully
- Use best practices for ${config.framework}
`.trim();
}

// Usage
const prompt = buildTestGenerationPrompt({
  feature: 'User Registration',
  userStory: 'As a new user, I want to create an account',
  acceptanceCriteria: [
    'User can enter email and password',
    'Password must be at least 8 characters',
    'User sees success message after registration'
  ],
  framework: 'playwright',
  language: 'typescript'
});
```

### Question 2: LLM response parser
```typescript
// Solution: Extract code blocks from LLM response
function extractCodeFromLLMResponse(response: string): string[] {
  const codeBlockRegex = /```(?:typescript|javascript|ts|js)?\n([\s\S]*?)```/g;
  const codeBlocks: string[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(response)) !== null) {
    codeBlocks.push(match[1].trim());
  }
  
  return codeBlocks;
}

// Usage
const llmResponse = `
Here's the test:
\`\`\`typescript
test('login test', async ({ page }) => {
  await page.goto('/login');
});
\`\`\`
`;

console.log(extractCodeFromLLMResponse(llmResponse));
```

## Learning
- LLMs are powerful tools for test generation and debugging
- Different LLMs have different strengths - choose based on your needs
- Context window size matters for large codebases
- Always verify LLM-generated code - hallucinations are common
- Prompt quality directly affects output quality
- LLMs work best as assistants, not replacements

## One Liner
> "LLMs are like having a junior developer who knows everything but sometimes makes things up - always review their work."

