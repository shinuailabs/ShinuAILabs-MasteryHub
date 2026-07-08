/**
 * Lab 935: Self-Healing Locators
 *
 * CONCEPT:
 * Self-healing locators automatically adapt when UI changes break traditional
 * selectors. They use multiple attributes and AI to find elements even when
 * the primary locator fails.
 *
 * BULLET POINTS:
 * - Automatically recover from broken locators
 * - Use multiple element attributes
 * - Learn from successful recoveries
 * - Reduce test maintenance
 * - Report healed locators for review
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Self-healing locator implementation
interface ElementFingerprint {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  attributes: Record<string, string>;
  position: { x: number; y: number };
}

class SelfHealingLocator {
  private fingerprint: ElementFingerprint | null = null;
  private healingLog: { original: string; healed: string; timestamp: Date }[] = [];

  constructor(
    private page: Page,
    private primarySelector: string,
    private alternativeSelectors: string[] = []
  ) {}

  async find(): Promise<Locator> {
    // Try primary selector first
    const primary = this.page.locator(this.primarySelector);
    if ((await primary.count()) > 0) {
      await this.captureFingerprint(primary);
      return primary;
    }

    // Try alternative selectors
    for (const selector of this.alternativeSelectors) {
      const alt = this.page.locator(selector);
      if ((await alt.count()) > 0) {
        this.logHealing(this.primarySelector, selector);
        return alt;
      }
    }

    // Try to heal using fingerprint
    if (this.fingerprint) {
      const healed = await this.healFromFingerprint();
      if (healed) return healed;
    }

    throw new Error(`Could not find element: ${this.primarySelector}`);
  }

  private async captureFingerprint(locator: Locator): Promise<void> {
    this.fingerprint = await locator.evaluate((el) => ({
      tagName: el.tagName.toLowerCase(),
      id: el.id || undefined,
      className: el.className || undefined,
      text: el.textContent?.trim().substring(0, 50),
      attributes: Object.fromEntries(
        Array.from(el.attributes).map((a) => [a.name, a.value])
      ),
      position: { x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y },
    }));
  }

  private async healFromFingerprint(): Promise<Locator | null> {
    if (!this.fingerprint) return null;

    const strategies = [
      // Try by text content
      this.fingerprint.text
        ? `${this.fingerprint.tagName}:has-text("${this.fingerprint.text}")`
        : null,
      // Try by tag and class
      this.fingerprint.className
        ? `${this.fingerprint.tagName}.${this.fingerprint.className.split(' ')[0]}`
        : null,
      // Try by any data attribute
      ...Object.entries(this.fingerprint.attributes)
        .filter(([k]) => k.startsWith('data-'))
        .map(([k, v]) => `[${k}="${v}"]`),
    ].filter(Boolean) as string[];

    for (const selector of strategies) {
      const locator = this.page.locator(selector);
      if ((await locator.count()) === 1) {
        this.logHealing(this.primarySelector, selector);
        return locator;
      }
    }

    return null;
  }

  private logHealing(original: string, healed: string): void {
    this.healingLog.push({ original, healed, timestamp: new Date() });
    console.log(`🔧 Self-healed: "${original}" → "${healed}"`);
  }

  getHealingLog() {
    return this.healingLog;
  }
}

// Example 2: Using self-healing locators in tests
test.describe('Self-Healing Locators', () => {
  test('locator heals when primary selector breaks', async ({ page }) => {
    await page.goto('/login');

    const loginButton = new SelfHealingLocator(
      page,
      '[data-testid="login-btn"]', // Primary (might break)
      [
        '[data-testid="login-button"]', // Alternative 1
        'button[type="submit"]', // Alternative 2
        "button:has-text('Log in')", // Alternative 3
      ]
    );

    const button = await loginButton.find();
    await button.click();

    // Check if healing occurred
    const log = loginButton.getHealingLog();
    if (log.length > 0) {
      console.log('Locator was healed:', log);
    }
  });
});

// Example 3: Healenium-style integration
interface HealeniumConfig {
  enabled: boolean;
  healingThreshold: number;
  reportPath: string;
}

const healeniumConfig: HealeniumConfig = {
  enabled: true,
  healingThreshold: 0.7, // 70% similarity required
  reportPath: './healing-report.json',
};

/**
 * EXERCISE:
 * 1. Implement self-healing for your critical locators
 * 2. Add fingerprinting for element identification
 * 3. Create a healing report
 * 4. Review and update healed locators
 *
 * LEARNING:
 * - Self-healing reduces maintenance
 * - Multiple strategies increase resilience
 * - Always review healed locators
 * - Update primary selectors when healed
 *
 * ONE LINER:
 * "Self-healing locators fix themselves so you don't have to - but always review the fixes."
 */

export { SelfHealingLocator, healeniumConfig };

