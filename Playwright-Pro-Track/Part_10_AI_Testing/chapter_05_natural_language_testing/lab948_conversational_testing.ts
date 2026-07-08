/**
 * Lab 948: Conversational Testing with AI
 *
 * CONCEPT:
 * Conversational testing allows QA engineers to interact with AI through
 * natural dialogue to create, modify, and debug tests. The AI understands
 * context and can refine tests based on feedback.
 *
 * BULLET POINTS:
 * - Chat-based test creation
 * - Iterative refinement through dialogue
 * - Context-aware suggestions
 * - Debug tests conversationally
 * - Learn from corrections
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Conversation state management
interface ConversationContext {
  currentTest: string | null;
  pageUrl: string | null;
  locators: Map<string, string>;
  history: { role: 'user' | 'ai'; message: string }[];
}

class ConversationalTestBuilder {
  private context: ConversationContext = {
    currentTest: null,
    pageUrl: null,
    locators: new Map(),
    history: [],
  };

  async processMessage(message: string): Promise<string> {
    this.context.history.push({ role: 'user', message });

    const response = await this.generateResponse(message);
    this.context.history.push({ role: 'ai', message: response });

    return response;
  }

  private async generateResponse(message: string): Promise<string> {
    const msgLower = message.toLowerCase();

    // Create new test
    if (msgLower.includes('create') && msgLower.includes('test')) {
      const testName = message.match(/test (?:for |called |named )?["']?([^"']+)["']?/i)?.[1];
      this.context.currentTest = testName || 'new test';
      return `I'll create a test called "${this.context.currentTest}". What should it do?`;
    }

    // Set page URL
    if (msgLower.includes('go to') || msgLower.includes('navigate')) {
      const url = message.match(/(?:go to|navigate to)\s+["']?([^"'\s]+)["']?/i)?.[1];
      this.context.pageUrl = url || '/';
      return `Got it, the test will start at ${this.context.pageUrl}. What's the next step?`;
    }

    // Add action
    if (msgLower.includes('click') || msgLower.includes('enter') || msgLower.includes('fill')) {
      return `I've added that action. What should happen next?`;
    }

    // Add assertion
    if (msgLower.includes('should') || msgLower.includes('verify') || msgLower.includes('expect')) {
      return `I've added that assertion. Anything else to verify?`;
    }

    // Generate test
    if (msgLower.includes('generate') || msgLower.includes('done') || msgLower.includes('finish')) {
      return this.generateTestCode();
    }

    return `I'm not sure what you mean. You can:
- Create a test for [feature]
- Go to [url]
- Click on [element]
- Enter [value] in [field]
- Verify [condition]
- Generate the test`;
  }

  private generateTestCode(): string {
    return `Here's your test:

\`\`\`typescript
test('${this.context.currentTest}', async ({ page }) => {
  await page.goto('${this.context.pageUrl}');
  // Actions from conversation
  // Assertions from conversation
});
\`\`\`

Would you like me to modify anything?`;
  }

  getHistory(): { role: string; message: string }[] {
    return this.context.history;
  }
}

// Example 2: Sample conversation
async function sampleConversation(): Promise<void> {
  const builder = new ConversationalTestBuilder();

  const conversation = [
    'Create a test for user login',
    'Go to /login',
    'Enter "user@example.com" in the email field',
    'Enter "password123" in the password field',
    'Click the login button',
    'Verify the user sees the dashboard',
    'Generate the test',
  ];

  for (const message of conversation) {
    console.log(`User: ${message}`);
    const response = await builder.processMessage(message);
    console.log(`AI: ${response}\n`);
  }
}

// Example 3: Refinement through dialogue
const refinementExamples = [
  { user: 'The test is failing', ai: 'What error are you seeing?' },
  { user: 'Element not found for login button', ai: 'Let me suggest alternative locators...' },
  { user: 'Use data-testid instead', ai: 'Updated to use [data-testid="login-btn"]' },
  { user: 'Add a wait before clicking', ai: 'Added waitForSelector before the click' },
];

// Example 4: Context-aware suggestions
function suggestNextStep(context: ConversationContext): string[] {
  const suggestions: string[] = [];

  if (!context.pageUrl) {
    suggestions.push('Navigate to a page first');
  } else if (context.locators.size === 0) {
    suggestions.push('Add some interactions (click, fill, etc.)');
  } else {
    suggestions.push('Add assertions to verify behavior');
    suggestions.push('Generate the test code');
  }

  return suggestions;
}

/**
 * EXERCISE:
 * 1. Start a conversation to create a test
 * 2. Refine the test through dialogue
 * 3. Debug a failing test conversationally
 * 4. Generate and run the final test
 *
 * LEARNING:
 * - Conversation enables iterative refinement
 * - Context helps AI understand intent
 * - Dialogue is natural for test creation
 * - AI learns from corrections
 *
 * ONE LINER:
 * "Chat with AI to create tests - it's like pair programming with an expert."
 */

export { ConversationalTestBuilder, sampleConversation, suggestNextStep };

