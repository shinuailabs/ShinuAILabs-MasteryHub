/**
 * Lab 429: Storybook Integration
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Integrating Playwright with Storybook:
 *
 * - Testing Storybook stories
 * - Visual regression testing
 * - Interaction testing
 * - Accessibility testing
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test Storybook stories
 * 2. Run visual tests
 * 3. Test interactions
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: These examples assume Storybook is running on localhost:6006

// Solution 1: Navigate to Storybook
test('navigate to Storybook', async ({ page }) => {
    // In real scenario, navigate to Storybook
    // await page.goto('http://localhost:6006');

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Testing Button Story
test('testing button story', async ({ page }) => {
    // Simulating Storybook story testing
    await page.setContent(`
        <html>
            <body>
                <div id="storybook-root">
                    <button class="btn btn-primary">Primary Button</button>
                </div>
            </body>
        </html>
    `);

    const button = page.locator('.btn-primary');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Primary Button');
});

// Solution 3: Testing Multiple Button Variants
test('testing multiple button variants', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .btn { padding: 10px 20px; margin: 5px; }
                    .btn-primary { background: blue; color: white; }
                    .btn-secondary { background: gray; color: white; }
                    .btn-danger { background: red; color: white; }
                </style>
            </head>
            <body>
                <div id="storybook-root">
                    <button class="btn btn-primary">Primary</button>
                    <button class="btn btn-secondary">Secondary</button>
                    <button class="btn btn-danger">Danger</button>
                </div>
            </body>
        </html>
    `);

    await expect(page.locator('.btn-primary')).toBeVisible();
    await expect(page.locator('.btn-secondary')).toBeVisible();
    await expect(page.locator('.btn-danger')).toBeVisible();
});

// Solution 4: Testing Input Story
test('testing input story', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="storybook-root">
                    <input type="text" class="input" placeholder="Enter text">
                </div>
            </body>
        </html>
    `);

    const input = page.locator('.input');
    await input.fill('Test input');
    await expect(input).toHaveValue('Test input');
});

// Solution 5: Testing Card Story
test('testing card story', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
                    .card-title { font-size: 18px; font-weight: bold; }
                    .card-content { margin-top: 10px; }
                </style>
            </head>
            <body>
                <div id="storybook-root">
                    <div class="card">
                        <h3 class="card-title">Card Title</h3>
                        <p class="card-content">Card content goes here</p>
                    </div>
                </div>
            </body>
        </html>
    `);

    await expect(page.locator('.card-title')).toHaveText('Card Title');
    await expect(page.locator('.card-content')).toHaveText('Card content goes here');
});

// Solution 6: Testing Modal Story
test('testing modal story', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
                    .modal { background: white; padding: 20px; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div id="storybook-root">
                    <div class="modal-overlay">
                        <div class="modal">
                            <h2 class="modal-title">Modal Title</h2>
                            <p class="modal-content">Modal content</p>
                            <button class="modal-close">Close</button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);

    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal-title')).toHaveText('Modal Title');
});

// Solution 7: Visual Regression Testing
test('visual regression testing', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .component { padding: 20px; background: #f0f0f0; }
                </style>
            </head>
            <body>
                <div class="component">
                    <h1>Visual Test Component</h1>
                    <p>This component should look consistent</p>
                </div>
            </body>
        </html>
    `);

    // Take screenshot for visual comparison
    await expect(page.locator('.component')).toBeVisible();
    // await expect(page.locator('.component')).toHaveScreenshot('component.png');
});

// Solution 8: Interaction Testing
test('interaction testing', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="storybook-root">
                    <button class="interactive-btn">Click Me</button>
                    <p class="result"></p>
                </div>
                <script>
                    document.querySelector('.interactive-btn').onclick = () => {
                        document.querySelector('.result').textContent = 'Button clicked!';
                    };
                </script>
            </body>
        </html>
    `);

    await page.click('.interactive-btn');
    await expect(page.locator('.result')).toHaveText('Button clicked!');
});

// Solution 9: Accessibility Testing in Storybook
test('accessibility testing in Storybook', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="storybook-root">
                    <button aria-label="Submit form" class="a11y-btn">Submit</button>
                    <img src="image.jpg" alt="Description" class="a11y-img">
                </div>
            </body>
        </html>
    `);

    const button = page.locator('.a11y-btn');
    await expect(button).toHaveAttribute('aria-label', 'Submit form');
});

// Solution 10: Storybook Integration Best Practices
test('Storybook integration best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test all story variants
     * 2. Include visual regression tests
     * 3. Test interactions
     * 4. Check accessibility
     * 5. Run tests in CI/CD
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});
