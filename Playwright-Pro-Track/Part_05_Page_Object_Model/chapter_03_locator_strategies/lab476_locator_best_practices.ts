/**
 * Lab 476: Locator Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for locators:
 *
 * - Locator priority
 * - Maintainability
 * - Performance
 * - Reliability
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply locator best practices
 * 2. Choose appropriate locators
 * 3. Create maintainable selectors
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Locator Priority (Best to Worst)
class LocatorPriorityPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // 1. BEST: Role-based (accessible)
    get submitButtonByRole() {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    // 2. GOOD: Label-based (for forms)
    get emailInputByLabel() {
        return this.page.getByLabel('Email');
    }

    // 3. GOOD: Test ID (explicit for testing)
    get loginFormByTestId() {
        return this.page.getByTestId('login-form');
    }

    // 4. OK: Text-based
    get welcomeTextByText() {
        return this.page.getByText('Welcome');
    }

    // 5. AVOID: CSS (fragile)
    get buttonByCSS() {
        return this.page.locator('.btn-primary');
    }

    // 6. AVOID: XPath (complex, fragile)
    get buttonByXPath() {
        return this.page.locator('xpath=//button[@class="btn"]');
    }
}

// Solution 2: Maintainable Locators
class MaintainableLocatorsPage {
    readonly page: Page;

    // Use constants for selectors
    private static readonly SELECTORS = {
        SUBMIT_BUTTON: '[data-testid="submit-btn"]',
        EMAIL_INPUT: '[data-testid="email-input"]',
        ERROR_MESSAGE: '[data-testid="error-msg"]',
    };

    constructor(page: Page) {
        this.page = page;
    }

    get submitButton() {
        return this.page.locator(MaintainableLocatorsPage.SELECTORS.SUBMIT_BUTTON);
    }

    get emailInput() {
        return this.page.locator(MaintainableLocatorsPage.SELECTORS.EMAIL_INPUT);
    }

    get errorMessage() {
        return this.page.locator(MaintainableLocatorsPage.SELECTORS.ERROR_MESSAGE);
    }
}

// Solution 3: Avoid Fragile Locators
class AvoidFragileLocatorsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // BAD: Position-based (fragile)
    get badLocator1() {
        return this.page.locator('div:nth-child(3) > span:first-child');
    }

    // BAD: Style-based (fragile)
    get badLocator2() {
        return this.page.locator('[style*="color: red"]');
    }

    // GOOD: Semantic locator
    get goodLocator1() {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    // GOOD: Test ID locator
    get goodLocator2() {
        return this.page.getByTestId('submit-button');
    }
}

// Solution 4: Performance Considerations
class PerformanceLocatorsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // GOOD: Specific selector
    get specificLocator() {
        return this.page.locator('#unique-id');
    }

    // BAD: Overly broad selector
    get broadLocator() {
        return this.page.locator('div');
    }

    // GOOD: Scoped locator
    get scopedLocator() {
        return this.page.locator('#container').locator('button');
    }
}

// Solution 5: Reliable Locators
class ReliableLocatorsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Use unique identifiers
    get uniqueElement() {
        return this.page.locator('[data-testid="unique-element"]');
    }

    // Use semantic HTML
    get semanticElement() {
        return this.page.getByRole('navigation');
    }

    // Use aria labels
    get ariaElement() {
        return this.page.getByRole('button', { name: 'Close dialog' });
    }
}

// Solution 6: Best Practices Summary
/*
 * Locator Best Practices:
 *
 * DO:
 * - Use role-based locators
 * - Use data-testid attributes
 * - Use label-based locators for forms
 * - Keep selectors simple
 * - Use unique identifiers
 *
 * DON'T:
 * - Use position-based selectors
 * - Use style-based selectors
 * - Use overly complex XPath
 * - Use auto-generated IDs
 * - Use class names that change
 */

// Solution 7: Export
export {
    LocatorPriorityPage,
    MaintainableLocatorsPage,
    AvoidFragileLocatorsPage,
    PerformanceLocatorsPage,
    ReliableLocatorsPage,
};
