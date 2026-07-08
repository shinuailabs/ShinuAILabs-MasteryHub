/**
 * Lab 936: Visual AI Locators
 *
 * CONCEPT:
 * Visual AI locators use image recognition and computer vision to find elements
 * based on their appearance rather than DOM structure. This is useful for
 * canvas elements, complex UIs, and cross-browser testing.
 *
 * BULLET POINTS:
 * - Find elements by visual appearance
 * - Works with canvas and WebGL
 * - Cross-browser visual consistency
 * - Handles dynamic content
 * - Useful for image-based UIs
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Visual element matching concept
interface VisualMatch {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

async function findByImage(
  page: Page,
  templatePath: string,
  threshold: number = 0.8
): Promise<VisualMatch | null> {
  // This would use image recognition library
  // Simulated implementation
  const screenshot = await page.screenshot();

  // In real implementation, use OpenCV or similar
  // to find template in screenshot
  console.log(`Searching for ${templatePath} with threshold ${threshold}`);

  // Return mock match
  return {
    x: 100,
    y: 200,
    width: 50,
    height: 30,
    confidence: 0.95,
  };
}

// Example 2: Click by visual reference
async function clickByImage(
  page: Page,
  imagePath: string,
  options: { threshold?: number; timeout?: number } = {}
): Promise<void> {
  const { threshold = 0.8, timeout = 10000 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const match = await findByImage(page, imagePath, threshold);

    if (match && match.confidence >= threshold) {
      // Click center of matched region
      await page.mouse.click(
        match.x + match.width / 2,
        match.y + match.height / 2
      );
      return;
    }

    await page.waitForTimeout(500);
  }

  throw new Error(`Could not find image: ${imagePath}`);
}

// Example 3: Visual locator for canvas elements
test.describe('Visual Locators for Canvas', () => {
  test('interact with canvas element', async ({ page }) => {
    await page.goto('/canvas-app');

    // Traditional locators don't work inside canvas
    // Use visual matching instead

    // Find and click a button rendered in canvas
    // await clickByImage(page, './images/canvas-button.png');

    // For now, use coordinate-based clicking
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();

    if (box) {
      // Click at specific position in canvas
      await page.mouse.click(box.x + 100, box.y + 50);
    }
  });
});

// Example 4: Applitools-style visual locators
interface VisualLocatorConfig {
  name: string;
  region?: { x: number; y: number; width: number; height: number };
  matchLevel: 'strict' | 'content' | 'layout';
}

class VisualLocator {
  constructor(
    private page: Page,
    private config: VisualLocatorConfig
  ) {}

  async click(): Promise<void> {
    if (this.config.region) {
      const { x, y, width, height } = this.config.region;
      await this.page.mouse.click(x + width / 2, y + height / 2);
    }
  }

  async screenshot(): Promise<Buffer> {
    if (this.config.region) {
      return await this.page.screenshot({ clip: this.config.region });
    }
    return await this.page.screenshot();
  }
}

// Example 5: AI-powered element detection
interface DetectedElement {
  type: 'button' | 'input' | 'link' | 'image' | 'text';
  bounds: { x: number; y: number; width: number; height: number };
  text?: string;
  confidence: number;
}

async function detectElements(page: Page): Promise<DetectedElement[]> {
  // This would use ML model to detect UI elements
  // Simulated implementation
  return [
    {
      type: 'button',
      bounds: { x: 100, y: 200, width: 80, height: 30 },
      text: 'Submit',
      confidence: 0.95,
    },
    {
      type: 'input',
      bounds: { x: 100, y: 150, width: 200, height: 30 },
      confidence: 0.92,
    },
  ];
}

test('AI element detection', async ({ page }) => {
  await page.goto('/');

  const elements = await detectElements(page);
  const buttons = elements.filter((e) => e.type === 'button');

  console.log(`Found ${buttons.length} buttons on page`);

  // Click first detected button
  if (buttons.length > 0) {
    const btn = buttons[0];
    await page.mouse.click(
      btn.bounds.x + btn.bounds.width / 2,
      btn.bounds.y + btn.bounds.height / 2
    );
  }
});

/**
 * EXERCISE:
 * 1. Capture visual references for key elements
 * 2. Implement visual matching for canvas
 * 3. Compare visual vs DOM locators
 * 4. Handle visual variations
 *
 * LEARNING:
 * - Visual locators work where DOM fails
 * - Useful for canvas and complex UIs
 * - Requires image processing setup
 * - Consider performance impact
 *
 * ONE LINER:
 * "Visual locators see your app like users do - finding elements by how they look."
 */

export { findByImage, clickByImage, VisualLocator, detectElements };

