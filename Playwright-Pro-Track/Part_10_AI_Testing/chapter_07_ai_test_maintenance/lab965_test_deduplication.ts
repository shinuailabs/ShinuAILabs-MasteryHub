/**
 * Lab 965: AI Test Deduplication
 *
 * CONCEPT:
 * AI can identify duplicate or overlapping tests that waste execution time.
 * By detecting semantic similarity, it finds tests that cover the same
 * functionality and suggests consolidation.
 *
 * BULLET POINTS:
 * - Detect duplicate tests
 * - Find overlapping coverage
 * - Suggest test consolidation
 * - Reduce test suite size
 * - Maintain coverage quality
 */

import { test, expect } from '@playwright/test';

// Example 1: Test similarity analysis
interface TestSignature {
  name: string;
  actions: string[];
  assertions: string[];
  selectors: string[];
  urls: string[];
}

function extractTestSignature(testCode: string): TestSignature {
  return {
    name: testCode.match(/test\(['"]([^'"]+)['"]/)?.[1] || 'unknown',
    actions: testCode.match(/\.(click|fill|type|press|check|select)\(/g) || [],
    assertions: testCode.match(/expect\([^)]+\)\.[^(]+\(/g) || [],
    selectors: testCode.match(/\[data-testid="[^"]+"\]/g) || [],
    urls: testCode.match(/goto\(['"]([^'"]+)['"]\)/g) || [],
  };
}

function calculateSimilarity(sig1: TestSignature, sig2: TestSignature): number {
  const actionSim = jaccardSimilarity(sig1.actions, sig2.actions);
  const assertionSim = jaccardSimilarity(sig1.assertions, sig2.assertions);
  const selectorSim = jaccardSimilarity(sig1.selectors, sig2.selectors);
  const urlSim = jaccardSimilarity(sig1.urls, sig2.urls);

  return (actionSim + assertionSim + selectorSim + urlSim) / 4;
}

function jaccardSimilarity(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

// Example 2: Duplicate detector
interface DuplicateGroup {
  tests: string[];
  similarity: number;
  recommendation: 'merge' | 'review' | 'keep';
  reason: string;
}

class TestDeduplicator {
  findDuplicates(tests: TestSignature[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < tests.length; i++) {
      if (processed.has(tests[i].name)) continue;

      const similar: string[] = [tests[i].name];

      for (let j = i + 1; j < tests.length; j++) {
        if (processed.has(tests[j].name)) continue;

        const similarity = calculateSimilarity(tests[i], tests[j]);

        if (similarity > 0.8) {
          similar.push(tests[j].name);
          processed.add(tests[j].name);
        }
      }

      if (similar.length > 1) {
        const avgSimilarity = similar.length > 1 ? 0.85 : 0;
        groups.push({
          tests: similar,
          similarity: avgSimilarity,
          recommendation: avgSimilarity > 0.9 ? 'merge' : 'review',
          reason: this.explainDuplication(tests[i], tests.find((t) => t.name === similar[1])!),
        });
      }

      processed.add(tests[i].name);
    }

    return groups;
  }

  private explainDuplication(test1: TestSignature, test2: TestSignature): string {
    const reasons: string[] = [];

    if (jaccardSimilarity(test1.selectors, test2.selectors) > 0.8) {
      reasons.push('Same elements tested');
    }
    if (jaccardSimilarity(test1.actions, test2.actions) > 0.8) {
      reasons.push('Similar actions performed');
    }
    if (jaccardSimilarity(test1.urls, test2.urls) > 0.8) {
      reasons.push('Same pages visited');
    }

    return reasons.join(', ');
  }
}

// Example 3: Duplicate tests example
const duplicateTestsExample = `
// These tests are duplicates
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@test.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('[data-testid="login-btn"]');
  await expect(page).toHaveURL('/dashboard');
});

test('verify login functionality', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-btn"]');
  await expect(page).toHaveURL('/dashboard');
});
`;

// Example 4: Consolidation suggestion
interface ConsolidationSuggestion {
  originalTests: string[];
  consolidatedTest: string;
  dataVariations: Record<string, string[]>;
}

function suggestConsolidation(duplicates: DuplicateGroup): ConsolidationSuggestion {
  return {
    originalTests: duplicates.tests,
    consolidatedTest: `
test.describe('Login functionality', () => {
  const testCases = [
    { email: 'user@test.com', password: 'pass123' },
    { email: 'test@example.com', password: 'password' },
  ];

  for (const { email, password } of testCases) {
    test(\`login with \${email}\`, async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email"]', email);
      await page.fill('[data-testid="password"]', password);
      await page.click('[data-testid="login-btn"]');
      await expect(page).toHaveURL('/dashboard');
    });
  }
});`,
    dataVariations: {
      email: ['user@test.com', 'test@example.com'],
      password: ['pass123', 'password'],
    },
  };
}

// Example 5: Deduplication report
function generateDeduplicationReport(groups: DuplicateGroup[]): string {
  let report = '# Test Deduplication Report\n\n';
  report += `Found ${groups.length} groups of similar tests\n\n`;

  groups.forEach((group, i) => {
    report += `## Group ${i + 1}\n`;
    report += `- Tests: ${group.tests.join(', ')}\n`;
    report += `- Similarity: ${(group.similarity * 100).toFixed(0)}%\n`;
    report += `- Recommendation: ${group.recommendation}\n`;
    report += `- Reason: ${group.reason}\n\n`;
  });

  return report;
}

/**
 * EXERCISE:
 * 1. Analyze your test suite for duplicates
 * 2. Calculate test similarity
 * 3. Generate consolidation suggestions
 * 4. Refactor duplicate tests
 *
 * LEARNING:
 * - Duplicates waste execution time
 * - AI detects semantic similarity
 * - Consolidate with data-driven tests
 * - Maintain coverage while reducing tests
 *
 * ONE LINER:
 * "AI finds duplicate tests hiding in your suite - consolidate them for faster runs."
 */

export { TestDeduplicator, calculateSimilarity, suggestConsolidation };

