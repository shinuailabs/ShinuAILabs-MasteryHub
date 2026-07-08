# Part 10: AI Testing Best Practices

## 📚 Overview
Following best practices ensures effective, secure, and maintainable AI-powered test automation.

---

## 🎯 Key Concepts

### 1. AI Tool Selection

```typescript
// Choose the right AI tool for the task
const aiToolSelection = {
  codeCompletion: 'GitHub Copilot',      // Real-time suggestions
  testGeneration: 'ChatGPT/Claude',       // Complex test creation
  visualTesting: 'Applitools',            // Visual AI
  selfHealing: 'Healenium/testRigor',     // Locator maintenance
  localLLM: 'Ollama',                     // Privacy-sensitive
};

// Evaluation criteria
const criteria = {
  accuracy: 'How correct are suggestions?',
  speed: 'Response time for suggestions',
  cost: 'API costs and licensing',
  privacy: 'Data handling policies',
  integration: 'IDE and CI/CD support',
};
```

### 2. Prompt Engineering Best Practices

```typescript
// ✅ Good: Specific, structured prompt
const goodPrompt = `
Generate a Playwright TypeScript test for user registration:

Page: /register
Elements:
- Email input: #email
- Password input: #password
- Confirm password: #confirm-password
- Submit button: button[type="submit"]

Requirements:
- Test successful registration
- Test password mismatch error
- Test invalid email format
- Use Page Object Model

Output format: TypeScript with comments
`;

// ❌ Bad: Vague prompt
const badPrompt = 'Write a test for registration';

// Prompt template
function createTestPrompt(config: TestConfig): string {
  return `
Generate a Playwright test for: ${config.feature}

Context:
- URL: ${config.url}
- Elements: ${JSON.stringify(config.elements)}
- Test scenarios: ${config.scenarios.join(', ')}

Requirements:
- Use TypeScript
- Follow Page Object Model
- Include assertions
- Handle errors
`;
}
```

### 3. Validation and Review

```typescript
// Always validate AI-generated code
async function validateGeneratedTest(code: string): Promise<ValidationResult> {
  const issues: string[] = [];

  // Syntax check
  try {
    // Parse TypeScript
    const ts = require('typescript');
    ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
  } catch (e) {
    issues.push('Syntax error in generated code');
  }

  // Security check
  if (code.includes('eval(') || code.includes('Function(')) {
    issues.push('Potentially unsafe code detected');
  }

  // Best practices check
  if (!code.includes('await expect')) {
    issues.push('Missing assertions');
  }

  if (code.includes('page.waitForTimeout')) {
    issues.push('Avoid fixed timeouts');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
```

### 4. Security Considerations

```typescript
// Security best practices for AI in testing
const securityPractices = {
  // ✅ Do
  useEnvVariables: 'Store API keys in environment variables',
  sanitizePrompts: 'Remove sensitive data from prompts',
  reviewOutput: 'Always review AI-generated code',
  useEnterprise: 'Use enterprise AI tools for production',

  // ❌ Don't
  shareSecrets: 'Never include passwords in prompts',
  trustBlindly: 'Never deploy without review',
  logPrompts: 'Don\'t log prompts with sensitive data',
};

// Sanitize prompts before sending to AI
function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/password[=:]\s*['"]?[\w@#$%^&*]+['"]?/gi, 'password=***')
    .replace(/api[_-]?key[=:]\s*['"]?[\w-]+['"]?/gi, 'api_key=***')
    .replace(/token[=:]\s*['"]?[\w-]+['"]?/gi, 'token=***');
}
```

### 5. Human-AI Collaboration

```typescript
// Effective human-AI workflow
const workflow = {
  step1: 'Human defines requirements and acceptance criteria',
  step2: 'AI generates initial test code',
  step3: 'Human reviews and refines generated code',
  step4: 'AI suggests improvements and edge cases',
  step5: 'Human validates and approves final tests',
  step6: 'AI assists with maintenance and updates',
};

// Review checklist for AI-generated tests
const reviewChecklist = [
  'Does the test cover the requirement?',
  'Are locators robust and maintainable?',
  'Are assertions meaningful?',
  'Is error handling appropriate?',
  'Does it follow project conventions?',
  'Is the test data appropriate?',
  'Are there any security concerns?',
];
```

### 6. Cost Management

```typescript
// Optimize AI costs
class CostOptimizer {
  private tokenCount = 0;
  private costPerToken = 0.00003; // Example rate

  async optimizedRequest(prompt: string): Promise<string> {
    // Use caching
    const cached = await this.checkCache(prompt);
    if (cached) return cached;

    // Use smaller model when possible
    const model = this.selectModel(prompt);

    // Truncate if too long
    const optimizedPrompt = this.truncatePrompt(prompt, 2000);

    const response = await this.makeRequest(optimizedPrompt, model);

    // Track costs
    this.trackCost(prompt, response);

    return response;
  }

  private selectModel(prompt: string): string {
    // Simple tasks: cheaper model
    // Complex tasks: better model
    const complexity = this.assessComplexity(prompt);
    return complexity < 0.5 ? 'gpt-3.5-turbo' : 'gpt-4';
  }

  private assessComplexity(prompt: string): number {
    // Simple heuristic
    return Math.min(prompt.length / 1000, 1);
  }
}
```

### 7. Measuring AI Effectiveness

```typescript
// Track AI tool effectiveness
interface AIMetrics {
  testsGenerated: number;
  testsAccepted: number;
  testsModified: number;
  testsRejected: number;
  timeSaved: number;
  accuracyRate: number;
}

function calculateAIEffectiveness(metrics: AIMetrics): {
  acceptanceRate: number;
  roi: number;
  recommendations: string[];
} {
  const acceptanceRate = metrics.testsAccepted / metrics.testsGenerated;
  const roi = metrics.timeSaved / (metrics.testsGenerated * 5); // 5 min per review

  const recommendations: string[] = [];
  if (acceptanceRate < 0.7) {
    recommendations.push('Improve prompt specificity');
  }
  if (metrics.testsModified > metrics.testsAccepted * 0.5) {
    recommendations.push('Review AI model selection');
  }

  return { acceptanceRate, roi, recommendations };
}
```

### 8. Future-Proofing

```typescript
// Prepare for AI evolution
const futureProofing = {
  // Abstraction layer for AI providers
  useAbstraction: 'Create provider-agnostic interfaces',

  // Version control for prompts
  versionPrompts: 'Track prompt changes like code',

  // Continuous evaluation
  evaluateRegularly: 'Benchmark AI tools periodically',

  // Stay updated
  followTrends: 'Monitor AI testing advancements',
};

// Provider-agnostic interface
interface AIProvider {
  generateTest(requirement: string): Promise<string>;
  analyzeFailure(error: string): Promise<string>;
  suggestFix(code: string, error: string): Promise<string>;
}

// Easy to swap providers
class OpenAIProvider implements AIProvider { /* ... */ }
class ClaudeProvider implements AIProvider { /* ... */ }
class OllamaProvider implements AIProvider { /* ... */ }
```

---

## 💻 Practice Exercises

1. Create prompt templates
2. Implement validation
3. Set up cost tracking
4. Build review workflow
5. Measure effectiveness

---

## ✅ Best Practices Summary

- ✅ Use specific, structured prompts
- ✅ Always review AI output
- ✅ Sanitize sensitive data
- ✅ Track costs and effectiveness
- ✅ Maintain human oversight
- ❌ Don't trust AI blindly
- ❌ Don't share secrets in prompts
- ❌ Don't skip validation

---

## 📝 Quick Reference

```
AI Tool Selection:
- Code completion: GitHub Copilot
- Test generation: ChatGPT/Claude
- Visual testing: Applitools
- Self-healing: Healenium

Prompt Structure:
1. Clear objective
2. Context and constraints
3. Expected output format
4. Examples if needed

Review Checklist:
□ Covers requirements
□ Robust locators
□ Meaningful assertions
□ Proper error handling
□ Follows conventions
```