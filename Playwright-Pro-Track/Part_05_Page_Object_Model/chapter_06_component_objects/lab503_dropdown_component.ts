/**
 * Lab 503: Dropdown Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating dropdown components:
 * 
 * - Native select
 * - Custom dropdown
 * - Multi-select
 * - Searchable dropdown
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create dropdown component
 * 2. Handle selection
 * 3. Implement search
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Native Select Component
class NativeSelectComponent {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    async selectByValue(value: string) {
        await this.root.selectOption(value);
    }
    
    async selectByLabel(label: string) {
        await this.root.selectOption({ label });
    }
    
    async selectByIndex(index: number) {
        await this.root.selectOption({ index });
    }
    
    async getSelectedValue() {
        return await this.root.inputValue();
    }
    
    async getOptions() {
        return await this.root.locator('option').allTextContents();
    }
}

// Solution 2: Custom Dropdown Component
class CustomDropdownComponent {
    readonly root: Locator;
    readonly trigger: Locator;
    readonly menu: Locator;
    readonly options: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.trigger = root.locator('.dropdown-trigger');
        this.menu = root.locator('.dropdown-menu');
        this.options = root.locator('.dropdown-option');
    }
    
    async open() {
        await this.trigger.click();
        await this.menu.waitFor({ state: 'visible' });
    }
    
    async close() {
        await this.trigger.click();
        await this.menu.waitFor({ state: 'hidden' });
    }
    
    async select(optionText: string) {
        await this.open();
        await this.options.filter({ hasText: optionText }).click();
    }
    
    async getSelectedText() {
        return await this.trigger.textContent();
    }
    
    async isOpen() {
        return await this.menu.isVisible();
    }
}

// Solution 3: Searchable Dropdown Component
class SearchableDropdownComponent {
    readonly root: Locator;
    readonly searchInput: Locator;
    readonly options: Locator;
    readonly clearButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.searchInput = root.locator('.search-input');
        this.options = root.locator('.dropdown-option');
        this.clearButton = root.locator('.clear-btn');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
    }
    
    async selectFirstMatch() {
        await this.options.first().click();
    }
    
    async searchAndSelect(query: string) {
        await this.search(query);
        await this.selectFirstMatch();
    }
    
    async clear() {
        await this.clearButton.click();
    }
    
    async getVisibleOptions() {
        return await this.options.allTextContents();
    }
}

// Solution 4: Multi-Select Dropdown Component
class MultiSelectDropdownComponent {
    readonly root: Locator;
    readonly trigger: Locator;
    readonly options: Locator;
    readonly selectedTags: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.trigger = root.locator('.multi-select-trigger');
        this.options = root.locator('.multi-select-option');
        this.selectedTags = root.locator('.selected-tag');
    }
    
    async open() {
        await this.trigger.click();
    }
    
    async selectOption(text: string) {
        await this.options.filter({ hasText: text }).click();
    }
    
    async selectMultiple(texts: string[]) {
        await this.open();
        for (const text of texts) {
            await this.selectOption(text);
        }
    }
    
    async removeSelection(text: string) {
        await this.selectedTags.filter({ hasText: text }).locator('.remove').click();
    }
    
    async getSelectedValues() {
        return await this.selectedTags.allTextContents();
    }
    
    async clearAll() {
        const count = await this.selectedTags.count();
        for (let i = count - 1; i >= 0; i--) {
            await this.selectedTags.nth(i).locator('.remove').click();
        }
    }
}

// Solution 5: Cascading Dropdown Component
class CascadingDropdownComponent {
    readonly root: Locator;
    readonly primarySelect: Locator;
    readonly secondarySelect: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.primarySelect = root.locator('.primary-select');
        this.secondarySelect = root.locator('.secondary-select');
    }
    
    async selectPrimary(value: string) {
        await this.primarySelect.selectOption(value);
        await this.secondarySelect.waitFor({ state: 'visible' });
    }
    
    async selectSecondary(value: string) {
        await this.secondarySelect.selectOption(value);
    }
    
    async selectBoth(primary: string, secondary: string) {
        await this.selectPrimary(primary);
        await this.selectSecondary(secondary);
    }
}

// Solution 6: Export
export {
    NativeSelectComponent,
    CustomDropdownComponent,
    SearchableDropdownComponent,
    MultiSelectDropdownComponent,
    CascadingDropdownComponent,
};

