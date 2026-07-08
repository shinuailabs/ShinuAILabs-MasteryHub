/**
 * Lab 288: Custom Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom assertions:
 * 
 * - Custom matchers
 * - Reusable assertions
 * - Assertion helpers
 * - Extending expect
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom matchers
 * 2. Build reusable assertions
 * 3. Extend expect
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, Locator } from '@playwright/test';

// Solution 1: Custom Assertion Function
async function assertElementHasMinWidth(locator: Locator, minWidth: number) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(minWidth);
}

test('custom assertion function', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    await assertElementHasMinWidth(heading, 100);
});

// Solution 2: Reusable Assertion Helper
async function assertPageLoaded(page: any) {
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();
}

test('reusable assertion helper', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await assertPageLoaded(page);
});

// Solution 3: Assertion with Retry
async function assertWithRetry(
    assertion: () => Promise<void>,
    retries: number = 3
) {
    for (let i = 0; i < retries; i++) {
        try {
            await assertion();
            return;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

test('assertion with retry', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await assertWithRetry(async () => {
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 4: Composite Assertion
async function assertFormValid(page: any, formLocator: Locator) {
    // Check form is visible
    await expect(formLocator).toBeVisible();
    
    // Check required fields exist
    // await expect(formLocator.getByLabel('Email')).toBeVisible();
    // await expect(formLocator.getByLabel('Password')).toBeVisible();
    
    // Check submit button is enabled
    // await expect(formLocator.getByRole('button', { name: 'Submit' })).toBeEnabled();
}

test('composite assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Example usage
    // await assertFormValid(page, page.locator('form'));
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Assertion Factory
function createTextAssertion(expectedText: string) {
    return async (locator: Locator) => {
        await expect(locator).toContainText(expectedText);
    };
}

test('assertion factory', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const assertContainsPlaywright = createTextAssertion('Playwright');
    await assertContainsPlaywright(page.locator('h1'));
});

// Solution 6: Conditional Assertion
async function assertIfVisible(locator: Locator, assertion: () => Promise<void>) {
    if (await locator.isVisible()) {
        await assertion();
    }
}

test('conditional assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const modal = page.locator('.modal');
    await assertIfVisible(modal, async () => {
        await expect(modal).toHaveText(/Welcome/);
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Assertion with Custom Message
async function assertWithMessage(
    assertion: () => Promise<void>,
    message: string
) {
    try {
        await assertion();
    } catch (error) {
        throw new Error(`${message}: ${error}`);
    }
}

test('assertion with custom message', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await assertWithMessage(
        async () => await expect(page.locator('h1')).toBeVisible(),
        'Main heading should be visible on homepage'
    );
});

// Solution 8: Polling Custom Assertion
test('polling custom assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use expect.poll for custom polling
    await expect.poll(async () => {
        const count = await page.locator('a').count();
        return count;
    }, {
        message: 'Should have links',
        timeout: 5000,
    }).toBeGreaterThan(5);
});

// Solution 9: Soft Custom Assertion
async function softAssertVisible(locator: Locator) {
    await expect.soft(locator).toBeVisible();
}

test('soft custom assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await softAssertVisible(page.locator('h1'));
    await softAssertVisible(page.locator('nav'));
    await softAssertVisible(page.locator('footer'));
});

// Solution 10: Assertion Collection
class PageAssertions {
    constructor(private page: any) {}
    
    async assertLoaded() {
        await expect(this.page).toHaveTitle(/.+/);
    }
    
    async assertHasHeading() {
        await expect(this.page.locator('h1')).toBeVisible();
    }
    
    async assertHasNavigation() {
        await expect(this.page.getByRole('navigation')).toBeVisible();
    }
}

test('assertion collection', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const assertions = new PageAssertions(page);
    await assertions.assertLoaded();
    await assertions.assertHasHeading();
    await assertions.assertHasNavigation();
});

