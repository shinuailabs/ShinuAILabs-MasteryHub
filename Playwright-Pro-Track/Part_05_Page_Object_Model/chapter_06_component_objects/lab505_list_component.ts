/**
 * Lab 505: List Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating list components:
 * 
 * - Basic lists
 * - Ordered/unordered
 * - Interactive lists
 * - Virtual lists
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create list component
 * 2. Handle list items
 * 3. Implement filtering
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Basic List Component
class ListComponent {
    readonly root: Locator;
    readonly items: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.items = root.locator('li');
    }
    
    async getItemCount() {
        return await this.items.count();
    }
    
    async getItemTexts() {
        return await this.items.allTextContents();
    }
    
    async getItemByIndex(index: number) {
        return this.items.nth(index);
    }
    
    async getItemByText(text: string) {
        return this.items.filter({ hasText: text });
    }
    
    async clickItem(index: number) {
        await this.items.nth(index).click();
    }
}

// Solution 2: Interactive List Component
class InteractiveListComponent extends ListComponent {
    async selectItem(text: string) {
        await this.items.filter({ hasText: text }).click();
    }
    
    async getSelectedItem() {
        return this.items.filter({ has: root.page().locator('.selected') });
    }
    
    async isItemSelected(text: string) {
        const item = this.items.filter({ hasText: text });
        const classes = await item.getAttribute('class');
        return classes?.includes('selected') || false;
    }
    
    async deleteItem(text: string) {
        const item = this.items.filter({ hasText: text });
        await item.locator('.delete-btn').click();
    }
}

// Solution 3: Sortable List Component
class SortableListComponent extends ListComponent {
    async moveItem(fromIndex: number, toIndex: number) {
        const source = this.items.nth(fromIndex);
        const target = this.items.nth(toIndex);
        await source.dragTo(target);
    }
    
    async moveItemUp(index: number) {
        if (index > 0) {
            await this.moveItem(index, index - 1);
        }
    }
    
    async moveItemDown(index: number) {
        const count = await this.getItemCount();
        if (index < count - 1) {
            await this.moveItem(index, index + 1);
        }
    }
}

// Solution 4: Filterable List Component
class FilterableListComponent extends ListComponent {
    readonly filterInput: Locator;
    readonly clearFilter: Locator;
    
    constructor(root: Locator) {
        super(root);
        this.filterInput = root.locator('.filter-input');
        this.clearFilter = root.locator('.clear-filter');
    }
    
    async filter(query: string) {
        await this.filterInput.fill(query);
    }
    
    async clearFilterInput() {
        await this.clearFilter.click();
    }
    
    async getVisibleItems() {
        return this.items.filter({ hasNot: root.page().locator('.hidden') });
    }
    
    async getVisibleItemCount() {
        return await this.getVisibleItems().count();
    }
}

// Solution 5: Checkbox List Component
class CheckboxListComponent extends ListComponent {
    readonly checkboxes: Locator;
    
    constructor(root: Locator) {
        super(root);
        this.checkboxes = root.locator('input[type="checkbox"]');
    }
    
    async checkItem(index: number) {
        await this.checkboxes.nth(index).check();
    }
    
    async uncheckItem(index: number) {
        await this.checkboxes.nth(index).uncheck();
    }
    
    async checkAll() {
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).check();
        }
    }
    
    async uncheckAll() {
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).uncheck();
        }
    }
    
    async getCheckedCount() {
        let count = 0;
        const total = await this.checkboxes.count();
        for (let i = 0; i < total; i++) {
            if (await this.checkboxes.nth(i).isChecked()) {
                count++;
            }
        }
        return count;
    }
}

// Solution 6: Export
export {
    ListComponent,
    InteractiveListComponent,
    SortableListComponent,
    FilterableListComponent,
    CheckboxListComponent,
};

