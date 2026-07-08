/**
 * Lab 966: AI Test Documentation
 *
 * CONCEPT:
 * AI can automatically generate and maintain test documentation by analyzing
 * test code, extracting intent, and creating human-readable descriptions
 * of what each test verifies.
 *
 * BULLET POINTS:
 * - Auto-generate test descriptions
 * - Extract test intent from code
 * - Create test catalogs
 * - Maintain documentation sync
 * - Generate coverage reports
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Test documentation generator
interface TestDocumentation {
  name: string;
  description: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  tags: string[];
  coverage: string[];
}

function generateTestDocumentation(testCode: string): TestDocumentation {
  const name = testCode.match(/test\(['"]([^'"]+)['"]/)?.[1] || 'Unknown Test';

  // Extract steps from code
  const steps: string[] = [];
  const gotoMatch = testCode.match(/goto\(['"]([^'"]+)['"]\)/);
  if (gotoMatch) {
    steps.push(`Navigate to ${gotoMatch[1]}`);
  }

  const fillMatches = testCode.matchAll(/fill\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g);
  for (const match of fillMatches) {
    steps.push(`Enter "${match[2]}" in ${match[1]}`);
  }

  const clickMatches = testCode.matchAll(/click\(\s*['"]([^'"]+)['"]\s*\)/g);
  for (const match of clickMatches) {
    steps.push(`Click on ${match[1]}`);
  }

  // Extract assertions
  const expectedResults: string[] = [];
  if (testCode.includes('toHaveURL')) {
    const urlMatch = testCode.match(/toHaveURL\(['"]([^'"]+)['"]\)/);
    if (urlMatch) {
      expectedResults.push(`User is redirected to ${urlMatch[1]}`);
    }
  }
  if (testCode.includes('toBeVisible')) {
    expectedResults.push('Expected element is visible');
  }

  // Extract tags
  const tags: string[] = [];
  if (testCode.includes('@critical')) tags.push('critical');
  if (testCode.includes('@smoke')) tags.push('smoke');
  if (testCode.includes('@regression')) tags.push('regression');

  return {
    name,
    description: `Test that verifies: ${name}`,
    preconditions: ['User has valid credentials', 'Application is accessible'],
    steps,
    expectedResults,
    tags,
    coverage: extractCoverage(testCode),
  };
}

function extractCoverage(testCode: string): string[] {
  const coverage: string[] = [];
  const selectors = testCode.match(/\[data-testid="([^"]+)"\]/g) || [];

  selectors.forEach((s) => {
    const component = s.match(/\[data-testid="([^"]+)"\]/)?.[1];
    if (component) {
      coverage.push(component);
    }
  });

  return [...new Set(coverage)];
}

// Example 2: Test catalog generator
interface TestCatalog {
  totalTests: number;
  byTag: Record<string, number>;
  byFeature: Record<string, TestDocumentation[]>;
  coverage: { component: string; testCount: number }[];
}

function generateTestCatalog(tests: TestDocumentation[]): TestCatalog {
  const byTag: Record<string, number> = {};
  const byFeature: Record<string, TestDocumentation[]> = {};
  const coverageMap = new Map<string, number>();

  tests.forEach((test) => {
    // Count by tag
    test.tags.forEach((tag) => {
      byTag[tag] = (byTag[tag] || 0) + 1;
    });

    // Group by feature (first word of test name)
    const feature = test.name.split(' ')[0];
    if (!byFeature[feature]) {
      byFeature[feature] = [];
    }
    byFeature[feature].push(test);

    // Track coverage
    test.coverage.forEach((component) => {
      coverageMap.set(component, (coverageMap.get(component) || 0) + 1);
    });
  });

  return {
    totalTests: tests.length,
    byTag,
    byFeature,
    coverage: Array.from(coverageMap.entries())
      .map(([component, testCount]) => ({ component, testCount }))
      .sort((a, b) => b.testCount - a.testCount),
  };
}

// Example 3: Markdown documentation generator
function generateMarkdownDocs(tests: TestDocumentation[]): string {
  let md = '# Test Documentation\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `Total Tests: ${tests.length}\n\n`;

  md += '## Test Cases\n\n';

  tests.forEach((test, i) => {
    md += `### ${i + 1}. ${test.name}\n\n`;
    md += `**Description:** ${test.description}\n\n`;

    if (test.preconditions.length > 0) {
      md += '**Preconditions:**\n';
      test.preconditions.forEach((p) => (md += `- ${p}\n`));
      md += '\n';
    }

    if (test.steps.length > 0) {
      md += '**Steps:**\n';
      test.steps.forEach((s, j) => (md += `${j + 1}. ${s}\n`));
      md += '\n';
    }

    if (test.expectedResults.length > 0) {
      md += '**Expected Results:**\n';
      test.expectedResults.forEach((r) => (md += `- ${r}\n`));
      md += '\n';
    }

    if (test.tags.length > 0) {
      md += `**Tags:** ${test.tags.join(', ')}\n\n`;
    }

    md += '---\n\n';
  });

  return md;
}

// Example 4: Self-documenting test
test.describe('Login Feature', () => {
  /**
   * @description Verifies that users can login with valid credentials
   * @precondition User account exists in the system
   * @tags critical, smoke
   */
  test('user can login with valid credentials @critical @smoke', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });
});

/**
 * EXERCISE:
 * 1. Generate documentation for your tests
 * 2. Create a test catalog
 * 3. Export to Markdown
 * 4. Keep documentation in sync
 *
 * LEARNING:
 * - AI extracts test intent
 * - Auto-generated docs stay current
 * - Catalogs provide overview
 * - Documentation aids collaboration
 *
 * ONE LINER:
 * "AI documents your tests automatically - always accurate, always up-to-date."
 */

export { generateTestDocumentation, generateTestCatalog, generateMarkdownDocs };

