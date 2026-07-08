/**
 * Lab 961: Self-Healing Tests
 *
 * CONCEPT:
 * Self-healing tests automatically adapt when UI changes break locators.
 * AI identifies alternative ways to find elements and updates tests
 * without manual intervention.
 *
 * BULLET POINTS:
 * - Automatic locator recovery
 * - Multiple fallback strategies
 * - Learning from successful heals
 * - Reporting healed locators
 * - Reducing maintenance burden
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Self-healing test framework
interface HealingStrategy {
  name: string;
  priority: number;
  findElement: (page: Page, context: ElementContext) => Locator;
}

interface ElementContext {
  originalSelector: string;
  tagName?: string;
  text?: string;
  attributes?: Record<string, string>;
  nearbyText?: string;
}

class SelfHealingTest {
  private healingLog: { selector: string; healedWith: string; strategy: string }[] = [];

  private strategies: HealingStrategy[] = [
    {
      name: 'data-testid',
      priority: 1,
      findElement: (page, ctx) => {
        const testId = ctx.attributes?.['data-testid'];
        return page.locator(`[data-testid="${testId}"]`);
      },
    },
    {
      name: 'text-content',
      priority: 2,
      findElement: (page, ctx) => {
        if (ctx.text) {
          return page.getByText(ctx.text, { exact: true });
        }
        return page.locator('nonexistent');
      },
    },
    {
      name: 'role-based',
      priority: 3,
      findElement: (page, ctx) => {
        if (ctx.tagName === 'button') {
          return page.getByRole('button', { name: ctx.text });
        }
        return page.locator('nonexistent');
      },
    },
    {
      name: 'nearby-text',
      priority: 4,
      findElement: (page, ctx) => {
        if (ctx.nearbyText) {
          return page.locator(`text=${ctx.nearbyText}`).locator('xpath=following-sibling::*[1]');
        }
        return page.locator('nonexistent');
      },
    },
  ];

  async findElement(page: Page, selector: string, context?: Partial<ElementContext>): Promise<Locator> {
    // Try original selector first
    const original = page.locator(selector);
    if ((await original.count()) > 0) {
      return original;
    }

    // Try healing strategies
    const ctx: ElementContext = { originalSelector: selector, ...context };

    for (const strategy of this.strategies.sort((a, b) => a.priority - b.priority)) {
      try {
        const locator = strategy.findElement(page, ctx);
        if ((await locator.count()) > 0) {
          this.logHealing(selector, await this.getSelector(locator), strategy.name);
          return locator;
        }
      } catch {
        continue;
      }
    }

    throw new Error(`Could not find element: ${selector}`);
  }

  private async getSelector(locator: Locator): Promise<string> {
    // In real implementation, extract the actual selector
    return 'healed-selector';
  }

  private logHealing(original: string, healed: string, strategy: string): void {
    this.healingLog.push({ selector: original, healedWith: healed, strategy });
    console.log(`🔧 Healed: ${original} → ${healed} (using ${strategy})`);
  }

  getHealingReport(): typeof this.healingLog {
    return this.healingLog;
  }
}

// Example 2: Using self-healing tests
test.describe('Self-Healing Tests', () => {
  const healer = new SelfHealingTest();

  test('login with self-healing locators', async ({ page }) => {
    await page.goto('/login');

    // These locators will self-heal if they break
    const emailInput = await healer.findElement(page, '#email-input', {
      tagName: 'input',
      attributes: { 'data-testid': 'email' },
    });

    const passwordInput = await healer.findElement(page, '#password-input', {
      tagName: 'input',
      attributes: { 'data-testid': 'password' },
    });

    const loginButton = await healer.findElement(page, '.login-btn', {
      tagName: 'button',
      text: 'Log in',
    });

    await emailInput.fill('user@example.com');
    await passwordInput.fill('password123');
    await loginButton.click();
  });

  test.afterAll(() => {
    const report = healer.getHealingReport();
    if (report.length > 0) {
      console.log('\n📋 Healing Report:');
      report.forEach((r) => console.log(`  - ${r.selector} → ${r.healedWith}`));
    }
  });
});

// Example 3: Healenium-style integration
interface HealeniumConfig {
  enabled: boolean;
  healingEnabled: boolean;
  scoreCapacity: number;
  recoveryTries: number;
  serverUrl: string;
}

const healeniumConfig: HealeniumConfig = {
  enabled: true,
  healingEnabled: true,
  scoreCapacity: 5,
  recoveryTries: 3,
  serverUrl: 'http://localhost:7878',
};

/**
 * EXERCISE:
 * 1. Implement self-healing for your tests
 * 2. Define healing strategies
 * 3. Track healed locators
 * 4. Review and update healed selectors
 *
 * LEARNING:
 * - Self-healing reduces maintenance
 * - Multiple strategies increase success
 * - Always review healed locators
 * - Update original selectors when healed
 *
 * ONE LINER:
 * "Self-healing tests fix themselves when UI changes - but always review the fixes."
 */

export { SelfHealingTest, healeniumConfig };

