/**
 * Lab 939: AI Locator Maintenance
 *
 * CONCEPT:
 * AI can help maintain locators by detecting when they become stale, suggesting
 * updates, and automatically healing broken selectors. This reduces the
 * maintenance burden of test automation.
 *
 * BULLET POINTS:
 * - Detect stale/broken locators
 * - Suggest locator updates
 * - Track locator health metrics
 * - Auto-heal common issues
 * - Generate maintenance reports
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Locator health tracking
interface LocatorHealth {
  selector: string;
  lastSuccess: Date | null;
  lastFailure: Date | null;
  successCount: number;
  failureCount: number;
  healCount: number;
  status: 'healthy' | 'degraded' | 'broken';
}

class LocatorHealthTracker {
  private health: Map<string, LocatorHealth> = new Map();

  recordSuccess(selector: string): void {
    const h = this.getOrCreate(selector);
    h.lastSuccess = new Date();
    h.successCount++;
    this.updateStatus(h);
  }

  recordFailure(selector: string): void {
    const h = this.getOrCreate(selector);
    h.lastFailure = new Date();
    h.failureCount++;
    this.updateStatus(h);
  }

  recordHeal(selector: string): void {
    const h = this.getOrCreate(selector);
    h.healCount++;
  }

  private getOrCreate(selector: string): LocatorHealth {
    if (!this.health.has(selector)) {
      this.health.set(selector, {
        selector,
        lastSuccess: null,
        lastFailure: null,
        successCount: 0,
        failureCount: 0,
        healCount: 0,
        status: 'healthy',
      });
    }
    return this.health.get(selector)!;
  }

  private updateStatus(h: LocatorHealth): void {
    const total = h.successCount + h.failureCount;
    const failureRate = total > 0 ? h.failureCount / total : 0;

    if (failureRate > 0.5) h.status = 'broken';
    else if (failureRate > 0.1) h.status = 'degraded';
    else h.status = 'healthy';
  }

  getReport(): LocatorHealth[] {
    return Array.from(this.health.values()).sort(
      (a, b) => b.failureCount - a.failureCount
    );
  }

  getBrokenLocators(): LocatorHealth[] {
    return this.getReport().filter((h) => h.status === 'broken');
  }
}

// Example 2: Locator update suggester
interface LocatorSuggestion {
  oldSelector: string;
  newSelector: string;
  reason: string;
  confidence: number;
}

async function suggestLocatorUpdates(
  page: Page,
  brokenSelector: string
): Promise<LocatorSuggestion[]> {
  const suggestions: LocatorSuggestion[] = [];

  // Try to find similar elements
  const allElements = await page.locator('*').all();

  for (const element of allElements.slice(0, 100)) {
    const attrs = await element.evaluate((el) => ({
      testId: el.getAttribute('data-testid'),
      id: el.id,
      className: el.className,
      text: el.textContent?.trim().substring(0, 30),
    }));

    // Check if this might be the element we're looking for
    if (brokenSelector.includes('login') && attrs.text?.toLowerCase().includes('login')) {
      if (attrs.testId) {
        suggestions.push({
          oldSelector: brokenSelector,
          newSelector: `[data-testid="${attrs.testId}"]`,
          reason: 'Found element with matching text and data-testid',
          confidence: 90,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

// Example 3: Maintenance report generator
interface MaintenanceReport {
  generatedAt: Date;
  totalLocators: number;
  healthyCount: number;
  degradedCount: number;
  brokenCount: number;
  recommendations: string[];
}

function generateMaintenanceReport(tracker: LocatorHealthTracker): MaintenanceReport {
  const report = tracker.getReport();
  const broken = report.filter((h) => h.status === 'broken');
  const degraded = report.filter((h) => h.status === 'degraded');
  const healthy = report.filter((h) => h.status === 'healthy');

  const recommendations: string[] = [];

  if (broken.length > 0) {
    recommendations.push(`Fix ${broken.length} broken locators immediately`);
    broken.forEach((b) => {
      recommendations.push(`  - ${b.selector}: ${b.failureCount} failures`);
    });
  }

  if (degraded.length > 0) {
    recommendations.push(`Review ${degraded.length} degraded locators`);
  }

  const highHealCount = report.filter((h) => h.healCount > 5);
  if (highHealCount.length > 0) {
    recommendations.push(`Update ${highHealCount.length} frequently healed locators`);
  }

  return {
    generatedAt: new Date(),
    totalLocators: report.length,
    healthyCount: healthy.length,
    degradedCount: degraded.length,
    brokenCount: broken.length,
    recommendations,
  };
}

// Example 4: Using maintenance tools
const healthTracker = new LocatorHealthTracker();

test.describe('Locator Maintenance', () => {
  test.afterEach(async ({}, testInfo) => {
    // Track locator health based on test results
    if (testInfo.status === 'passed') {
      // Record success for locators used
    } else if (testInfo.status === 'failed') {
      // Record failure and check for locator issues
    }
  });

  test('track locator health', async ({ page }) => {
    await page.goto('/login');

    const selector = '[data-testid="login-button"]';

    try {
      await page.locator(selector).click({ timeout: 5000 });
      healthTracker.recordSuccess(selector);
    } catch {
      healthTracker.recordFailure(selector);
    }
  });
});

test.afterAll(() => {
  const report = generateMaintenanceReport(healthTracker);
  console.log('Locator Maintenance Report:', report);
});

/**
 * EXERCISE:
 * 1. Implement locator health tracking
 * 2. Generate maintenance reports
 * 3. Set up alerts for broken locators
 * 4. Create update suggestions
 *
 * LEARNING:
 * - Track locator health over time
 * - Proactively fix degraded locators
 * - Auto-suggest updates
 * - Generate actionable reports
 *
 * ONE LINER:
 * "AI maintains your locators so tests keep running - even when the UI changes."
 */

export { LocatorHealthTracker, suggestLocatorUpdates, generateMaintenanceReport };

