/**
 * Lab 430: Component Testing Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for component testing:
 * 
 * - Test organization
 * - Isolation strategies
 * - Mocking dependencies
 * - Performance optimization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize tests effectively
 * 3. Optimize test performance
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Test Organization
test.describe('Button Component', () => {
    test('renders correctly', async ({ page }) => {
        await page.setContent('<button class="btn">Click</button>');
        await expect(page.locator('.btn')).toBeVisible();
    });
    
    test('handles click', async ({ page }) => {
        await page.setContent(`
            <button class="btn" onclick="this.textContent='Clicked'">Click</button>
        `);
        await page.click('.btn');
        await expect(page.locator('.btn')).toHaveText('Clicked');
    });
    
    test('can be disabled', async ({ page }) => {
        await page.setContent('<button class="btn" disabled>Click</button>');
        await expect(page.locator('.btn')).toBeDisabled();
    });
});

// Solution 2: Component Isolation
test('component isolation', async ({ page }) => {
    // Create isolated environment
    await page.setContent(`
        <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                </style>
            </head>
            <body>
                <div id="test-root">
                    <div class="isolated-component">
                        Isolated Component
                    </div>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.isolated-component')).toBeVisible();
});

// Solution 3: Mocking External Dependencies
test('mocking external dependencies', async ({ page }) => {
    // Mock API response
    await page.route('**/api/data', route => {
        route.fulfill({
            status: 200,
            body: JSON.stringify({ message: 'Mocked data' }),
        });
    });
    
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <button class="fetch-btn">Fetch Data</button>
                    <p class="data"></p>
                </div>
                <script>
                    document.querySelector('.fetch-btn').onclick = async () => {
                        const res = await fetch('/api/data');
                        const data = await res.json();
                        document.querySelector('.data').textContent = data.message;
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.click('.fetch-btn');
    await expect(page.locator('.data')).toHaveText('Mocked data');
});

// Solution 4: Testing All States
test.describe('Input Component States', () => {
    test('default state', async ({ page }) => {
        await page.setContent('<input class="input" type="text">');
        await expect(page.locator('.input')).toBeEmpty();
    });
    
    test('filled state', async ({ page }) => {
        await page.setContent('<input class="input" type="text" value="Hello">');
        await expect(page.locator('.input')).toHaveValue('Hello');
    });
    
    test('disabled state', async ({ page }) => {
        await page.setContent('<input class="input" type="text" disabled>');
        await expect(page.locator('.input')).toBeDisabled();
    });
    
    test('error state', async ({ page }) => {
        await page.setContent(`
            <input class="input error" type="text">
            <span class="error-message">Invalid input</span>
        `);
        await expect(page.locator('.error-message')).toBeVisible();
    });
});

// Solution 5: Reusable Test Helpers
async function renderComponent(page: any, html: string) {
    await page.setContent(`
        <html>
            <body>
                <div id="test-root">${html}</div>
            </body>
        </html>
    `);
}

test('using test helpers', async ({ page }) => {
    await renderComponent(page, '<button class="btn">Test Button</button>');
    await expect(page.locator('.btn')).toBeVisible();
});

// Solution 6: Testing Props
test('testing component props', async ({ page }) => {
    const props = {
        label: 'Submit',
        variant: 'primary',
        disabled: false,
    };
    
    await page.setContent(`
        <button 
            class="btn btn-${props.variant}" 
            ${props.disabled ? 'disabled' : ''}
        >
            ${props.label}
        </button>
    `);
    
    await expect(page.locator('.btn')).toHaveText(props.label);
    await expect(page.locator('.btn')).toHaveClass(/btn-primary/);
    await expect(page.locator('.btn')).toBeEnabled();
});

// Solution 7: Testing Events
test('testing component events', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <button class="btn">Click</button>
                <script>
                    const events = [];
                    document.querySelector('.btn').addEventListener('click', () => {
                        events.push('click');
                        window.testEvents = events;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.click('.btn');
    
    const events = await page.evaluate(() => (window as any).testEvents);
    expect(events).toContain('click');
});

// Solution 8: Snapshot Testing
test('snapshot testing', async ({ page }) => {
    await page.setContent(`
        <div class="card">
            <h2>Card Title</h2>
            <p>Card content</p>
        </div>
    `);
    
    const card = page.locator('.card');
    await expect(card).toBeVisible();
    // await expect(card).toHaveScreenshot('card-snapshot.png');
});

// Solution 9: Performance Testing
test('component performance', async ({ page }) => {
    const start = Date.now();
    
    await page.setContent(`
        <div class="list">
            ${Array(100).fill('<div class="item">Item</div>').join('')}
        </div>
    `);
    
    const renderTime = Date.now() - start;
    console.log('Render time:', renderTime, 'ms');
    
    await expect(page.locator('.item')).toHaveCount(100);
});

// Solution 10: Component Testing Best Practices Summary
test('component testing best practices summary', async ({ page }) => {
    /*
     * Component Testing Best Practices:
     * 
     * Organization:
     * - Group related tests
     * - Use descriptive names
     * - Follow consistent patterns
     * 
     * Isolation:
     * - Test components in isolation
     * - Mock external dependencies
     * - Reset state between tests
     * 
     * Coverage:
     * - Test all component states
     * - Test props and events
     * - Test edge cases
     * 
     * Performance:
     * - Keep tests fast
     * - Use parallel execution
     * - Minimize setup/teardown
     * 
     * Maintenance:
     * - Use test helpers
     * - Keep tests DRY
     * - Update tests with code changes
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

