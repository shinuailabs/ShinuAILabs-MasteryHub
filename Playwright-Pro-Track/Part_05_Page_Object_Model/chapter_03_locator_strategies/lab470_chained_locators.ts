/**
 * Lab 470: Chained Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Chaining locators for precision:
 * 
 * - Parent-child chains
 * - Filter chains
 * - Locator composition
 * - Scoped locators
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Chain locators
 * 2. Use filters
 * 3. Scope locators
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Chaining
class BasicChainingPage {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
    }
    
    // Chain from form
    get usernameInput() {
        return this.form.locator('#username');
    }
    
    get passwordInput() {
        return this.form.locator('#password');
    }
    
    get submitButton() {
        return this.form.locator('button[type="submit"]');
    }
}

// Solution 2: Multiple Level Chaining
class MultiLevelChainingPage {
    readonly page: Page;
    readonly container: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('.main-container');
    }
    
    get header() {
        return this.container.locator('header');
    }
    
    get headerLogo() {
        return this.header.locator('.logo');
    }
    
    get headerNav() {
        return this.header.locator('nav');
    }
    
    get headerNavLinks() {
        return this.headerNav.locator('a');
    }
}

// Solution 3: Filter Chaining
class FilterChainingPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    // Filter by text
    getItemWithText(text: string) {
        return this.items.filter({ hasText: text });
    }
    
    // Filter by child element
    getItemWithButton() {
        return this.items.filter({ has: this.page.locator('button') });
    }
    
    // Filter by NOT having element
    getItemWithoutBadge() {
        return this.items.filter({ hasNot: this.page.locator('.badge') });
    }
}

// Solution 4: Scoped Locators
class ScopedLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Get scoped locator for a section
    getSection(sectionId: string) {
        return this.page.locator(`#${sectionId}`);
    }
    
    // Get element within section
    getButtonInSection(sectionId: string, buttonText: string) {
        return this.getSection(sectionId).getByRole('button', { name: buttonText });
    }
    
    // Get input within section
    getInputInSection(sectionId: string, label: string) {
        return this.getSection(sectionId).getByLabel(label);
    }
}

// Solution 5: Table Row Chaining
class TableChainingPage {
    readonly page: Page;
    readonly table: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table');
    }
    
    get rows() {
        return this.table.locator('tbody tr');
    }
    
    getRowByIndex(index: number) {
        return this.rows.nth(index);
    }
    
    getCellInRow(rowIndex: number, cellIndex: number) {
        return this.getRowByIndex(rowIndex).locator('td').nth(cellIndex);
    }
    
    getRowWithText(text: string) {
        return this.rows.filter({ hasText: text });
    }
    
    getActionButtonInRow(text: string) {
        return this.getRowWithText(text).locator('button.action');
    }
}

// Solution 6: List Item Chaining
class ListChainingPage {
    readonly page: Page;
    readonly list: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.list = page.locator('ul.items');
    }
    
    get items() {
        return this.list.locator('li');
    }
    
    getItemByName(name: string) {
        return this.items.filter({ hasText: name });
    }
    
    getDeleteButtonForItem(name: string) {
        return this.getItemByName(name).locator('.delete-btn');
    }
    
    getEditButtonForItem(name: string) {
        return this.getItemByName(name).locator('.edit-btn');
    }
}

// Solution 7: Card Component Chaining
class CardChainingPage {
    readonly page: Page;
    readonly cards: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cards = page.locator('.card');
    }
    
    getCardByTitle(title: string) {
        return this.cards.filter({ has: this.page.locator(`.card-title:has-text("${title}")`) });
    }
    
    getCardContent(title: string) {
        return this.getCardByTitle(title).locator('.card-content');
    }
    
    getCardActions(title: string) {
        return this.getCardByTitle(title).locator('.card-actions button');
    }
}

// Solution 8: Export
export {
    BasicChainingPage,
    MultiLevelChainingPage,
    FilterChainingPage,
    ScopedLocatorsPage,
    TableChainingPage,
    ListChainingPage,
    CardChainingPage,
};

