/**
 * Lab 956: AI Layout Testing
 *
 * CONCEPT:
 * Layout testing verifies that UI elements are positioned correctly relative
 * to each other. AI can understand layout intent and detect issues like
 * overlapping elements, misalignment, and responsive breakage.
 *
 * BULLET POINTS:
 * - Verify element positioning
 * - Detect overlapping elements
 * - Check alignment and spacing
 * - Test responsive layouts
 * - AI understands layout intent
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Layout verification utilities
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function getBoundingBox(locator: Locator): Promise<BoundingBox | null> {
  return await locator.boundingBox();
}

function isAbove(box1: BoundingBox, box2: BoundingBox): boolean {
  return box1.y + box1.height <= box2.y;
}

function isBelow(box1: BoundingBox, box2: BoundingBox): boolean {
  return box1.y >= box2.y + box2.height;
}

function isLeftOf(box1: BoundingBox, box2: BoundingBox): boolean {
  return box1.x + box1.width <= box2.x;
}

function isRightOf(box1: BoundingBox, box2: BoundingBox): boolean {
  return box1.x >= box2.x + box2.width;
}

function overlaps(box1: BoundingBox, box2: BoundingBox): boolean {
  return !(
    isAbove(box1, box2) ||
    isBelow(box1, box2) ||
    isLeftOf(box1, box2) ||
    isRightOf(box1, box2)
  );
}

// Example 2: Layout assertions
class LayoutAssertions {
  constructor(private page: Page) {}

  async assertAbove(selector1: string, selector2: string): Promise<void> {
    const box1 = await getBoundingBox(this.page.locator(selector1));
    const box2 = await getBoundingBox(this.page.locator(selector2));

    if (!box1 || !box2) throw new Error('Element not found');
    expect(isAbove(box1, box2)).toBe(true);
  }

  async assertAligned(
    selector1: string,
    selector2: string,
    alignment: 'left' | 'right' | 'center' | 'top' | 'bottom'
  ): Promise<void> {
    const box1 = await getBoundingBox(this.page.locator(selector1));
    const box2 = await getBoundingBox(this.page.locator(selector2));

    if (!box1 || !box2) throw new Error('Element not found');

    const tolerance = 2; // pixels

    switch (alignment) {
      case 'left':
        expect(Math.abs(box1.x - box2.x)).toBeLessThanOrEqual(tolerance);
        break;
      case 'right':
        expect(Math.abs(box1.x + box1.width - (box2.x + box2.width))).toBeLessThanOrEqual(tolerance);
        break;
      case 'center':
        const center1 = box1.x + box1.width / 2;
        const center2 = box2.x + box2.width / 2;
        expect(Math.abs(center1 - center2)).toBeLessThanOrEqual(tolerance);
        break;
      case 'top':
        expect(Math.abs(box1.y - box2.y)).toBeLessThanOrEqual(tolerance);
        break;
      case 'bottom':
        expect(Math.abs(box1.y + box1.height - (box2.y + box2.height))).toBeLessThanOrEqual(tolerance);
        break;
    }
  }

  async assertNoOverlap(selector1: string, selector2: string): Promise<void> {
    const box1 = await getBoundingBox(this.page.locator(selector1));
    const box2 = await getBoundingBox(this.page.locator(selector2));

    if (!box1 || !box2) throw new Error('Element not found');
    expect(overlaps(box1, box2)).toBe(false);
  }

  async assertSpacing(
    selector1: string,
    selector2: string,
    expectedSpacing: number,
    tolerance: number = 2
  ): Promise<void> {
    const box1 = await getBoundingBox(this.page.locator(selector1));
    const box2 = await getBoundingBox(this.page.locator(selector2));

    if (!box1 || !box2) throw new Error('Element not found');

    const actualSpacing = box2.y - (box1.y + box1.height);
    expect(Math.abs(actualSpacing - expectedSpacing)).toBeLessThanOrEqual(tolerance);
  }
}

// Example 3: Layout tests
test.describe('Layout Tests', () => {
  test('header is above main content', async ({ page }) => {
    await page.goto('/');

    const layout = new LayoutAssertions(page);
    await layout.assertAbove('[data-testid="header"]', '[data-testid="main"]');
  });

  test('sidebar and content do not overlap', async ({ page }) => {
    await page.goto('/dashboard');

    const layout = new LayoutAssertions(page);
    await layout.assertNoOverlap('[data-testid="sidebar"]', '[data-testid="content"]');
  });

  test('form labels are aligned', async ({ page }) => {
    await page.goto('/form');

    const layout = new LayoutAssertions(page);
    await layout.assertAligned('[data-testid="label-1"]', '[data-testid="label-2"]', 'left');
  });
});

// Example 4: Responsive layout testing
test.describe('Responsive Layout', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`layout is correct at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Mobile: stack vertically
      if (vp.width < 768) {
        const layout = new LayoutAssertions(page);
        await layout.assertAbove('[data-testid="nav"]', '[data-testid="content"]');
      }
    });
  }
});

/**
 * EXERCISE:
 * 1. Create layout assertions for your app
 * 2. Test element positioning
 * 3. Verify responsive behavior
 * 4. Check for overlapping elements
 *
 * LEARNING:
 * - Layout testing catches positioning bugs
 * - Use bounding boxes for comparisons
 * - Test at multiple viewports
 * - AI can understand layout intent
 *
 * ONE LINER:
 * "Layout testing ensures elements stay where they belong - no matter the screen size."
 */

export { LayoutAssertions, getBoundingBox, isAbove, isBelow, overlaps };

