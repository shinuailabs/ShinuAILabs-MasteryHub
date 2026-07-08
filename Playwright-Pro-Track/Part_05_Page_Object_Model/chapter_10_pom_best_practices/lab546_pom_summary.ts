/**
 * Lab 546: POM Summary
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Complete POM summary:
 * 
 * - Key concepts
 * - Best practices
 * - Patterns
 * - Checklist
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Review all concepts
 * 2. Apply checklist
 * 3. Create your POM
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Complete Page Object Example
class CompletePage {
    // Locators
    readonly header: Locator;
    readonly mainContent: Locator;
    readonly footer: Locator;
    
    constructor(readonly page: Page) {
        this.header = page.locator('header');
        this.mainContent = page.locator('main');
        this.footer = page.locator('footer');
    }
    
    // Navigation
    async goto() {
        await this.page.goto('/');
        await this.waitForLoad();
    }
    
    // Wait methods
    async waitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    // Action methods
    async clickElement(selector: string) {
        await this.page.click(selector);
    }
    
    // Query methods
    async getText(selector: string): Promise<string | null> {
        return await this.page.locator(selector).textContent();
    }
    
    // State methods
    async isLoaded(): Promise<boolean> {
        return await this.mainContent.isVisible();
    }
}

// Solution 2: Complete Component Example
class CompleteComponent {
    constructor(readonly root: Locator) {}
    
    // Encapsulated locators
    private get title() {
        return this.root.locator('.title');
    }
    
    private get content() {
        return this.root.locator('.content');
    }
    
    // Public methods
    async getTitle(): Promise<string | null> {
        return await this.title.textContent();
    }
    
    async getContent(): Promise<string | null> {
        return await this.content.textContent();
    }
    
    async isVisible(): Promise<boolean> {
        return await this.root.isVisible();
    }
}

// Solution 3: POM Checklist
/*
 * ✓ STRUCTURE
 *   - Separate pages and components
 *   - Use meaningful names
 *   - Organize by feature
 *   - Create index exports
 * 
 * ✓ LOCATORS
 *   - Use data-testid when possible
 *   - Avoid complex XPath
 *   - Keep selectors in one place
 *   - Use role-based selectors
 * 
 * ✓ METHODS
 *   - Single responsibility
 *   - Descriptive names
 *   - Return useful data
 *   - Handle async properly
 * 
 * ✓ ASSERTIONS
 *   - Keep in tests, not pages
 *   - Use built-in expect
 *   - Create assertion helpers
 * 
 * ✓ DATA
 *   - Parameterize methods
 *   - Use data builders
 *   - Separate test data
 * 
 * ✓ MAINTENANCE
 *   - DRY principle
 *   - Document complex logic
 *   - Use TypeScript
 *   - Write tests for pages
 */

// Solution 4: Quick Reference
const POM_PATTERNS = {
    // Page naming
    pageName: 'FeaturePage', // e.g., LoginPage, CheckoutPage
    
    // Component naming
    componentName: 'ElementComponent', // e.g., HeaderComponent, ModalComponent
    
    // Method prefixes
    actions: ['click', 'fill', 'select', 'submit', 'navigate'],
    queries: ['get', 'is', 'has', 'find'],
    waits: ['waitFor', 'waitUntil'],
    
    // File naming
    files: {
        page: 'feature.page.ts',
        component: 'element.component.ts',
        fixture: 'feature.fixture.ts',
        spec: 'feature.spec.ts',
    },
};

// Solution 5: Template Page
abstract class TemplatePage {
    abstract readonly url: string;
    
    constructor(readonly page: Page) {}
    
    async goto() {
        await this.page.goto(this.url);
        await this.waitForLoad();
    }
    
    async waitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async getTitle(): Promise<string> {
        return await this.page.title();
    }
    
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }
}

// Solution 6: Final Summary
/*
 * PAGE OBJECT MODEL SUMMARY
 * 
 * What: Design pattern for UI test automation
 * Why: Maintainability, reusability, readability
 * 
 * Key Principles:
 * 1. Encapsulate page structure
 * 2. Expose page behavior
 * 3. Hide implementation details
 * 4. Single responsibility
 * 5. Composition over inheritance
 * 
 * Benefits:
 * - Reduced code duplication
 * - Easier maintenance
 * - Better test readability
 * - Faster test development
 * - Improved collaboration
 * 
 * Remember:
 * - Pages represent pages
 * - Components represent reusable elements
 * - Fixtures provide test setup
 * - Tests contain assertions
 */

// Solution 7: Export
export {
    CompletePage,
    CompleteComponent,
    TemplatePage,
    POM_PATTERNS,
};

