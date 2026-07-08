/**
 * Lab 472: Locator Filters
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using locator filters:
 * 
 * - hasText filter
 * - has filter
 * - hasNot filter
 * - Combined filters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply locator filters
 * 2. Combine multiple filters
 * 3. Use in page objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: hasText Filter
class HasTextFilterPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    // Filter by text content
    getItemWithText(text: string) {
        return this.items.filter({ hasText: text });
    }
    
    // Filter by regex
    getItemMatchingPattern(pattern: RegExp) {
        return this.items.filter({ hasText: pattern });
    }
    
    // Get row with specific text
    getTableRowWithText(text: string) {
        return this.page.locator('tr').filter({ hasText: text });
    }
}

// Solution 2: has Filter
class HasFilterPage {
    readonly page: Page;
    readonly cards: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cards = page.locator('.card');
    }
    
    // Filter by child element
    getCardsWithImage() {
        return this.cards.filter({ has: this.page.locator('img') });
    }
    
    // Filter by specific child
    getCardsWithBadge() {
        return this.cards.filter({ has: this.page.locator('.badge') });
    }
    
    // Filter by button
    getCardsWithActionButton() {
        return this.cards.filter({ has: this.page.locator('button.action') });
    }
}

// Solution 3: hasNot Filter
class HasNotFilterPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    // Filter by NOT having element
    getItemsWithoutBadge() {
        return this.items.filter({ hasNot: this.page.locator('.badge') });
    }
    
    // Get enabled buttons
    getEnabledButtons() {
        return this.page.locator('button').filter({ 
            hasNot: this.page.locator('[disabled]') 
        });
    }
    
    // Get items without error
    getItemsWithoutError() {
        return this.items.filter({ hasNot: this.page.locator('.error') });
    }
}

// Solution 4: Combined Filters
class CombinedFiltersPage {
    readonly page: Page;
    readonly products: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.products = page.locator('.product');
    }
    
    // Multiple filter conditions
    getAvailableProductsWithImage() {
        return this.products
            .filter({ has: this.page.locator('img') })
            .filter({ hasNot: this.page.locator('.out-of-stock') });
    }
    
    // Text and element filter
    getProductByNameWithPrice(name: string) {
        return this.products
            .filter({ hasText: name })
            .filter({ has: this.page.locator('.price') });
    }
}

// Solution 5: Filter with Locator Methods
class FilterMethodsPage {
    readonly page: Page;
    readonly rows: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.rows = page.locator('tr');
    }
    
    // Filter and get child
    getDeleteButtonForRow(text: string) {
        return this.rows
            .filter({ hasText: text })
            .locator('.delete-btn');
    }
    
    // Filter and get first
    getFirstRowWithStatus(status: string) {
        return this.rows
            .filter({ hasText: status })
            .first();
    }
    
    // Filter and count
    async countRowsWithStatus(status: string) {
        return await this.rows
            .filter({ hasText: status })
            .count();
    }
}

// Solution 6: Advanced Filter Patterns
class AdvancedFiltersPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Filter list items
    getListItemByContent(listSelector: string, content: string) {
        return this.page
            .locator(listSelector)
            .locator('li')
            .filter({ hasText: content });
    }
    
    // Filter form fields
    getRequiredFields() {
        return this.page
            .locator('input, select, textarea')
            .filter({ has: this.page.locator('[required]') });
    }
    
    // Filter visible elements
    getVisibleCards() {
        return this.page
            .locator('.card')
            .filter({ hasNot: this.page.locator('.hidden') });
    }
}

// Solution 7: Export
export {
    HasTextFilterPage,
    HasFilterPage,
    HasNotFilterPage,
    CombinedFiltersPage,
    FilterMethodsPage,
    AdvancedFiltersPage,
};

