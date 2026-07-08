/**
 * Lab 967: AI Test Impact Analysis
 *
 * CONCEPT:
 * AI analyzes code changes to determine which tests are affected and need
 * to be run. This enables intelligent test selection, reducing CI time
 * while maintaining confidence.
 *
 * BULLET POINTS:
 * - Map code to tests
 * - Analyze change impact
 * - Select affected tests
 * - Reduce CI execution time
 * - Maintain test confidence
 */

import { test, expect } from '@playwright/test';

// Example 1: Code-to-test mapping
interface CodeTestMapping {
  sourceFile: string;
  testFiles: string[];
  components: string[];
}

const codeTestMappings: CodeTestMapping[] = [
  {
    sourceFile: 'src/components/LoginForm.tsx',
    testFiles: ['tests/login.spec.ts', 'tests/auth.spec.ts'],
    components: ['login-form', 'email-input', 'password-input', 'login-button'],
  },
  {
    sourceFile: 'src/components/Dashboard.tsx',
    testFiles: ['tests/dashboard.spec.ts'],
    components: ['dashboard', 'stats-widget', 'recent-activity'],
  },
  {
    sourceFile: 'src/api/auth.ts',
    testFiles: ['tests/login.spec.ts', 'tests/logout.spec.ts', 'tests/session.spec.ts'],
    components: ['auth-api'],
  },
];

// Example 2: Change impact analyzer
interface CodeChange {
  file: string;
  type: 'added' | 'modified' | 'deleted';
  linesChanged: number;
}

interface ImpactAnalysis {
  changedFiles: string[];
  affectedTests: string[];
  affectedComponents: string[];
  riskLevel: 'high' | 'medium' | 'low';
  recommendation: string;
}

function analyzeImpact(changes: CodeChange[]): ImpactAnalysis {
  const affectedTests = new Set<string>();
  const affectedComponents = new Set<string>();

  changes.forEach((change) => {
    const mapping = codeTestMappings.find((m) => m.sourceFile === change.file);
    if (mapping) {
      mapping.testFiles.forEach((t) => affectedTests.add(t));
      mapping.components.forEach((c) => affectedComponents.add(c));
    }
  });

  // Calculate risk level
  const totalLinesChanged = changes.reduce((sum, c) => sum + c.linesChanged, 0);
  let riskLevel: 'high' | 'medium' | 'low' = 'low';

  if (totalLinesChanged > 100 || affectedTests.size > 5) {
    riskLevel = 'high';
  } else if (totalLinesChanged > 30 || affectedTests.size > 2) {
    riskLevel = 'medium';
  }

  return {
    changedFiles: changes.map((c) => c.file),
    affectedTests: Array.from(affectedTests),
    affectedComponents: Array.from(affectedComponents),
    riskLevel,
    recommendation: generateRecommendation(riskLevel, affectedTests.size),
  };
}

function generateRecommendation(riskLevel: string, testCount: number): string {
  if (riskLevel === 'high') {
    return 'Run full test suite due to high-risk changes';
  }
  if (testCount === 0) {
    return 'No tests affected - consider adding test coverage';
  }
  return `Run ${testCount} affected tests`;
}

// Example 3: Smart test selection
interface TestSelectionResult {
  testsToRun: string[];
  testsToSkip: string[];
  estimatedTime: number;
  timeSaved: number;
}

function selectTests(
  allTests: { name: string; file: string; duration: number }[],
  impact: ImpactAnalysis
): TestSelectionResult {
  const testsToRun = allTests.filter((t) => impact.affectedTests.includes(t.file));
  const testsToSkip = allTests.filter((t) => !impact.affectedTests.includes(t.file));

  const runTime = testsToRun.reduce((sum, t) => sum + t.duration, 0);
  const skipTime = testsToSkip.reduce((sum, t) => sum + t.duration, 0);

  return {
    testsToRun: testsToRun.map((t) => t.name),
    testsToSkip: testsToSkip.map((t) => t.name),
    estimatedTime: runTime,
    timeSaved: skipTime,
  };
}

// Example 4: Using impact analysis
const recentChanges: CodeChange[] = [
  { file: 'src/components/LoginForm.tsx', type: 'modified', linesChanged: 25 },
  { file: 'src/api/auth.ts', type: 'modified', linesChanged: 10 },
];

const impact = analyzeImpact(recentChanges);
console.log('Impact Analysis:', impact);

// Example 5: Playwright test filtering based on impact
test.describe('Impact-Based Test Selection', () => {
  const shouldRun = (testFile: string) => {
    return impact.affectedTests.includes(testFile);
  };

  test('login test', async ({ page }) => {
    test.skip(!shouldRun('tests/login.spec.ts'), 'Not affected by changes');
    // Test implementation
  });

  test('dashboard test', async ({ page }) => {
    test.skip(!shouldRun('tests/dashboard.spec.ts'), 'Not affected by changes');
    // Test implementation
  });
});

// Example 6: Impact report
function generateImpactReport(impact: ImpactAnalysis): string {
  let report = '# Test Impact Analysis Report\n\n';
  report += `## Changed Files\n`;
  impact.changedFiles.forEach((f) => (report += `- ${f}\n`));
  report += `\n## Affected Tests (${impact.affectedTests.length})\n`;
  impact.affectedTests.forEach((t) => (report += `- ${t}\n`));
  report += `\n## Risk Level: ${impact.riskLevel.toUpperCase()}\n`;
  report += `\n## Recommendation\n${impact.recommendation}\n`;
  return report;
}

/**
 * EXERCISE:
 * 1. Create code-to-test mappings
 * 2. Analyze change impact
 * 3. Select affected tests
 * 4. Integrate with CI/CD
 *
 * LEARNING:
 * - Impact analysis saves CI time
 * - Map code to tests accurately
 * - Run only affected tests
 * - Maintain confidence with smart selection
 *
 * ONE LINER:
 * "AI knows which tests to run when code changes - smart selection, faster feedback."
 */

export { analyzeImpact, selectTests, generateImpactReport };

