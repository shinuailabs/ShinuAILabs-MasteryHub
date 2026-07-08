/**
 * Lab 987: LLM Integration Best Practices
 *
 * CONCEPT:
 * Following best practices for LLM integration ensures reliable, cost-effective,
 * and secure AI-powered test automation.
 *
 * BULLET POINTS:
 * - Security and privacy
 * - Cost management
 * - Error handling
 * - Quality assurance
 * - Monitoring and logging
 */

// Best Practice 1: Security configuration
interface SecurityConfig {
  sanitizeInputs: boolean;
  redactSensitiveData: boolean;
  auditLogging: boolean;
  allowedModels: string[];
  maxTokensPerRequest: number;
}

const securityConfig: SecurityConfig = {
  sanitizeInputs: true,
  redactSensitiveData: true,
  auditLogging: true,
  allowedModels: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus'],
  maxTokensPerRequest: 4000,
};

function sanitizeInput(input: string): string {
  return input
    .replace(/api[_-]?key[=:]["']?[\w-]+["']?/gi, 'API_KEY=[REDACTED]')
    .replace(/password[=:]["']?[\w-]+["']?/gi, 'password=[REDACTED]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
}

// Best Practice 2: Cost management
interface CostTracker {
  totalTokens: number;
  totalCost: number;
  requestCount: number;
  budgetLimit: number;
}

class LLMCostManager {
  private tracker: CostTracker = {
    totalTokens: 0,
    totalCost: 0,
    requestCount: 0,
    budgetLimit: 100, // $100 monthly limit
  };

  private costs: Record<string, number> = {
    'gpt-4': 0.03,
    'gpt-3.5-turbo': 0.002,
    'claude-3-opus': 0.015,
  };

  trackRequest(model: string, tokens: number): void {
    const costPerToken = this.costs[model] || 0.01;
    const cost = (tokens / 1000) * costPerToken;

    this.tracker.totalTokens += tokens;
    this.tracker.totalCost += cost;
    this.tracker.requestCount++;
  }

  canMakeRequest(estimatedTokens: number, model: string): boolean {
    const estimatedCost = (estimatedTokens / 1000) * (this.costs[model] || 0.01);
    return this.tracker.totalCost + estimatedCost <= this.tracker.budgetLimit;
  }

  getStats(): CostTracker {
    return { ...this.tracker };
  }
}

// Best Practice 3: Error handling
interface LLMError {
  type: 'rate_limit' | 'token_limit' | 'api_error' | 'timeout' | 'unknown';
  message: string;
  retryable: boolean;
  retryAfter?: number;
}

function classifyError(error: Error): LLMError {
  const message = error.message.toLowerCase();

  if (message.includes('rate limit')) {
    return { type: 'rate_limit', message: error.message, retryable: true, retryAfter: 60 };
  }
  if (message.includes('token') || message.includes('context length')) {
    return { type: 'token_limit', message: error.message, retryable: false };
  }
  if (message.includes('timeout')) {
    return { type: 'timeout', message: error.message, retryable: true, retryAfter: 5 };
  }

  return { type: 'unknown', message: error.message, retryable: false };
}

// Best Practice 4: Quality validation
interface ValidationResult {
  valid: boolean;
  issues: string[];
  score: number;
}

function validateLLMResponse(response: string, expectedType: 'code' | 'json' | 'text'): ValidationResult {
  const issues: string[] = [];
  let score = 100;

  if (!response || response.trim().length === 0) {
    return { valid: false, issues: ['Empty response'], score: 0 };
  }

  if (expectedType === 'code') {
    if (!response.includes('async') && !response.includes('function')) {
      issues.push('Response may not contain valid code');
      score -= 20;
    }
  }

  if (expectedType === 'json') {
    try {
      JSON.parse(response);
    } catch {
      issues.push('Response is not valid JSON');
      score -= 50;
    }
  }

  return { valid: issues.length === 0, issues, score };
}

// Best Practice 5: Logging and monitoring
interface LLMRequestLog {
  timestamp: Date;
  model: string;
  promptTokens: number;
  responseTokens: number;
  latency: number;
  success: boolean;
  error?: string;
}

class LLMLogger {
  private logs: LLMRequestLog[] = [];

  log(entry: LLMRequestLog): void {
    this.logs.push(entry);
    console.log(`[LLM] ${entry.model} - ${entry.latency}ms - ${entry.success ? '✓' : '✗'}`);
  }

  getMetrics(): { avgLatency: number; successRate: number; totalCost: number } {
    const successCount = this.logs.filter((l) => l.success).length;
    const avgLatency = this.logs.reduce((sum, l) => sum + l.latency, 0) / this.logs.length;

    return {
      avgLatency,
      successRate: successCount / this.logs.length,
      totalCost: 0, // Calculate based on tokens
    };
  }
}

// Best Practice 6: Configuration checklist
const llmBestPracticesChecklist = [
  '✅ Sanitize all inputs before sending to LLM',
  '✅ Implement cost tracking and budgets',
  '✅ Handle rate limits with exponential backoff',
  '✅ Validate responses before using',
  '✅ Log all requests for debugging',
  '✅ Use appropriate models for task complexity',
  '✅ Cache common responses',
  '✅ Implement timeout handling',
  '✅ Keep API keys secure',
  '✅ Monitor usage and costs regularly',
];

/**
 * EXERCISE:
 * 1. Implement security measures
 * 2. Set up cost tracking
 * 3. Add error handling
 * 4. Configure logging
 *
 * LEARNING:
 * - Security protects sensitive data
 * - Cost management prevents surprises
 * - Error handling ensures reliability
 * - Logging enables debugging
 *
 * ONE LINER:
 * "Treat LLM integration like production code - secure, monitored, and reliable."
 */

export {
  securityConfig,
  sanitizeInput,
  LLMCostManager,
  classifyError,
  validateLLMResponse,
  LLMLogger,
  llmBestPracticesChecklist,
};
