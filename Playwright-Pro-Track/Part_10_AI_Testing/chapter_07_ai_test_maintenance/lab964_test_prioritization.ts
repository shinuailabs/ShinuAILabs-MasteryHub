/**
 * Lab 964: AI Test Prioritization
 *
 * CONCEPT:
 * AI can prioritize tests based on risk, code changes, historical failures,
 * and business impact. This enables faster feedback by running the most
 * important tests first.
 *
 * BULLET POINTS:
 * - Risk-based test selection
 * - Change-impact analysis
 * - Historical failure weighting
 * - Business criticality scoring
 * - Optimized test execution order
 */

import { test, expect } from '@playwright/test';

// Example 1: Test priority factors
interface TestPriorityFactors {
  testName: string;
  historicalFailureRate: number; // 0-1
  lastFailedDaysAgo: number | null;
  codeChangeImpact: number; // 0-1
  businessCriticality: 'critical' | 'high' | 'medium' | 'low';
  executionTime: number; // seconds
  coverageScore: number; // 0-1
}

interface PrioritizedTest {
  testName: string;
  priority: number;
  factors: TestPriorityFactors;
  reason: string;
}

// Example 2: Test prioritization engine
class TestPrioritizer {
  private weights = {
    historicalFailure: 0.25,
    recentFailure: 0.2,
    codeChange: 0.25,
    businessCriticality: 0.2,
    executionTime: 0.1,
  };

  prioritize(tests: TestPriorityFactors[]): PrioritizedTest[] {
    return tests
      .map((test) => ({
        testName: test.testName,
        priority: this.calculatePriority(test),
        factors: test,
        reason: this.explainPriority(test),
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  private calculatePriority(test: TestPriorityFactors): number {
    let score = 0;

    // Historical failure rate
    score += test.historicalFailureRate * this.weights.historicalFailure * 100;

    // Recent failure bonus
    if (test.lastFailedDaysAgo !== null && test.lastFailedDaysAgo < 7) {
      score += this.weights.recentFailure * 100;
    }

    // Code change impact
    score += test.codeChangeImpact * this.weights.codeChange * 100;

    // Business criticality
    const criticalityScores = { critical: 100, high: 75, medium: 50, low: 25 };
    score += criticalityScores[test.businessCriticality] * this.weights.businessCriticality;

    // Execution time (prefer faster tests)
    const timeScore = Math.max(0, 100 - test.executionTime);
    score += timeScore * this.weights.executionTime;

    return Math.round(score);
  }

  private explainPriority(test: TestPriorityFactors): string {
    const reasons: string[] = [];

    if (test.historicalFailureRate > 0.3) {
      reasons.push('High historical failure rate');
    }
    if (test.lastFailedDaysAgo !== null && test.lastFailedDaysAgo < 7) {
      reasons.push('Failed recently');
    }
    if (test.codeChangeImpact > 0.5) {
      reasons.push('Affected by recent code changes');
    }
    if (test.businessCriticality === 'critical') {
      reasons.push('Business critical');
    }

    return reasons.join(', ') || 'Standard priority';
  }
}

// Example 3: Change impact analyzer
interface CodeChange {
  file: string;
  linesChanged: number;
  type: 'added' | 'modified' | 'deleted';
}

function analyzeChangeImpact(
  changes: CodeChange[],
  testCoverage: Map<string, string[]>
): Map<string, number> {
  const impact = new Map<string, number>();

  for (const [testName, coveredFiles] of testCoverage) {
    let testImpact = 0;

    for (const change of changes) {
      if (coveredFiles.includes(change.file)) {
        testImpact += change.linesChanged / 100; // Normalize
      }
    }

    impact.set(testName, Math.min(1, testImpact));
  }

  return impact;
}

// Example 4: Using prioritization
const prioritizer = new TestPrioritizer();

const testFactors: TestPriorityFactors[] = [
  {
    testName: 'checkout flow',
    historicalFailureRate: 0.15,
    lastFailedDaysAgo: 3,
    codeChangeImpact: 0.8,
    businessCriticality: 'critical',
    executionTime: 45,
    coverageScore: 0.9,
  },
  {
    testName: 'user profile update',
    historicalFailureRate: 0.05,
    lastFailedDaysAgo: null,
    codeChangeImpact: 0.1,
    businessCriticality: 'medium',
    executionTime: 15,
    coverageScore: 0.6,
  },
  {
    testName: 'login flow',
    historicalFailureRate: 0.02,
    lastFailedDaysAgo: 30,
    codeChangeImpact: 0.9,
    businessCriticality: 'critical',
    executionTime: 10,
    coverageScore: 0.95,
  },
];

const prioritized = prioritizer.prioritize(testFactors);
console.log('Prioritized test order:');
prioritized.forEach((t, i) => {
  console.log(`${i + 1}. ${t.testName} (priority: ${t.priority}) - ${t.reason}`);
});

// Example 5: Playwright test ordering
test.describe.configure({ mode: 'serial' });

test.describe('Prioritized Tests', () => {
  // Tests run in priority order
  test('checkout flow @critical', async ({ page }) => {
    // Highest priority test
  });

  test('login flow @critical', async ({ page }) => {
    // Second priority
  });

  test('user profile update @medium', async ({ page }) => {
    // Lower priority
  });
});

/**
 * EXERCISE:
 * 1. Collect test execution history
 * 2. Analyze code change impact
 * 3. Prioritize tests
 * 4. Run tests in priority order
 *
 * LEARNING:
 * - Prioritization speeds up feedback
 * - Multiple factors determine priority
 * - Run critical tests first
 * - AI optimizes test order
 *
 * ONE LINER:
 * "AI prioritizes tests so you find bugs faster - critical tests first, always."
 */

export { TestPrioritizer, analyzeChangeImpact };

