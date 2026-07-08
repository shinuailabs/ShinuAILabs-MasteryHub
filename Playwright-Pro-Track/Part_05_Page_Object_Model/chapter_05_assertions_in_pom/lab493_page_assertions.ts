/**
 * Lab 493: Page Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing page-level assertions:
 * 
 * - toHaveURL
 * - toHaveTitle
 * - Page state assertions
 * - Navigation assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert page URL
 * 2. Verify page title
 * 3. Check page state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, expect } from '@playwright/test';

// Solution 1: URL Assertions
class URLAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertURL(url: string) {
        await expect(this.page).toHaveURL(url);
    }
    
    async assertURLContains(text: string) {
        await expect(this.page).toHaveURL(new RegExp(text));
    }
    
    async assertURLPattern(pattern: RegExp) {
        await expect(this.page).toHaveURL(pattern);
    }
    
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }
    
    async assertOnLoginPage() {
        await expect(this.page).toHaveURL(/\/login/);
    }
}

// Solution 2: Title Assertions
class TitleAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }
    
    async assertTitleContains(text: string) {
        await expect(this.page).toHaveTitle(new RegExp(text));
    }
    
    async assertTitlePattern(pattern: RegExp) {
        await expect(this.page).toHaveTitle(pattern);
    }
}

// Solution 3: Page State Assertions
class PageStateAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertPageLoaded() {
        await this.page.waitForLoadState('load');
    }
    
    async assertDOMReady() {
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    async assertNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }
}

// Solution 4: Navigation Assertions
class NavigationAssertionsPage {
    readonly page: Page;
    readonly baseURL: string;
    
    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }
    
    async assertNavigatedTo(path: string) {
        await expect(this.page).toHaveURL(`${this.baseURL}${path}`);
    }
    
    async assertRedirectedTo(path: string) {
        await expect(this.page).toHaveURL(new RegExp(path));
    }
    
    async assertNotNavigated(originalURL: string) {
        await expect(this.page).toHaveURL(originalURL);
    }
}

// Solution 5: Combined Page Assertions
class CombinedPageAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertHomePage() {
        await expect(this.page).toHaveURL('/');
        await expect(this.page).toHaveTitle(/Home/);
    }
    
    async assertLoginPage() {
        await expect(this.page).toHaveURL(/\/login/);
        await expect(this.page).toHaveTitle(/Login/);
    }
    
    async assertDashboardPage() {
        await expect(this.page).toHaveURL(/\/dashboard/);
        await expect(this.page).toHaveTitle(/Dashboard/);
    }
}

// Solution 6: Error Page Assertions
class ErrorPageAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertNotFoundPage() {
        await expect(this.page).toHaveURL(/\/404/);
        await expect(this.page).toHaveTitle(/Not Found/);
    }
    
    async assertErrorPage() {
        await expect(this.page).toHaveURL(/\/error/);
    }
    
    async assertUnauthorizedPage() {
        await expect(this.page).toHaveURL(/\/unauthorized/);
    }
}

// Solution 7: Query Parameter Assertions
class QueryParamAssertionsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async assertHasQueryParam(param: string) {
        await expect(this.page).toHaveURL(new RegExp(`[?&]${param}=`));
    }
    
    async assertQueryParamValue(param: string, value: string) {
        await expect(this.page).toHaveURL(new RegExp(`[?&]${param}=${value}`));
    }
}

// Solution 8: Export
export {
    URLAssertionsPage,
    TitleAssertionsPage,
    PageStateAssertionsPage,
    NavigationAssertionsPage,
    CombinedPageAssertionsPage,
    ErrorPageAssertionsPage,
    QueryParamAssertionsPage,
};

