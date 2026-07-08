# Lab 914: AI Limitations and Challenges in Testing

## Concept
While AI offers tremendous benefits for testing, understanding its limitations is crucial for effective adoption. AI can hallucinate, lacks true understanding, and requires human oversight. Knowing these limitations helps you use AI tools appropriately and avoid costly mistakes.

## Bullet Points
- **Hallucinations**: AI generates plausible but incorrect information
- **No True Understanding**: AI pattern-matches, doesn't truly comprehend
- **Context Limitations**: Limited memory and context window
- **Training Data Cutoff**: Knowledge limited to training date
- **Determinism Issues**: Same prompt may yield different results
- **Domain Blindness**: Lacks specific business/domain knowledge
- **Security Risks**: May expose sensitive data or generate vulnerable code
- **Over-reliance**: Can lead to skill atrophy in teams

## Examples

### Example 1: Common AI Hallucinations in Testing
```typescript
// AI might generate non-existent Playwright methods
// ❌ Hallucinated code (these methods don't exist)
test('hallucinated test', async ({ page }) => {
  await page.waitForNetworkSettled(); // Doesn't exist
  await page.clickAndHold('#button'); // Wrong syntax
  await page.assertVisible('.element'); // Not a method
  await expect(page).toHaveLoadState('complete'); // Wrong API
});

// ✅ Correct Playwright code
test('correct test', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await page.locator('#button').click();
  await expect(page.locator('.element')).toBeVisible();
  await page.waitForLoadState('domcontentloaded');
});

// AI might suggest outdated patterns
// ❌ Old Playwright syntax (pre-1.0)
const element = await page.$('#button');
await element.click();

// ✅ Modern Playwright syntax
await page.locator('#button').click();
```

### Example 2: Context and Domain Limitations
```typescript
// AI doesn't know your specific application
// Prompt: "Generate tests for our checkout flow"

// AI generates generic tests, missing your specific:
const aiMissedContext = {
  businessRules: [
    'Orders over $500 require manager approval',
    'Loyalty members get free shipping',
    'Some products cannot ship to certain states'
  ],
  
  technicalDetails: [
    'Custom payment gateway integration',
    'Real-time inventory check via WebSocket',
    'A/B test variants affecting UI'
  ],
  
  edgeCases: [
    'Multi-currency support',
    'Tax calculation for different regions',
    'Subscription vs one-time purchase flows'
  ]
};

// You must provide this context explicitly
const effectivePrompt = `
Generate checkout tests for our e-commerce platform.

Business Rules:
- Orders over $500 require manager approval
- Loyalty members (user.tier === 'gold') get free shipping
- Products with category 'hazmat' cannot ship to PO boxes

Technical Context:
- Payment uses Stripe with 3D Secure
- Inventory checked via WebSocket at /ws/inventory
- Two checkout variants: 'classic' and 'express'

Generate tests covering these specific scenarios.
`;
```

### Example 3: Security and Sensitive Data Risks
```typescript
// ❌ NEVER share with AI
const sensitiveData = {
  realCredentials: 'admin@company.com / RealPassword123!',
  apiKeys: 'sk-live-abc123...',
  customerData: 'Real customer PII',
  internalUrls: 'https://internal.company.com/admin'
};

// ✅ Safe to share with AI
const safeData = {
  testCredentials: 'test@example.com / TestPass123!',
  mockApiKeys: 'sk-test-mock-key',
  syntheticData: 'Generated fake customer data',
  publicUrls: 'https://example.com'
};

// AI might generate insecure code
// ❌ AI-generated vulnerable code
test('login test', async ({ page }) => {
  // Hardcoded credentials in test
  await page.fill('#email', 'admin@company.com');
  await page.fill('#password', 'Admin123!');
});

// ✅ Secure approach
test('login test', async ({ page }) => {
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
});
```

## Exercise

### Task 1: Identify Hallucinations
Review AI-generated test code and identify any hallucinated methods or APIs.

### Task 2: Add Missing Context
Take an AI-generated test and add the domain-specific context it's missing.

### Task 3: Security Audit
Review your prompts for any sensitive data that shouldn't be shared with AI.

## Coding Questions & Solutions

### Question 1: Build an AI output validator
```typescript
// Solution: Validate AI-generated Playwright code
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

const playwrightMethods = new Set([
  'goto', 'click', 'fill', 'type', 'press', 'check', 'uncheck',
  'selectOption', 'hover', 'focus', 'blur', 'waitForSelector',
  'waitForLoadState', 'waitForURL', 'waitForResponse', 'screenshot',
  'locator', 'getByRole', 'getByText', 'getByLabel', 'getByTestId'
]);

const deprecatedPatterns = [
  { pattern: /page\.\$\(/, message: 'Use page.locator() instead of page.$()' },
  { pattern: /page\.\$\$\(/, message: 'Use page.locator().all() instead' },
  { pattern: /waitForTimeout/, message: 'Avoid hardcoded waits' },
  { pattern: /page\.click\(/, message: 'Use locator.click() for better reliability' }
];

function validateAIGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for potentially hallucinated methods
  const methodCalls = code.match(/page\.(\w+)\(/g) || [];
  for (const call of methodCalls) {
    const method = call.match(/page\.(\w+)\(/)?.[1];
    if (method && !playwrightMethods.has(method)) {
      errors.push(`Potentially hallucinated method: page.${method}()`);
    }
  }

  // Check for deprecated patterns
  for (const { pattern, message } of deprecatedPatterns) {
    if (pattern.test(code)) {
      warnings.push(message);
    }
  }

  // Check for missing awaits
  const asyncCalls = code.match(/page\.\w+\(/g) || [];
  const awaitCount = (code.match(/await\s+page\./g) || []).length;
  if (asyncCalls.length > awaitCount) {
    errors.push('Missing await keywords for async operations');
  }

  // Check for hardcoded sensitive data
  if (/password.*=.*['"][^'"]+['"]/.test(code)) {
    warnings.push('Hardcoded password detected - use environment variables');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}
```

### Question 2: AI response confidence scorer
```typescript
// Solution: Score confidence in AI-generated tests
interface ConfidenceScore {
  overall: number;
  factors: {
    syntaxCorrectness: number;
    bestPractices: number;
    completeness: number;
    specificity: number;
  };
  recommendation: 'use' | 'review' | 'regenerate';
}

function scoreAIResponse(code: string, prompt: string): ConfidenceScore {
  const factors = {
    syntaxCorrectness: scoreSyntax(code),
    bestPractices: scoreBestPractices(code),
    completeness: scoreCompleteness(code, prompt),
    specificity: scoreSpecificity(code, prompt)
  };

  const overall = Object.values(factors).reduce((a, b) => a + b, 0) / 4;

  return {
    overall,
    factors,
    recommendation: overall > 80 ? 'use' : overall > 50 ? 'review' : 'regenerate'
  };
}

function scoreSyntax(code: string): number {
  let score = 100;
  if (!code.includes("from '@playwright/test'")) score -= 20;
  if (!code.includes('async')) score -= 15;
  if (!code.includes('await')) score -= 15;
  if (!code.includes('expect(')) score -= 20;
  return Math.max(0, score);
}

function scoreBestPractices(code: string): number {
  let score = 100;
  if (code.includes('waitForTimeout')) score -= 30;
  if (code.includes('page.$')) score -= 20;
  if (!/data-testid|getByRole|getByText/.test(code)) score -= 15;
  return Math.max(0, score);
}

function scoreCompleteness(code: string, prompt: string): number {
  let score = 100;
  if (!code.includes('test(')) score -= 40;
  if (!code.includes('expect(')) score -= 30;
  // Check if key terms from prompt appear in code
  const keywords = prompt.match(/\b\w{4,}\b/g) || [];
  const matchedKeywords = keywords.filter(k => 
    code.toLowerCase().includes(k.toLowerCase())
  );
  score -= (1 - matchedKeywords.length / keywords.length) * 30;
  return Math.max(0, score);
}

function scoreSpecificity(code: string, prompt: string): number {
  let score = 70; // Base score
  if (code.includes('data-testid')) score += 15;
  if (code.includes('getByRole')) score += 15;
  return Math.min(100, score);
}
```

## Learning
- Always validate AI-generated code before using it
- AI lacks domain knowledge - you must provide context
- Never share sensitive data with AI tools
- AI output varies - same prompt may give different results
- Use AI as an assistant, not a replacement for expertise
- Maintain human oversight for all AI-generated tests

## One Liner
> "Trust but verify - AI is a powerful assistant, but the responsibility for quality remains with you."

