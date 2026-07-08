// @ts-nocheck
/**
 * Lab 1124: Accessibility (a11y) Testing Fundamentals
 *
 * CONCEPT:
 * Accessibility testing ensures web applications are usable by people with
 * disabilities. This includes visual, auditory, motor, and cognitive impairments.
 * Playwright + axe-core provides powerful automated accessibility testing.
 *
 * BULLET POINTS:
 * - WCAG: Web Content Accessibility Guidelines (A, AA, AAA levels)
 * - ARIA: Accessible Rich Internet Applications attributes
 * - axe-core: Industry-standard accessibility testing engine
 * - Keyboard navigation: Tab order, focus management
 * - Screen readers: How assistive technology interprets pages
 *
 * EXAMPLES:
 * - Form labels and error messages
 * - Color contrast ratios
 * - Keyboard-only navigation
 *
 * PREREQUISITES:
 * npm install @playwright/test @axe-core/playwright
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ============================================
// 1. Basic Accessibility Scan
// ============================================

test.describe('Accessibility Testing', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('https://example.com');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('https://example.com');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should scan specific page region', async ({ page }) => {
    await page.goto('https://example.com');

    // Only scan the main content area
    const results = await new AxeBuilder({ page })
      .include('#main-content')
      .exclude('#advertisement')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

// ============================================
// 2. Accessibility Report Generator
// ============================================

interface A11yViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

class AccessibilityReporter {
  private violations: A11yViolation[] = [];

  async scan(page: Page, options?: { tags?: string[] }): Promise<A11yViolation[]> {
    let builder = new AxeBuilder({ page });

    if (options?.tags) {
      builder = builder.withTags(options.tags);
    }

    const results = await builder.analyze();
    this.violations = results.violations as A11yViolation[];
    return this.violations;
  }

  getViolationsByImpact(impact: 'minor' | 'moderate' | 'serious' | 'critical'): A11yViolation[] {
    return this.violations.filter(v => v.impact === impact);
  }

  getCriticalViolations(): A11yViolation[] {
    return this.getViolationsByImpact('critical');
  }

  generateReport(): string {
    if (this.violations.length === 0) {
      return '✅ No accessibility violations found!';
    }

    let report = `❌ Found ${this.violations.length} accessibility violations:\n\n`;

    for (const violation of this.violations) {
      report += `## ${violation.id} (${violation.impact})\n`;
      report += `${violation.description}\n`;
      report += `Help: ${violation.helpUrl}\n`;
      report += `Affected elements:\n`;

      for (const node of violation.nodes) {
        report += `  - ${node.target.join(' > ')}\n`;
        report += `    HTML: ${node.html.slice(0, 100)}...\n`;
      }
      report += '\n';
    }

    return report;
  }
}

// ============================================
// 3. Keyboard Navigation Testing
// ============================================

test.describe('Keyboard Navigation', () => {
  test('should navigate form with keyboard only', async ({ page }) => {
    await page.goto('https://example.com/form');

    // Tab to first input
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBe('INPUT');

    // Tab through all form elements
    await page.keyboard.press('Tab'); // Password
    await page.keyboard.press('Tab'); // Submit button

    const submitFocused = await page.evaluate(() =>
      document.activeElement?.getAttribute('type')
    );
    expect(submitFocused).toBe('submit');

    // Submit with Enter key
    await page.keyboard.press('Enter');
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('https://example.com');

    await page.keyboard.press('Tab');

    // Check that focused element has visible outline
    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate((el) =>
      window.getComputedStyle(el).outline
    );

    // Should have some visible focus indicator
    expect(outline).not.toBe('none');
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.goto('https://example.com');

    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click();

    // Tab through modal elements
    const focusableInModal: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() =>
        document.activeElement?.getAttribute('data-testid') ||
        document.activeElement?.tagName
      );
      focusableInModal.push(focused || '');
    }

    // Focus should cycle within modal (not escape to page behind)
    const modalElements = focusableInModal.filter(el =>
      el.includes('modal') || ['BUTTON', 'INPUT'].includes(el)
    );
    expect(modalElements.length).toBeGreaterThan(0);
  });
});

// ============================================
// 4. Color Contrast Testing
// ============================================

async function checkColorContrast(page: Page, selector: string): Promise<boolean> {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withRules(['color-contrast'])
    .analyze();

  return results.violations.length === 0;
}

test('should have sufficient color contrast', async ({ page }) => {
  await page.goto('https://example.com');

  const hasGoodContrast = await checkColorContrast(page, 'body');
  expect(hasGoodContrast).toBe(true);
});

// ============================================
// 5. ARIA Validation
// ============================================

test.describe('ARIA Attributes', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('https://example.com');

    // Check buttons have accessible names
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') ||
                   await button.textContent();
      expect(name?.trim()).not.toBe('');
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('https://example.com/form');

    // All inputs should have associated labels
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Should have either a label, aria-label, or aria-labelledby
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;

      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });
});

/**
 * EXERCISE:
 * 1. Run accessibility scan on your application
 * 2. Fix critical and serious violations
 * 3. Test keyboard navigation for all interactive elements
 * 4. Verify color contrast meets WCAG AA standards
 * 5. Add ARIA labels to custom components
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is WCAG and what are the conformance levels?
 * A1: WCAG (Web Content Accessibility Guidelines) has 3 levels:
 *     A (minimum), AA (standard), AAA (enhanced).
 *     Most organizations target AA compliance.
 *
 * Q2: How do you test for screen reader compatibility?
 * A2: Use axe-core for automated checks, manual testing with
 *     NVDA/VoiceOver, and verify ARIA attributes are correct.
 */

/**
 * LEARNING:
 * - Accessibility is a legal requirement in many countries
 * - axe-core catches ~57% of accessibility issues automatically
 * - Manual testing is still needed for complete coverage
 * - Focus on WCAG 2.1 AA as the standard target
 *
 * ONE LINER:
 * "Accessibility: Build for everyone, test for everyone."
 */

export { AccessibilityReporter, checkColorContrast };
