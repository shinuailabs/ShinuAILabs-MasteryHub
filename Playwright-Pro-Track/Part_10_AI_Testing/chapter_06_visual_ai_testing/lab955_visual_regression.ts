/**
 * Lab 955: Visual Regression Testing
 *
 * CONCEPT:
 * Visual regression testing detects unintended visual changes between builds.
 * AI-powered tools can distinguish between intentional changes and bugs,
 * reducing false positives and maintenance burden.
 *
 * BULLET POINTS:
 * - Detect unintended visual changes
 * - Compare against baseline images
 * - AI reduces false positives
 * - Track visual history
 * - Automate approval workflow
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Example 1: Visual regression test setup
interface VisualRegressionConfig {
  baselineDir: string;
  diffDir: string;
  threshold: number;
  updateBaselines: boolean;
}

const config: VisualRegressionConfig = {
  baselineDir: './visual-baselines',
  diffDir: './visual-diffs',
  threshold: 0.1, // 10% difference allowed
  updateBaselines: process.env.UPDATE_BASELINES === 'true',
};

// Example 2: Visual regression test class
class VisualRegressionTester {
  constructor(private config: VisualRegressionConfig) {
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    [this.config.baselineDir, this.config.diffDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async compare(
    page: Page,
    name: string
  ): Promise<{ passed: boolean; diffPercentage: number }> {
    const baselinePath = path.join(this.config.baselineDir, `${name}.png`);
    const currentScreenshot = await page.screenshot();

    if (!fs.existsSync(baselinePath) || this.config.updateBaselines) {
      fs.writeFileSync(baselinePath, currentScreenshot);
      return { passed: true, diffPercentage: 0 };
    }

    // In real implementation, use image comparison library
    // like pixelmatch or resemblejs
    const diffPercentage = 0.05; // Simulated

    return {
      passed: diffPercentage <= this.config.threshold,
      diffPercentage,
    };
  }
}

// Example 3: Visual regression tests
test.describe('Visual Regression Tests', () => {
  const tester = new VisualRegressionTester(config);

  test('homepage has no visual regression', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const result = await tester.compare(page, 'homepage');

    expect(result.passed).toBe(true);
    if (!result.passed) {
      console.log(`Visual regression detected: ${result.diffPercentage * 100}% different`);
    }
  });

  test('login form has no visual regression', async ({ page }) => {
    await page.goto('/login');

    const result = await tester.compare(page, 'login-form');
    expect(result.passed).toBe(true);
  });
});

// Example 4: AI-powered difference analysis
interface VisualChange {
  type: 'layout' | 'color' | 'text' | 'image' | 'spacing';
  severity: 'critical' | 'major' | 'minor' | 'trivial';
  location: { x: number; y: number; width: number; height: number };
  description: string;
  isIntentional: boolean;
}

function analyzeVisualChanges(
  baseline: Buffer,
  current: Buffer
): VisualChange[] {
  // AI would analyze the differences
  // This is a simulated response
  return [
    {
      type: 'color',
      severity: 'minor',
      location: { x: 100, y: 50, width: 200, height: 40 },
      description: 'Button color changed from #007bff to #0056b3',
      isIntentional: false,
    },
    {
      type: 'spacing',
      severity: 'trivial',
      location: { x: 0, y: 200, width: 1920, height: 100 },
      description: 'Margin increased by 2px',
      isIntentional: true,
    },
  ];
}

// Example 5: Regression report generation
interface RegressionReport {
  timestamp: Date;
  totalTests: number;
  passed: number;
  failed: number;
  changes: VisualChange[];
}

function generateRegressionReport(
  results: { name: string; passed: boolean; changes: VisualChange[] }[]
): RegressionReport {
  return {
    timestamp: new Date(),
    totalTests: results.length,
    passed: results.filter((r) => r.passed).length,
    failed: results.filter((r) => !r.passed).length,
    changes: results.flatMap((r) => r.changes),
  };
}

// Example 6: Baseline management
class BaselineManager {
  constructor(private baselineDir: string) {}

  async updateBaseline(name: string, screenshot: Buffer): Promise<void> {
    const filePath = path.join(this.baselineDir, `${name}.png`);
    fs.writeFileSync(filePath, screenshot);
    console.log(`Updated baseline: ${name}`);
  }

  async getBaseline(name: string): Promise<Buffer | null> {
    const filePath = path.join(this.baselineDir, `${name}.png`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  }

  listBaselines(): string[] {
    return fs.readdirSync(this.baselineDir).filter((f) => f.endsWith('.png'));
  }
}

/**
 * EXERCISE:
 * 1. Set up visual regression testing
 * 2. Create baseline images
 * 3. Detect visual changes
 * 4. Review and approve changes
 *
 * LEARNING:
 * - Visual regression catches UI bugs
 * - AI reduces false positives
 * - Manage baselines carefully
 * - Integrate with CI/CD
 *
 * ONE LINER:
 * "Visual regression testing ensures your UI stays pixel-perfect across releases."
 */

export {
  VisualRegressionTester,
  analyzeVisualChanges,
  generateRegressionReport,
  BaselineManager,
};

