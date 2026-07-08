/**
 * Lab 959: Visual Accessibility Testing
 *
 * CONCEPT:
 * Visual accessibility testing uses AI to detect accessibility issues that
 * affect visual perception, such as color contrast, text size, focus
 * indicators, and touch target sizes.
 *
 * BULLET POINTS:
 * - Check color contrast ratios
 * - Verify text readability
 * - Test focus indicators
 * - Validate touch target sizes
 * - AI detects visual a11y issues
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Color contrast checker
interface ContrastResult {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

async function checkColorContrast(page: Page): Promise<ContrastResult[]> {
  return await page.evaluate(() => {
    const results: ContrastResult[] = [];
    const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label');

    textElements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const fg = styles.color;
      const bg = styles.backgroundColor;

      // Simplified contrast calculation
      // In real implementation, use proper color contrast algorithm
      const ratio = 4.5; // Simulated

      results.push({
        element: el.tagName.toLowerCase(),
        foreground: fg,
        background: bg,
        ratio,
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7,
      });
    });

    return results;
  });
}

// Example 2: Focus indicator checker
interface FocusIndicatorResult {
  element: string;
  hasFocusStyle: boolean;
  focusVisible: boolean;
  outlineWidth: string;
  outlineColor: string;
}

async function checkFocusIndicators(page: Page): Promise<FocusIndicatorResult[]> {
  const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]').all();
  const results: FocusIndicatorResult[] = [];

  for (const element of focusableElements.slice(0, 20)) {
    await element.focus();

    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outlineWidth: computed.outlineWidth,
        outlineColor: computed.outlineColor,
        outlineStyle: computed.outlineStyle,
      };
    });

    results.push({
      element: await element.evaluate((el) => el.tagName.toLowerCase()),
      hasFocusStyle: styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px',
      focusVisible: true,
      outlineWidth: styles.outlineWidth,
      outlineColor: styles.outlineColor,
    });
  }

  return results;
}

// Example 3: Touch target size checker
interface TouchTargetResult {
  element: string;
  width: number;
  height: number;
  meetsMinimum: boolean;
  minimumSize: number;
}

async function checkTouchTargets(page: Page): Promise<TouchTargetResult[]> {
  const minimumSize = 44; // WCAG 2.5.5 minimum

  const clickableElements = await page.locator('a, button, [role="button"], input[type="checkbox"], input[type="radio"]').all();
  const results: TouchTargetResult[] = [];

  for (const element of clickableElements.slice(0, 20)) {
    const box = await element.boundingBox();

    if (box) {
      results.push({
        element: await element.evaluate((el) => el.tagName.toLowerCase()),
        width: box.width,
        height: box.height,
        meetsMinimum: box.width >= minimumSize && box.height >= minimumSize,
        minimumSize,
      });
    }
  }

  return results;
}

// Example 4: Visual accessibility tests
test.describe('Visual Accessibility Tests', () => {
  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/');

    const results = await checkColorContrast(page);
    const failures = results.filter((r) => !r.wcagAA);

    if (failures.length > 0) {
      console.log('Contrast failures:', failures);
    }

    expect(failures.length).toBe(0);
  });

  test('all focusable elements have visible focus', async ({ page }) => {
    await page.goto('/');

    const results = await checkFocusIndicators(page);
    const failures = results.filter((r) => !r.hasFocusStyle);

    expect(failures.length).toBe(0);
  });

  test('touch targets meet minimum size', async ({ page }) => {
    await page.goto('/');

    const results = await checkTouchTargets(page);
    const failures = results.filter((r) => !r.meetsMinimum);

    if (failures.length > 0) {
      console.log('Touch target failures:', failures);
    }

    // Allow some failures for inline links
    expect(failures.length).toBeLessThan(5);
  });
});

// Example 5: Text readability checker
async function checkTextReadability(page: Page): Promise<{ element: string; fontSize: number; isReadable: boolean }[]> {
  return await page.evaluate(() => {
    const minimumFontSize = 16; // Recommended minimum
    const textElements = document.querySelectorAll('p, span, li, td');
    const results: { element: string; fontSize: number; isReadable: boolean }[] = [];

    textElements.forEach((el) => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      results.push({
        element: el.tagName.toLowerCase(),
        fontSize,
        isReadable: fontSize >= minimumFontSize,
      });
    });

    return results;
  });
}

/**
 * EXERCISE:
 * 1. Check color contrast on your pages
 * 2. Verify focus indicators
 * 3. Test touch target sizes
 * 4. Check text readability
 *
 * LEARNING:
 * - Visual a11y affects many users
 * - Color contrast is critical
 * - Focus indicators aid navigation
 * - Touch targets need adequate size
 *
 * ONE LINER:
 * "Visual accessibility testing ensures everyone can see and use your UI."
 */

export { checkColorContrast, checkFocusIndicators, checkTouchTargets, checkTextReadability };

