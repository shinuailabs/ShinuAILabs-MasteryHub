/**
 * Lab 962: AI Flaky Test Detection
 *
 * CONCEPT:
 * AI can identify flaky tests by analyzing test history, execution patterns,
 * and failure characteristics. It distinguishes between genuine bugs and
 * test infrastructure issues.
 *
 * BULLET POINTS:
 * - Detect intermittent failures
 * - Analyze failure patterns
 * - Identify root causes
 * - Suggest fixes
 * - Track flakiness metrics
 */

import { test, expect } from '@playwright/test';

// Example 1: Flaky test tracker
interface TestExecution {
  testName: string;
  timestamp: Date;
  passed: boolean;
  duration: number;
  error?: string;
  retryCount: number;
}

interface FlakyTestAnalysis {
  testName: string;
  totalRuns: number;
  passCount: number;
  failCount: number;
  flakiness: number; // 0-1
  isFlaky: boolean;
  patterns: string[];
  suggestedFixes: string[];
}

class FlakyTestDetector {
  private executions: TestExecution[] = [];

  recordExecution(execution: TestExecution): void {
    this.executions.push(execution);
  }

  analyzeTest(testName: string): FlakyTestAnalysis {
    const testExecutions = this.executions.filter((e) => e.testName === testName);
    const passCount = testExecutions.filter((e) => e.passed).length;
    const failCount = testExecutions.filter((e) => !e.passed).length;
    const totalRuns = testExecutions.length;

    // Flakiness = failures that eventually pass on retry
    const retriedAndPassed = testExecutions.filter(
      (e) => e.retryCount > 0 && e.passed
    ).length;
    const flakiness = totalRuns > 0 ? retriedAndPassed / totalRuns : 0;

    const patterns = this.detectPatterns(testExecutions);
    const suggestedFixes = this.suggestFixes(patterns);

    return {
      testName,
      totalRuns,
      passCount,
      failCount,
      flakiness,
      isFlaky: flakiness > 0.1, // >10% flakiness
      patterns,
      suggestedFixes,
    };
  }

  private detectPatterns(executions: TestExecution[]): string[] {
    const patterns: string[] = [];
    const failures = executions.filter((e) => !e.passed);

    // Check for timing-related failures
    const timeoutErrors = failures.filter((e) => e.error?.includes('timeout'));
    if (timeoutErrors.length > failures.length * 0.5) {
      patterns.push('timing-related');
    }

    // Check for element not found
    const elementErrors = failures.filter((e) => e.error?.includes('not found'));
    if (elementErrors.length > 0) {
      patterns.push('element-locator-issue');
    }

    // Check for network-related
    const networkErrors = failures.filter((e) => e.error?.includes('network'));
    if (networkErrors.length > 0) {
      patterns.push('network-dependent');
    }

    // Check for time-of-day patterns
    const nightFailures = failures.filter((e) => {
      const hour = e.timestamp.getHours();
      return hour >= 0 && hour < 6;
    });
    if (nightFailures.length > failures.length * 0.7) {
      patterns.push('time-of-day-dependent');
    }

    return patterns;
  }

  private suggestFixes(patterns: string[]): string[] {
    const fixes: string[] = [];

    if (patterns.includes('timing-related')) {
      fixes.push('Add explicit waits for elements');
      fixes.push('Increase timeout values');
      fixes.push('Use waitForLoadState("networkidle")');
    }

    if (patterns.includes('element-locator-issue')) {
      fixes.push('Use more stable locators (data-testid)');
      fixes.push('Add waitFor before interactions');
      fixes.push('Check for dynamic element loading');
    }

    if (patterns.includes('network-dependent')) {
      fixes.push('Mock network requests');
      fixes.push('Add retry logic for API calls');
      fixes.push('Use network idle waits');
    }

    return fixes;
  }

  getFlakyTests(): FlakyTestAnalysis[] {
    const testNames = [...new Set(this.executions.map((e) => e.testName))];
    return testNames.map((name) => this.analyzeTest(name)).filter((a) => a.isFlaky);
  }
}

// Example 2: Flaky test detection in action
const detector = new FlakyTestDetector();

test.describe('Flaky Test Detection', () => {
  test.afterEach(async ({}, testInfo) => {
    detector.recordExecution({
      testName: testInfo.title,
      timestamp: new Date(),
      passed: testInfo.status === 'passed',
      duration: testInfo.duration,
      error: testInfo.error?.message,
      retryCount: testInfo.retry,
    });
  });

  test('potentially flaky test', async ({ page }) => {
    await page.goto('/');
    // This test might be flaky due to timing
    await page.waitForSelector('[data-testid="dynamic-content"]', { timeout: 5000 });
  });
});

// Example 3: Flakiness report
function generateFlakinessReport(detector: FlakyTestDetector): string {
  const flakyTests = detector.getFlakyTests();

  let report = '# Flaky Test Report\n\n';
  report += `Total flaky tests: ${flakyTests.length}\n\n`;

  flakyTests.forEach((test) => {
    report += `## ${test.testName}\n`;
    report += `- Flakiness: ${(test.flakiness * 100).toFixed(1)}%\n`;
    report += `- Patterns: ${test.patterns.join(', ')}\n`;
    report += `- Suggested fixes:\n`;
    test.suggestedFixes.forEach((fix) => {
      report += `  - ${fix}\n`;
    });
    report += '\n';
  });

  return report;
}

/**
 * EXERCISE:
 * 1. Track test executions
 * 2. Analyze flakiness patterns
 * 3. Generate flakiness reports
 * 4. Fix identified flaky tests
 *
 * LEARNING:
 * - Flaky tests erode confidence
 * - AI identifies patterns
 * - Fix root causes, not symptoms
 * - Track flakiness over time
 *
 * ONE LINER:
 * "AI detects flaky tests before they waste your time - fix them once, run reliably forever."
 */

export { FlakyTestDetector, generateFlakinessReport };

