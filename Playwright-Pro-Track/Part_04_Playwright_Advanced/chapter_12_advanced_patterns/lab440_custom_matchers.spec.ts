/**
 * Lab 440: Custom Matchers
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom matchers:
 * 
 * - Extending expect
 * - Custom assertions
 * - Reusable matchers
 * - Error messages
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom matchers
 * 2. Use custom assertions
 * 3. Handle error messages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Custom Matcher
expect.extend({
    toBeWithinRange(received: number, floor: number, ceiling: number) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
});

test('using custom range matcher', async () => {
    const value = 50;
    expect(value).toBeWithinRange(1, 100);
});

// Solution 2: Custom String Matcher
expect.extend({
    toContainWord(received: string, word: string) {
        const words = received.toLowerCase().split(/\s+/);
        const pass = words.includes(word.toLowerCase());
        return {
            message: () => pass
                ? `expected "${received}" not to contain word "${word}"`
                : `expected "${received}" to contain word "${word}"`,
            pass,
        };
    },
});

test('using custom string matcher', async () => {
    const text = 'Hello World from Playwright';
    expect(text).toContainWord('World');
});

// Solution 3: Custom Array Matcher
expect.extend({
    toContainObject(received: any[], expected: object) {
        const pass = received.some(item =>
            Object.entries(expected).every(([key, value]) => item[key] === value)
        );
        return {
            message: () => pass
                ? `expected array not to contain object ${JSON.stringify(expected)}`
                : `expected array to contain object ${JSON.stringify(expected)}`,
            pass,
        };
    },
});

test('using custom array matcher', async () => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ];
    expect(users).toContainObject({ name: 'Alice' });
});

// Solution 4: Custom Date Matcher
expect.extend({
    toBeAfterDate(received: Date, expected: Date) {
        const pass = received.getTime() > expected.getTime();
        return {
            message: () => pass
                ? `expected ${received} not to be after ${expected}`
                : `expected ${received} to be after ${expected}`,
            pass,
        };
    },
});

test('using custom date matcher', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    expect(now).toBeAfterDate(yesterday);
});

// Solution 5: Custom Async Matcher
expect.extend({
    async toEventuallyEqual(received: () => Promise<any>, expected: any) {
        const actual = await received();
        const pass = actual === expected;
        return {
            message: () => pass
                ? `expected ${actual} not to eventually equal ${expected}`
                : `expected ${actual} to eventually equal ${expected}`,
            pass,
        };
    },
});

test('using custom async matcher', async () => {
    const getValue = async () => 42;
    await expect(getValue).toEventuallyEqual(42);
});

// Solution 6: Custom Page Matcher
expect.extend({
    async toHaveMetaTag(page: any, name: string, content: string) {
        const metaContent = await page.evaluate((n: string) => {
            const meta = document.querySelector(`meta[name="${n}"]`);
            return meta?.getAttribute('content');
        }, name);
        
        const pass = metaContent === content;
        return {
            message: () => pass
                ? `expected page not to have meta tag ${name}="${content}"`
                : `expected page to have meta tag ${name}="${content}", got "${metaContent}"`,
            pass,
        };
    },
});

test('using custom page matcher', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <meta name="description" content="Test page">
            </head>
            <body></body>
        </html>
    `);
    
    await expect(page).toHaveMetaTag('description', 'Test page');
});

// Solution 7: Custom Locator Matcher
expect.extend({
    async toHaveDataAttribute(locator: any, attribute: string, value: string) {
        const actual = await locator.getAttribute(`data-${attribute}`);
        const pass = actual === value;
        return {
            message: () => pass
                ? `expected element not to have data-${attribute}="${value}"`
                : `expected element to have data-${attribute}="${value}", got "${actual}"`,
            pass,
        };
    },
});

test('using custom locator matcher', async ({ page }) => {
    await page.setContent('<div data-testid="test-element" data-status="active">Test</div>');
    
    const element = page.locator('[data-testid="test-element"]');
    await expect(element).toHaveDataAttribute('status', 'active');
});

// Solution 8: Custom Validation Matcher
expect.extend({
    toBeValidEmail(received: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pass = emailRegex.test(received);
        return {
            message: () => pass
                ? `expected "${received}" not to be a valid email`
                : `expected "${received}" to be a valid email`,
            pass,
        };
    },
});

test('using custom validation matcher', async () => {
    expect('test@example.com').toBeValidEmail();
});

// Solution 9: Custom Negation Matcher
test('using negation with custom matcher', async () => {
    const value = 150;
    expect(value).not.toBeWithinRange(1, 100);
});

// Solution 10: Custom Matchers Best Practices
test('custom matchers best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Create clear error messages
     * 2. Support negation (.not)
     * 3. Keep matchers focused
     * 4. Document matcher usage
     * 5. Test matchers thoroughly
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

