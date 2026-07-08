/**
 * Lab 537: Naming Conventions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Naming conventions in POM:
 * 
 * - Class naming
 * - Method naming
 * - Property naming
 * - File naming
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply naming conventions
 * 2. Use consistent patterns
 * 3. Create readable names
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Class Naming
// GOOD: PascalCase, descriptive, suffix with Page/Component
class LoginPage {
    constructor(readonly page: Page) {}
}

class UserProfilePage {
    constructor(readonly page: Page) {}
}

class HeaderComponent {
    constructor(readonly root: Locator) {}
}

class NavigationMenuComponent {
    constructor(readonly root: Locator) {}
}

// BAD Examples (commented out):
// class login { }  // lowercase
// class LoginPg { }  // abbreviated
// class Login { }  // no suffix

// Solution 2: Method Naming
class ExamplePage {
    constructor(readonly page: Page) {}
    
    // GOOD: Action methods - verb + noun
    async clickLoginButton() {
        await this.page.click('#login');
    }
    
    async fillUsername(value: string) {
        await this.page.fill('#username', value);
    }
    
    async selectCountry(country: string) {
        await this.page.selectOption('#country', country);
    }
    
    async submitForm() {
        await this.page.click('button[type="submit"]');
    }
    
    // GOOD: Query methods - get/is/has prefix
    async getErrorMessage() {
        return await this.page.locator('.error').textContent();
    }
    
    async isLoggedIn() {
        return await this.page.locator('.user-menu').isVisible();
    }
    
    async hasValidationError() {
        return await this.page.locator('.validation-error').count() > 0;
    }
    
    // GOOD: Navigation methods - goTo/navigateTo prefix
    async goToProfile() {
        await this.page.click('#profile-link');
    }
    
    async navigateToSettings() {
        await this.page.goto('/settings');
    }
    
    // GOOD: Wait methods - waitFor prefix
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForResults() {
        await this.page.locator('.results').waitFor();
    }
}

// Solution 3: Property Naming
class PropertyNamingExample {
    // GOOD: camelCase for properties
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    
    // GOOD: Descriptive names
    readonly loginForm: Locator;
    readonly navigationMenu: Locator;
    readonly searchResultsList: Locator;
    
    constructor(page: Page) {
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.error-message');
        this.loginForm = page.locator('#login-form');
        this.navigationMenu = page.locator('nav');
        this.searchResultsList = page.locator('.search-results');
    }
}

// Solution 4: File Naming
/*
 * GOOD File Names:
 * - login.page.ts
 * - user-profile.page.ts
 * - header.component.ts
 * - navigation-menu.component.ts
 * - auth.fixture.ts
 * - test-data.helper.ts
 * 
 * BAD File Names:
 * - Login.ts (PascalCase)
 * - loginPage.ts (camelCase)
 * - login_page.ts (snake_case)
 */

// Solution 5: Constant Naming
const SELECTORS = {
    LOGIN_BUTTON: '#login-btn',
    USERNAME_INPUT: '#username',
    PASSWORD_INPUT: '#password',
};

const TIMEOUTS = {
    DEFAULT: 30000,
    LONG: 60000,
    SHORT: 5000,
};

const URLS = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
};

// Solution 6: Naming Convention Summary
/*
 * Naming Conventions:
 * 
 * Classes: PascalCase + Suffix (LoginPage, HeaderComponent)
 * Methods: camelCase + Verb (clickButton, getTitle, isVisible)
 * Properties: camelCase (usernameInput, submitButton)
 * Files: kebab-case + suffix (login.page.ts, header.component.ts)
 * Constants: UPPER_SNAKE_CASE (DEFAULT_TIMEOUT, LOGIN_URL)
 * Interfaces: PascalCase + I prefix optional (IUser or User)
 */

// Solution 7: Export
export {
    LoginPage,
    UserProfilePage,
    HeaderComponent,
    NavigationMenuComponent,
    ExamplePage,
    PropertyNamingExample,
    SELECTORS,
    TIMEOUTS,
    URLS,
};

