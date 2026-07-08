/**
 * Lab 491: Count Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing count assertions in POM:
 * 
 * - toHaveCount
 * - Counting elements
 * - Range assertions
 * - Dynamic counts
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert element counts
 * 2. Verify list lengths
 * 3. Check dynamic counts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic Count Assertions
class BasicCountPage {
    readonly page: Page;
    readonly items: Locator;
    readonly rows: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
        this.rows = page.locator('tr');
    }
    
    async assertItemCount(count: number) {
        await expect(this.items).toHaveCount(count);
    }
    
    async assertRowCount(count: number) {
        await expect(this.rows).toHaveCount(count);
    }
    
    async assertNoItems() {
        await expect(this.items).toHaveCount(0);
    }
}

// Solution 2: Range Count Assertions
class RangeCountPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertMinimumCount(min: number) {
        const count = await this.items.count();
        expect(count).toBeGreaterThanOrEqual(min);
    }
    
    async assertMaximumCount(max: number) {
        const count = await this.items.count();
        expect(count).toBeLessThanOrEqual(max);
    }
    
    async assertCountInRange(min: number, max: number) {
        const count = await this.items.count();
        expect(count).toBeGreaterThanOrEqual(min);
        expect(count).toBeLessThanOrEqual(max);
    }
}

// Solution 3: Dynamic Count Assertions
class DynamicCountPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertCountIncreased(previousCount: number) {
        const currentCount = await this.items.count();
        expect(currentCount).toBeGreaterThan(previousCount);
    }
    
    async assertCountDecreased(previousCount: number) {
        const currentCount = await this.items.count();
        expect(currentCount).toBeLessThan(previousCount);
    }
    
    async assertCountUnchanged(previousCount: number) {
        await expect(this.items).toHaveCount(previousCount);
    }
}

// Solution 4: Filtered Count Assertions
class FilteredCountPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertActiveItemCount(count: number) {
        await expect(this.items.filter({ has: this.page.locator('.active') })).toHaveCount(count);
    }
    
    async assertCompletedItemCount(count: number) {
        await expect(this.items.filter({ hasText: 'Completed' })).toHaveCount(count);
    }
    
    async assertVisibleItemCount(count: number) {
        await expect(this.items.filter({ hasNot: this.page.locator('.hidden') })).toHaveCount(count);
    }
}

// Solution 5: Table Count Assertions
class TableCountPage {
    readonly page: Page;
    readonly table: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table');
    }
    
    async assertRowCount(count: number) {
        await expect(this.table.locator('tbody tr')).toHaveCount(count);
    }
    
    async assertColumnCount(count: number) {
        await expect(this.table.locator('thead th')).toHaveCount(count);
    }
    
    async assertCellCount(count: number) {
        await expect(this.table.locator('td')).toHaveCount(count);
    }
}

// Solution 6: List Count Assertions
class ListCountPage {
    readonly page: Page;
    readonly list: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.list = page.locator('ul');
    }
    
    async assertListItemCount(count: number) {
        await expect(this.list.locator('li')).toHaveCount(count);
    }
    
    async assertListNotEmpty() {
        const count = await this.list.locator('li').count();
        expect(count).toBeGreaterThan(0);
    }
    
    async assertListEmpty() {
        await expect(this.list.locator('li')).toHaveCount(0);
    }
}

// Solution 7: Export
export {
    BasicCountPage,
    RangeCountPage,
    DynamicCountPage,
    FilteredCountPage,
    TableCountPage,
    ListCountPage,
};

