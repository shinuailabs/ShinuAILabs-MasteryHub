/**
 * Lab 469: Playwright Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Playwright-specific locators:
 * 
 * - getByRole
 * - getByText
 * - getByLabel
 * - getByTestId
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use Playwright locators
 * 2. Understand locator priority
 * 3. Apply in page objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: getByRole Locators
class RoleLocatorsPage {
    readonly page: Page;
    
    // Buttons
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    // Links
    readonly homeLink: Locator;
    // Headings
    readonly mainHeading: Locator;
    // Textboxes
    readonly searchInput: Locator;
    // Checkboxes
    readonly agreeCheckbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.mainHeading = page.getByRole('heading', { name: 'Welcome' });
        this.searchInput = page.getByRole('textbox', { name: 'Search' });
        this.agreeCheckbox = page.getByRole('checkbox', { name: 'I agree' });
    }
}

// Solution 2: getByText Locators
class TextLocatorsPage {
    readonly page: Page;
    
    // Exact text
    readonly exactText: Locator;
    // Partial text
    readonly partialText: Locator;
    // Case insensitive
    readonly caseInsensitive: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.exactText = page.getByText('Welcome', { exact: true });
        this.partialText = page.getByText('Welcome');
        this.caseInsensitive = page.getByText('welcome', { exact: false });
    }
}

// Solution 3: getByLabel Locators
class LabelLocatorsPage {
    readonly page: Page;
    
    // Form inputs by label
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByLabel('Username');
        this.passwordInput = page.getByLabel('Password');
        this.emailInput = page.getByLabel('Email');
        this.phoneInput = page.getByLabel('Phone Number');
    }
}

// Solution 4: getByTestId Locators
class TestIdLocatorsPage {
    readonly page: Page;
    
    // Elements with data-testid
    readonly loginForm: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly userAvatar: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginForm = page.getByTestId('login-form');
        this.submitButton = page.getByTestId('submit-btn');
        this.errorMessage = page.getByTestId('error-msg');
        this.userAvatar = page.getByTestId('user-avatar');
    }
}

// Solution 5: getByPlaceholder Locators
class PlaceholderLocatorsPage {
    readonly page: Page;
    
    readonly searchInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder('Search...');
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Enter password');
    }
}

// Solution 6: getByAltText Locators
class AltTextLocatorsPage {
    readonly page: Page;
    
    readonly logo: Locator;
    readonly userPhoto: Locator;
    readonly productImage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByAltText('Company Logo');
        this.userPhoto = page.getByAltText('User Profile Photo');
        this.productImage = page.getByAltText('Product Image');
    }
}

// Solution 7: getByTitle Locators
class TitleLocatorsPage {
    readonly page: Page;
    
    readonly helpIcon: Locator;
    readonly closeButton: Locator;
    readonly infoTooltip: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.helpIcon = page.getByTitle('Help');
        this.closeButton = page.getByTitle('Close');
        this.infoTooltip = page.getByTitle('More information');
    }
}

// Solution 8: Combined Locators
class CombinedLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Chained locators
    get formSubmitButton() {
        return this.page.getByTestId('login-form').getByRole('button', { name: 'Submit' });
    }
    
    // Filter locators
    get enabledButtons() {
        return this.page.getByRole('button').filter({ hasNot: this.page.locator('[disabled]') });
    }
    
    // Locator with text filter
    getItemWithText(text: string) {
        return this.page.getByRole('listitem').filter({ hasText: text });
    }
}

// Solution 9: Locator Priority
/*
 * Recommended Priority:
 * 
 * 1. getByRole - Most accessible
 * 2. getByLabel - For form fields
 * 3. getByPlaceholder - For inputs
 * 4. getByText - For visible text
 * 5. getByTestId - For testing
 * 6. CSS/XPath - Last resort
 */

// Solution 10: Export
export {
    RoleLocatorsPage,
    TextLocatorsPage,
    LabelLocatorsPage,
    TestIdLocatorsPage,
    PlaceholderLocatorsPage,
    AltTextLocatorsPage,
    TitleLocatorsPage,
    CombinedLocatorsPage,
};

