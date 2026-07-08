/**
 * Lab 447: What is Page Object Model
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding Page Object Model (POM):
 * 
 * - Design pattern for test automation
 * - Separates page structure from tests
 * - Improves maintainability
 * - Reduces code duplication
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand POM concept
 * 2. Learn benefits of POM
 * 3. See basic POM structure
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Page Object
class HomePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly getStartedButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.getStartedButton = page.locator('text=Get Started');
    }
    
    async navigate() {
        await this.page.goto('https://playwright.dev');
    }
    
    async getHeadingText() {
        return await this.heading.textContent();
    }
}

// Solution 2: Without POM (Bad Practice)
async function testWithoutPOM(page: Page) {
    // Locators scattered in test
    await page.goto('https://playwright.dev');
    await page.locator('h1').textContent();
    await page.locator('text=Get Started').click();
    // If locator changes, need to update everywhere
}

// Solution 3: With POM (Good Practice)
async function testWithPOM(page: Page) {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.getHeadingText();
    // If locator changes, update only in HomePage class
}

// Solution 4: POM Benefits
/*
 * Benefits of Page Object Model:
 * 
 * 1. Maintainability
 *    - Locators in one place
 *    - Easy to update when UI changes
 * 
 * 2. Reusability
 *    - Page objects used across tests
 *    - Common actions defined once
 * 
 * 3. Readability
 *    - Tests read like user actions
 *    - Clear intent
 * 
 * 4. Separation of Concerns
 *    - Page structure separate from test logic
 *    - Clean architecture
 */

// Solution 5: Page Object Structure
class ExamplePage {
    // Page reference
    readonly page: Page;
    
    // Locators (elements on the page)
    readonly searchInput: Locator;
    readonly submitButton: Locator;
    readonly resultsList: Locator;
    
    // Constructor initializes locators
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search');
        this.submitButton = page.locator('button[type="submit"]');
        this.resultsList = page.locator('.results');
    }
    
    // Navigation method
    async navigate() {
        await this.page.goto('https://example.com');
    }
    
    // Action methods
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.submitButton.click();
    }
    
    // Getter methods
    async getResultsCount() {
        return await this.resultsList.locator('li').count();
    }
}

// Solution 6: POM vs Traditional Approach
/*
 * Traditional Approach:
 * - Locators in test files
 * - Duplicate code
 * - Hard to maintain
 * 
 * POM Approach:
 * - Locators in page classes
 * - Reusable methods
 * - Easy to maintain
 */

// Solution 7: When to Use POM
/*
 * Use POM when:
 * - Multiple tests interact with same page
 * - UI is likely to change
 * - Team collaboration is needed
 * - Long-term maintenance is expected
 * 
 * May skip POM when:
 * - Simple one-off tests
 * - Proof of concept
 * - Very small test suite
 */

// Solution 8: POM Components
/*
 * Page Object Components:
 * 
 * 1. Page Class
 *    - Represents a web page
 *    - Contains locators and methods
 * 
 * 2. Locators
 *    - Element selectors
 *    - Defined as class properties
 * 
 * 3. Methods
 *    - Actions (click, fill, etc.)
 *    - Getters (get text, count, etc.)
 *    - Navigation
 */

// Solution 9: Simple Example Usage
async function exampleUsage(page: Page) {
    const homePage = new HomePage(page);
    
    // Navigate
    await homePage.navigate();
    
    // Get data
    const heading = await homePage.getHeadingText();
    console.log('Heading:', heading);
}

// Solution 10: Export for use in tests
export { HomePage, ExamplePage };

