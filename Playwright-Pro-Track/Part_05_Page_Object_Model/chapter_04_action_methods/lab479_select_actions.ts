/**
 * Lab 479: Select Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing select actions in POM:
 * 
 * - Select by value
 * - Select by label
 * - Select by index
 * - Multi-select
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement select methods
 * 2. Handle different select types
 * 3. Work with multi-select
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Select Actions
class BasicSelectPage {
    readonly page: Page;
    readonly countrySelect: Locator;
    readonly categorySelect: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.countrySelect = page.locator('#country');
        this.categorySelect = page.locator('#category');
    }
    
    // Select by value
    async selectCountryByValue(value: string) {
        await this.countrySelect.selectOption(value);
    }
    
    // Select by label
    async selectCountryByLabel(label: string) {
        await this.countrySelect.selectOption({ label });
    }
    
    // Select by index
    async selectCountryByIndex(index: number) {
        await this.countrySelect.selectOption({ index });
    }
}

// Solution 2: Multi-Select Actions
class MultiSelectPage {
    readonly page: Page;
    readonly multiSelect: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.multiSelect = page.locator('#multi-select');
    }
    
    // Select multiple by values
    async selectMultipleByValues(values: string[]) {
        await this.multiSelect.selectOption(values);
    }
    
    // Select multiple by labels
    async selectMultipleByLabels(labels: string[]) {
        await this.multiSelect.selectOption(labels.map(label => ({ label })));
    }
    
    // Clear selection
    async clearSelection() {
        await this.multiSelect.selectOption([]);
    }
}

// Solution 3: Get Selected Options
class GetSelectedPage {
    readonly page: Page;
    readonly select: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.select = page.locator('select');
    }
    
    async getSelectedValue() {
        return await this.select.inputValue();
    }
    
    async getSelectedText() {
        return await this.select.locator('option:checked').textContent();
    }
    
    async getAllOptions() {
        return await this.select.locator('option').allTextContents();
    }
    
    async getOptionCount() {
        return await this.select.locator('option').count();
    }
}

// Solution 4: Dynamic Select
class DynamicSelectPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getSelect(name: string) {
        return this.page.locator(`select[name="${name}"]`);
    }
    
    async selectOption(selectName: string, value: string) {
        await this.getSelect(selectName).selectOption(value);
    }
    
    async selectByLabel(selectName: string, label: string) {
        await this.getSelect(selectName).selectOption({ label });
    }
}

// Solution 5: Cascading Selects
class CascadingSelectPage {
    readonly page: Page;
    readonly countrySelect: Locator;
    readonly stateSelect: Locator;
    readonly citySelect: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.countrySelect = page.locator('#country');
        this.stateSelect = page.locator('#state');
        this.citySelect = page.locator('#city');
    }
    
    async selectCountry(country: string) {
        await this.countrySelect.selectOption(country);
        // Wait for state options to load
        await this.stateSelect.waitFor({ state: 'visible' });
    }
    
    async selectState(state: string) {
        await this.stateSelect.selectOption(state);
        // Wait for city options to load
        await this.citySelect.waitFor({ state: 'visible' });
    }
    
    async selectCity(city: string) {
        await this.citySelect.selectOption(city);
    }
    
    async selectLocation(country: string, state: string, city: string) {
        await this.selectCountry(country);
        await this.selectState(state);
        await this.selectCity(city);
    }
}

// Solution 6: Custom Dropdown (Non-native)
class CustomDropdownPage {
    readonly page: Page;
    readonly dropdown: Locator;
    readonly dropdownOptions: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.dropdown = page.locator('.custom-dropdown');
        this.dropdownOptions = page.locator('.dropdown-options li');
    }
    
    async openDropdown() {
        await this.dropdown.click();
    }
    
    async selectOption(text: string) {
        await this.openDropdown();
        await this.dropdownOptions.filter({ hasText: text }).click();
    }
    
    async getSelectedOption() {
        return await this.dropdown.locator('.selected-value').textContent();
    }
}

// Solution 7: Export
export {
    BasicSelectPage,
    MultiSelectPage,
    GetSelectedPage,
    DynamicSelectPage,
    CascadingSelectPage,
    CustomDropdownPage,
};

