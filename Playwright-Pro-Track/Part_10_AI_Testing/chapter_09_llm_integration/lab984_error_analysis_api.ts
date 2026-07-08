/**
 * Lab 984: AI Error Analysis API
 *
 * CONCEPT:
 * Build an API that automatically analyzes test errors, categorizes them,
 * and suggests fixes using LLM capabilities.
 *
 * BULLET POINTS:
 * - Automatic error categorization
 * - Root cause analysis
 * - Fix suggestions
 * - Learning from patterns
 * - Integration with CI/CD
 */

// Example 1: Error analysis types
interface ErrorAnalysisRequest {
  errorMessage: string;
  stackTrace?: string;
  testCode?: string;
  testName: string;
  context?: {
    browser?: string;
    url?: string;
    screenshot?: string;
  };
}

interface ErrorAnalysisResponse {
  category: ErrorCategory;
  confidence: number;
  rootCause: string;
  explanation: string;
  suggestedFixes: SuggestedFix[];
  relatedDocs: string[];
}

type ErrorCategory =
  | 'locator'
  | 'timeout'
  | 'assertion'
  | 'network'
  | 'authentication'
  | 'data'
  | 'environment'
  | 'unknown';

interface SuggestedFix {
  description: string;
  code?: string;
  confidence: number;
  effort: 'low' | 'medium' | 'high';
}

// Example 2: Error analysis service
class ErrorAnalysisService {
  private llmClient: { analyze: (prompt: string) => Promise<string> };
  private knowledgeBase: Map<string, ErrorAnalysisResponse> = new Map();

  constructor(llmClient: { analyze: (prompt: string) => Promise<string> }) {
    this.llmClient = llmClient;
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase(): void {
    // Pre-populate common error patterns
    this.knowledgeBase.set('timeout', {
      category: 'timeout',
      confidence: 0.9,
      rootCause: 'Element not found within timeout',
      explanation: 'The test waited for an element but it did not appear in time.',
      suggestedFixes: [
        { description: 'Increase timeout', confidence: 0.7, effort: 'low' },
        { description: 'Add explicit wait', confidence: 0.85, effort: 'low' },
        { description: 'Check if element exists', confidence: 0.8, effort: 'medium' },
      ],
      relatedDocs: ['https://playwright.dev/docs/api/class-page#page-wait-for-selector'],
    });
  }

  async analyzeError(request: ErrorAnalysisRequest): Promise<ErrorAnalysisResponse> {
    // Check knowledge base first
    const knownPattern = this.matchKnownPattern(request.errorMessage);
    if (knownPattern) {
      return knownPattern;
    }

    // Use LLM for analysis
    const prompt = this.buildAnalysisPrompt(request);
    const rawResponse = await this.llmClient.analyze(prompt);

    return this.parseAnalysisResponse(rawResponse);
  }

  private matchKnownPattern(errorMessage: string): ErrorAnalysisResponse | null {
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes('timeout')) {
      return this.knowledgeBase.get('timeout')!;
    }

    return null;
  }

  private buildAnalysisPrompt(request: ErrorAnalysisRequest): string {
    return `Analyze this test error:

Test: ${request.testName}
Error: ${request.errorMessage}
${request.stackTrace ? `Stack trace: ${request.stackTrace}` : ''}
${request.testCode ? `Test code: ${request.testCode}` : ''}

Provide:
1. Error category (locator/timeout/assertion/network/authentication/data/environment)
2. Root cause analysis
3. Plain language explanation
4. 3 suggested fixes with confidence and effort level
5. Relevant documentation links

Return as JSON.`;
  }

  private parseAnalysisResponse(rawResponse: string): ErrorAnalysisResponse {
    try {
      return JSON.parse(rawResponse);
    } catch {
      return {
        category: 'unknown',
        confidence: 0.5,
        rootCause: 'Unable to determine automatically',
        explanation: rawResponse,
        suggestedFixes: [
          { description: 'Manual investigation needed', confidence: 0.5, effort: 'medium' },
        ],
        relatedDocs: [],
      };
    }
  }
}

// Example 3: CI/CD integration
interface CIIntegration {
  onTestFailure: (
    testResult: { name: string; error: string },
    analysis: ErrorAnalysisResponse
  ) => void;
}

class PlaywrightCIIntegration implements CIIntegration {
  private analysisService: ErrorAnalysisService;

  constructor(analysisService: ErrorAnalysisService) {
    this.analysisService = analysisService;
  }

  async onTestFailure(
    testResult: { name: string; error: string },
    _analysis: ErrorAnalysisResponse
  ): Promise<void> {
    const analysis = await this.analysisService.analyzeError({
      testName: testResult.name,
      errorMessage: testResult.error,
    });

    console.log(`\n🔍 AI Error Analysis for: ${testResult.name}`);
    console.log(`Category: ${analysis.category}`);
    console.log(`Root Cause: ${analysis.rootCause}`);
    console.log(`Suggested Fix: ${analysis.suggestedFixes[0]?.description}`);
  }
}

// Example 4: Usage
async function analyzeFailedTests(): Promise<void> {
  const mockLLM = {
    analyze: async () =>
      JSON.stringify({
        category: 'locator',
        confidence: 0.85,
        rootCause: 'Selector changed in recent update',
        explanation: 'The button ID was modified',
        suggestedFixes: [{ description: 'Update selector', confidence: 0.9, effort: 'low' }],
        relatedDocs: [],
      }),
  };

  const service = new ErrorAnalysisService(mockLLM);
  const result = await service.analyzeError({
    testName: 'login test',
    errorMessage: 'Element not found: #submit-btn',
  });

  console.log('Analysis:', result);
}

/**
 * EXERCISE:
 * 1. Build error analysis service
 * 2. Create knowledge base
 * 3. Integrate with CI/CD
 * 4. Track fix effectiveness
 *
 * LEARNING:
 * - Pattern matching speeds analysis
 * - LLM handles novel errors
 * - CI integration automates feedback
 * - Knowledge base improves over time
 *
 * ONE LINER:
 * "AI analyzes errors instantly - no more staring at stack traces wondering why."
 */

export { ErrorAnalysisService, PlaywrightCIIntegration };

