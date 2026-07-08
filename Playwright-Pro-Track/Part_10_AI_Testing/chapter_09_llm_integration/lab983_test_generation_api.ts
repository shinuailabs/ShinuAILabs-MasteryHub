/**
 * Lab 983: Building a Test Generation API
 *
 * CONCEPT:
 * Create a reusable API service that wraps LLM capabilities for test
 * generation, making AI-powered test creation accessible to your team.
 *
 * BULLET POINTS:
 * - API design for test generation
 * - Input validation
 * - Response formatting
 * - Caching and optimization
 * - Error handling
 */

// Example 1: Test generation service
interface TestGenerationRequest {
  feature: string;
  requirements: string[];
  framework: 'playwright' | 'cypress' | 'selenium';
  language: 'typescript' | 'javascript';
  options?: {
    includeComments?: boolean;
    includeErrorHandling?: boolean;
    testStyle?: 'bdd' | 'tdd';
  };
}

interface TestGenerationResponse {
  success: boolean;
  tests: GeneratedTest[];
  metadata: {
    generatedAt: Date;
    model: string;
    tokensUsed: number;
  };
}

interface GeneratedTest {
  name: string;
  code: string;
  description: string;
  category: 'happy-path' | 'edge-case' | 'error' | 'accessibility';
}

// Example 2: Test generation service
class TestGenerationService {
  private llmClient: { generate: (prompt: string) => Promise<string> };
  private cache: Map<string, TestGenerationResponse> = new Map();

  constructor(llmClient: { generate: (prompt: string) => Promise<string> }) {
    this.llmClient = llmClient;
  }

  async generateTests(request: TestGenerationRequest): Promise<TestGenerationResponse> {
    // Validate request
    this.validateRequest(request);

    // Check cache
    const cacheKey = this.getCacheKey(request);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Build prompt
    const prompt = this.buildPrompt(request);

    // Call LLM
    const rawResponse = await this.llmClient.generate(prompt);

    // Parse response
    const tests = this.parseTests(rawResponse);

    const response: TestGenerationResponse = {
      success: true,
      tests,
      metadata: {
        generatedAt: new Date(),
        model: 'gpt-4',
        tokensUsed: prompt.length + rawResponse.length,
      },
    };

    // Cache response
    this.cache.set(cacheKey, response);

    return response;
  }

  private validateRequest(request: TestGenerationRequest): void {
    if (!request.feature) {
      throw new Error('Feature name is required');
    }
    if (!request.requirements || request.requirements.length === 0) {
      throw new Error('At least one requirement is needed');
    }
  }

  private getCacheKey(request: TestGenerationRequest): string {
    return JSON.stringify({
      feature: request.feature,
      requirements: request.requirements.sort(),
      framework: request.framework,
    });
  }

  private buildPrompt(request: TestGenerationRequest): string {
    const style = request.options?.testStyle === 'bdd' ? 'describe/it' : 'test';

    return `Generate ${request.framework} tests in ${request.language} for:

Feature: ${request.feature}

Requirements:
${request.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Guidelines:
- Use ${style} style
- Include ${request.options?.includeComments ? 'detailed comments' : 'minimal comments'}
- ${request.options?.includeErrorHandling ? 'Include error handling' : 'Focus on happy path'}
- Return tests as JSON array with name, code, description, category fields`;
  }

  private parseTests(rawResponse: string): GeneratedTest[] {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(rawResponse);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Fallback: extract code blocks
      return [
        {
          name: 'Generated Test',
          code: rawResponse,
          description: 'AI generated test',
          category: 'happy-path',
        },
      ];
    }
  }
}

// Example 3: API endpoint (Express-style)
function createTestGenerationEndpoint(service: TestGenerationService) {
  return async (req: { body: TestGenerationRequest }, res: { json: (d: unknown) => void }) => {
    try {
      const response = await service.generateTests(req.body);
      res.json(response);
    } catch (error) {
      res.json({ success: false, error: (error as Error).message });
    }
  };
}

// Example 4: Usage
async function example(): Promise<void> {
  const mockLLM = {
    generate: async (prompt: string) =>
      JSON.stringify([
        {
          name: 'test login',
          code: 'test("login", async ({ page }) => { ... })',
          description: 'Tests login flow',
          category: 'happy-path',
        },
      ]),
  };

  const service = new TestGenerationService(mockLLM);

  const result = await service.generateTests({
    feature: 'User Authentication',
    requirements: ['User can login with email', 'User sees error for wrong password'],
    framework: 'playwright',
    language: 'typescript',
  });

  console.log('Generated tests:', result.tests.length);
}

/**
 * EXERCISE:
 * 1. Build test generation service
 * 2. Add input validation
 * 3. Implement caching
 * 4. Create API endpoint
 *
 * LEARNING:
 * - APIs make AI accessible
 * - Validation ensures quality
 * - Caching reduces costs
 * - Good parsing handles edge cases
 *
 * ONE LINER:
 * "Wrap AI in an API - make test generation a team capability, not a skill."
 */

export { TestGenerationService, createTestGenerationEndpoint };

