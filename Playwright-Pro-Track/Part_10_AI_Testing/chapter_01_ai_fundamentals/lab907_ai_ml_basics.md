# Lab 907: AI and Machine Learning Basics for QA

## Concept
Artificial Intelligence (AI) and Machine Learning (ML) are transforming software testing. AI refers to machines mimicking human intelligence, while ML is a subset where systems learn from data without explicit programming. For QA engineers, understanding these fundamentals helps leverage AI-powered testing tools effectively.

## Bullet Points
- **AI (Artificial Intelligence)**: Machines performing tasks that typically require human intelligence
- **ML (Machine Learning)**: Systems that learn and improve from experience
- **Deep Learning**: Neural networks with multiple layers for complex pattern recognition
- **NLP (Natural Language Processing)**: AI understanding human language
- **Computer Vision**: AI interpreting visual information
- **Supervised Learning**: Training with labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Reinforcement Learning**: Learning through trial and error

## Examples

### Example 1: AI in Test Automation
```typescript
// Traditional approach - hardcoded locator
const button = page.locator('#submit-btn');

// AI-powered approach - semantic understanding
const button = page.getByRole('button', { name: 'Submit' });

// AI self-healing - automatically finds alternative locator
const button = await aiLocator.find('submit button', {
  fallback: ['#submit', '.btn-submit', '[data-testid="submit"]']
});
```

### Example 2: ML for Test Prediction
```typescript
// ML model predicting which tests to run based on code changes
interface TestPrediction {
  testName: string;
  probability: number;
  reason: string;
}

const predictions: TestPrediction[] = [
  { testName: 'login.spec.ts', probability: 0.95, reason: 'auth module changed' },
  { testName: 'checkout.spec.ts', probability: 0.82, reason: 'payment API updated' },
  { testName: 'profile.spec.ts', probability: 0.15, reason: 'no related changes' }
];

// Run only high-probability tests
const testsToRun = predictions.filter(p => p.probability > 0.7);
```

### Example 3: NLP for Test Generation
```typescript
// Natural language requirement
const requirement = "User should be able to login with valid credentials";

// AI-generated test
test('User should be able to login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'validPassword123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Exercise

### Task 1: Identify AI Applications
List 5 ways AI can be applied in your current testing workflow.

### Task 2: Classify ML Types
For each scenario, identify the ML type (Supervised/Unsupervised/Reinforcement):
1. Predicting test failures based on historical data
2. Grouping similar test failures
3. Learning optimal test execution order

### Task 3: Research AI Tools
Research and document 3 AI-powered testing tools and their capabilities.

## Coding Questions & Solutions

### Question 1: Create a simple test classifier
```typescript
// Question: Create a function that classifies tests based on keywords

// Solution:
type TestCategory = 'ui' | 'api' | 'integration' | 'unit' | 'unknown';

function classifyTest(testName: string): TestCategory {
  const keywords: Record<TestCategory, string[]> = {
    ui: ['click', 'button', 'form', 'page', 'visual', 'screenshot'],
    api: ['request', 'response', 'endpoint', 'status', 'json'],
    integration: ['flow', 'e2e', 'journey', 'scenario'],
    unit: ['function', 'util', 'helper', 'calculate'],
    unknown: []
  };

  const lowerName = testName.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerName.includes(word))) {
      return category as TestCategory;
    }
  }
  
  return 'unknown';
}

// Usage
console.log(classifyTest('should click submit button')); // 'ui'
console.log(classifyTest('API response should return 200')); // 'api'
```

### Question 2: Build a simple failure predictor
```typescript
// Question: Create a basic failure prediction based on historical data

// Solution:
interface TestHistory {
  testName: string;
  runs: number;
  failures: number;
  lastFailure: Date | null;
}

function predictFailureProbability(history: TestHistory): number {
  const failureRate = history.failures / history.runs;
  const daysSinceLastFailure = history.lastFailure 
    ? (Date.now() - history.lastFailure.getTime()) / (1000 * 60 * 60 * 24)
    : 365;
  
  // Higher probability if recent failure and high failure rate
  const recencyFactor = Math.max(0, 1 - (daysSinceLastFailure / 30));
  
  return Math.min(1, failureRate * 0.7 + recencyFactor * 0.3);
}

// Usage
const testHistory: TestHistory = {
  testName: 'login.spec.ts',
  runs: 100,
  failures: 15,
  lastFailure: new Date('2024-01-10')
};

console.log(predictFailureProbability(testHistory)); // ~0.25
```

## Learning
- AI and ML are revolutionizing test automation
- Understanding AI basics helps choose the right tools
- ML can predict failures, prioritize tests, and optimize execution
- NLP enables natural language test writing
- Computer vision powers visual testing
- AI doesn't replace testers but augments their capabilities

## One Liner
> "AI in testing is not about replacing human testers, but empowering them to test smarter, faster, and more effectively."

