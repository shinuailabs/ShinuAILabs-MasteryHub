/**
 * Lab 598: Scenario Outline Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common patterns for outlines:
 * 
 * - Validation patterns
 * - State machine testing
 * - Permission testing
 * - Calculation testing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement common patterns
 * 2. Handle state transitions
 * 3. Test calculations
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Validation Pattern
When('I enter a password of length {int}', async function (length: number) {
    const password = 'a'.repeat(length);
    this.password = password;
    await this.page.fill('#password', password);
    await this.page.click('#validate');
});

Then('the validation result should be {string}', async function (result: string) {
    const isValid = result === 'valid';
    const validationClass = isValid ? '.valid' : '.invalid';
    await expect(this.page.locator(validationClass)).toBeVisible();
});

Then('the message should be {string}', async function (message: string) {
    if (message !== 'OK') {
        await expect(this.page.locator('.validation-message')).toHaveText(message);
    }
});

// Solution 2: State Machine Pattern
interface StateMachine {
    currentState: string;
    transitions: Record<string, Record<string, string>>;
}

const orderStateMachine: StateMachine = {
    currentState: '',
    transitions: {
        pending: { confirm: 'confirmed', cancel: 'cancelled' },
        confirmed: { ship: 'shipped', cancel: 'cancelled' },
        shipped: { deliver: 'delivered', return: 'returned' },
        delivered: { return: 'returned', complete: 'completed' },
    },
};

Given('an order in {string} state', async function (state: string) {
    this.orderState = state;
});

When('I trigger {string} action', async function (action: string) {
    const transitions = orderStateMachine.transitions[this.orderState];
    if (transitions && transitions[action]) {
        this.orderState = transitions[action];
        this.transitionSuccess = true;
    } else {
        this.transitionSuccess = false;
    }
});

Then('the order should transition to {string}', async function (expectedState: string) {
    expect(this.orderState).toBe(expectedState);
});

Then('the transition should {word}', async function (result: string) {
    const shouldSucceed = result === 'succeed';
    expect(this.transitionSuccess).toBe(shouldSucceed);
});

// Solution 3: Permission Matrix Pattern
interface PermissionMatrix {
    [role: string]: {
        [permission: string]: boolean;
    };
}

const permissions: PermissionMatrix = {
    admin: { read: true, write: true, delete: true, admin: true },
    editor: { read: true, write: true, delete: false, admin: false },
    viewer: { read: true, write: false, delete: false, admin: false },
    guest: { read: false, write: false, delete: false, admin: false },
};

Given('I am authenticated as {string} role', async function (role: string) {
    this.currentRole = role;
    this.permissions = permissions[role] || {};
});

When('I attempt to {word} a resource', async function (action: string) {
    this.attemptedAction = action;
    this.actionAllowed = this.permissions[action] || false;
});

Then('the action should be {word}', async function (result: string) {
    const shouldBeAllowed = result === 'allowed';
    expect(this.actionAllowed).toBe(shouldBeAllowed);
});

// Solution 4: Calculation Pattern
interface PricingRule {
    basePrice: number;
    discount: number;
    tax: number;
}

Given('a product priced at ${float}', async function (price: number) {
    this.basePrice = price;
});

When('I apply {int}% discount and {int}% tax', async function (
    discount: number,
    tax: number
) {
    const discountedPrice = this.basePrice * (1 - discount / 100);
    this.finalPrice = discountedPrice * (1 + tax / 100);
});

Then('the final price should be ${float}', async function (expected: number) {
    expect(this.finalPrice).toBeCloseTo(expected, 2);
});

// Solution 5: Boundary Testing Pattern
When('I input value {int} for {string} field', async function (
    value: number,
    field: string
) {
    this.inputValue = value;
    this.inputField = field;
    
    await this.page.fill(`#${field}`, String(value));
    await this.page.click('#submit');
});

Then('the field should show {string} state', async function (state: string) {
    const stateClass = `.field-${state}`;
    await expect(this.page.locator(`#${this.inputField}`).locator(stateClass)).toBeVisible();
});

// Solution 6: Cross-Browser Pattern
Given('I am using {string} browser', async function (browser: string) {
    this.browserName = browser;
    // Browser is already set up in hooks based on configuration
});

When('I load the homepage', async function () {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
});

Then('the layout should be {string}', async function (layout: string) {
    const viewport = this.page.viewportSize();
    
    let expectedLayout: string;
    if (viewport && viewport.width >= 1024) {
        expectedLayout = 'desktop';
    } else if (viewport && viewport.width >= 768) {
        expectedLayout = 'tablet';
    } else {
        expectedLayout = 'mobile';
    }
    
    expect(expectedLayout).toBe(layout);
});

Then('all elements should be visible', async function () {
    const criticalElements = ['header', 'nav', 'main', 'footer'];
    
    for (const element of criticalElements) {
        await expect(this.page.locator(element)).toBeVisible();
    }
});

// Solution 7: Export
export {};

