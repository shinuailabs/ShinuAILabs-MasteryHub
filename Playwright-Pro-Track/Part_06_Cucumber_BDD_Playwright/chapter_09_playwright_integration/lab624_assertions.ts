/**
 * Lab 624: Playwright Assertions in Cucumber
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Playwright assertions:
 * 
 * - Web-first assertions
 * - Auto-waiting
 * - Custom matchers
 * - Soft assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use web-first assertions
 * 2. Create custom matchers
 * 3. Handle soft assertions
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Then } from '@cucumber/cucumber';
import { expect, Locator } from '@playwright/test';

// Solution 1: Visibility Assertions
Then('the element {string} should be visible', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('the element {string} should be hidden', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
});

Then('the element {string} should not exist', async function (selector: string) {
    await expect(this.page.locator(selector)).toHaveCount(0);
});

// Solution 2: Text Assertions
Then('the element {string} should have text {string}', async function (selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text);
});

Then('the element {string} should contain text {string}', async function (selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
});

Then('the element {string} should be empty', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeEmpty();
});

// Solution 3: Input Assertions
Then('the input {string} should have value {string}', async function (selector: string, value: string) {
    await expect(this.page.locator(selector)).toHaveValue(value);
});

Then('the input {string} should be editable', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeEditable();
});

Then('the input {string} should be disabled', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeDisabled();
});

Then('the checkbox {string} should be checked', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeChecked();
});

// Solution 4: Attribute Assertions
Then('the element {string} should have attribute {string} with value {string}', async function (
    selector: string,
    attribute: string,
    value: string
) {
    await expect(this.page.locator(selector)).toHaveAttribute(attribute, value);
});

Then('the element {string} should have class {string}', async function (selector: string, className: string) {
    await expect(this.page.locator(selector)).toHaveClass(new RegExp(className));
});

Then('the element {string} should have id {string}', async function (selector: string, id: string) {
    await expect(this.page.locator(selector)).toHaveId(id);
});

// Solution 5: Count Assertions
Then('there should be {int} elements matching {string}', async function (count: number, selector: string) {
    await expect(this.page.locator(selector)).toHaveCount(count);
});

Then('there should be at least {int} elements matching {string}', async function (count: number, selector: string) {
    const actualCount = await this.page.locator(selector).count();
    expect(actualCount).toBeGreaterThanOrEqual(count);
});

// Solution 6: Page Assertions
Then('the page title should be {string}', async function (title: string) {
    await expect(this.page).toHaveTitle(title);
});

Then('the page URL should contain {string}', async function (urlPart: string) {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
});

Then('the page URL should be {string}', async function (url: string) {
    await expect(this.page).toHaveURL(url);
});

// Solution 7: Screenshot Assertions
Then('the element {string} should match screenshot {string}', async function (selector: string, name: string) {
    await expect(this.page.locator(selector)).toHaveScreenshot(`${name}.png`);
});

Then('the page should match screenshot {string}', async function (name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`);
});

// Solution 8: Soft Assertions
Then('I verify the following without failing immediately:', async function () {
    const errors: string[] = [];
    
    // Collect assertions without failing
    try {
        await expect(this.page.locator('.header')).toBeVisible();
    } catch (e) {
        errors.push('Header not visible');
    }
    
    try {
        await expect(this.page.locator('.footer')).toBeVisible();
    } catch (e) {
        errors.push('Footer not visible');
    }
    
    // Fail at the end if any errors
    if (errors.length > 0) {
        throw new Error(`Soft assertion failures:\n${errors.join('\n')}`);
    }
});

// Solution 9: Custom Assertion Helper
async function assertElementState(
    locator: Locator,
    state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'checked' | 'unchecked'
): Promise<void> {
    switch (state) {
        case 'visible':
            await expect(locator).toBeVisible();
            break;
        case 'hidden':
            await expect(locator).toBeHidden();
            break;
        case 'enabled':
            await expect(locator).toBeEnabled();
            break;
        case 'disabled':
            await expect(locator).toBeDisabled();
            break;
        case 'checked':
            await expect(locator).toBeChecked();
            break;
        case 'unchecked':
            await expect(locator).not.toBeChecked();
            break;
    }
}

Then('the element {string} should be {word}', async function (selector: string, state: string) {
    await assertElementState(this.page.locator(selector), state as any);
});

// Solution 10: Export
export { assertElementState };

