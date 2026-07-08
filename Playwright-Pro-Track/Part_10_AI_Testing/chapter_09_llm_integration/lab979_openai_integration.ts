/**
 * Lab 979: OpenAI API Integration for Testing
 *
 * CONCEPT:
 * Integrate OpenAI's API to enhance test automation with AI capabilities
 * like test generation, failure analysis, and natural language processing.
 *
 * BULLET POINTS:
 * - API setup and configuration
 * - Prompt engineering for testing
 * - Test generation with GPT
 * - Error analysis automation
 * - Cost optimization
 */

// Example 1: OpenAI client setup
interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class OpenAITestingClient {
  private config: OpenAIConfig;

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: config.model || 'gpt-4',
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7,
    };
  }

  async generateTest(requirements: string): Promise<string> {
    const prompt = `Generate a Playwright test in TypeScript for the following requirement:

${requirements}

Follow these guidelines:
- Use data-testid attributes for locators
- Include proper assertions
- Add comments explaining each step
- Handle loading states appropriately

Return only the test code.`;

    return this.callAPI(prompt);
  }

  async analyzeFailure(error: string, testCode: string): Promise<string> {
    const prompt = `Analyze this test failure and suggest fixes:

Test code:
\`\`\`typescript
${testCode}
\`\`\`

Error message:
${error}

Provide:
1. Root cause analysis
2. Suggested fix
3. Prevention tips`;

    return this.callAPI(prompt);
  }

  async improveLocator(currentLocator: string, htmlContext: string): Promise<string> {
    const prompt = `Suggest a better locator for this element:

Current locator: ${currentLocator}
HTML context: ${htmlContext}

Provide a more robust locator using this priority:
1. data-testid
2. role + name
3. text content
4. CSS selector`;

    return this.callAPI(prompt);
  }

  private async callAPI(prompt: string): Promise<string> {
    // Simulated API call - in real implementation use fetch or openai package
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

// Example 2: Test generation workflow
async function generateTestFromRequirement(requirement: string): Promise<void> {
  const client = new OpenAITestingClient();

  console.log('Generating test for:', requirement);
  const testCode = await client.generateTest(requirement);
  console.log('Generated test:\n', testCode);
}

// Example 3: Failure analysis workflow
async function analyzeTestFailure(error: Error, testCode: string): Promise<void> {
  const client = new OpenAITestingClient();

  console.log('Analyzing failure...');
  const analysis = await client.analyzeFailure(error.message, testCode);
  console.log('Analysis:\n', analysis);
}

// Example 4: Cost optimization tips
const costOptimizationTips = {
  modelSelection: 'Use gpt-3.5-turbo for simple tasks, gpt-4 for complex analysis',
  tokenManagement: 'Keep prompts concise, limit response length',
  caching: 'Cache common responses to avoid repeated API calls',
  batching: 'Batch multiple requests when possible',
  rateLimit: 'Implement rate limiting to avoid quota issues',
};

// Example 5: Error handling
async function safeAPICall<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('API call failed:', error);
    return fallback;
  }
}

/**
 * EXERCISE:
 * 1. Set up OpenAI API credentials
 * 2. Generate tests from requirements
 * 3. Analyze test failures
 * 4. Optimize costs
 *
 * CODING QUESTION:
 * Create a function that retries API calls with exponential backoff.
 *
 * SOLUTION:
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * LEARNING:
 * - OpenAI enhances test automation
 * - Prompt engineering is crucial
 * - Cost management matters
 * - Error handling is essential
 *
 * ONE LINER:
 * "OpenAI transforms your test automation - generate, analyze, and improve with AI."
 */

export { OpenAITestingClient, costOptimizationTips, retryWithBackoff };

