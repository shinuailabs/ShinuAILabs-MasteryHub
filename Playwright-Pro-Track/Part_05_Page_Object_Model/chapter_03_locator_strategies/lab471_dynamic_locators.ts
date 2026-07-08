/**
 * Lab 471: Dynamic Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating dynamic locators:
 * 
 * - Parameterized locators
 * - Runtime locator generation
 * - Template locators
 * - Flexible selectors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create dynamic locators
 * 2. Use parameters
 * 3. Generate locators at runtime
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Parameterized Locators
class ParameterizedLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // By ID parameter
    getElementById(id: string) {
        return this.page.locator(`#${id}`);
    }
    
    // By class parameter
    getElementByClass(className: string) {
        return this.page.locator(`.${className}`);
    }
    
    // By data attribute
    getElementByTestId(testId: string) {
        return this.page.getByTestId(testId);
    }
    
    // By name attribute
    getInputByName(name: string) {
        return this.page.locator(`input[name="${name}"]`);
    }
}

// Solution 2: Index-based Locators
class IndexLocatorsPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    // Get by index
    getItemByIndex(index: number) {
        return this.items.nth(index);
    }
    
    // Get first
    getFirstItem() {
        return this.items.first();
    }
    
    // Get last
    getLastItem() {
        return this.items.last();
    }
    
    // Get range
    async getItemsInRange(start: number, end: number) {
        const items: Locator[] = [];
        for (let i = start; i <= end; i++) {
            items.push(this.items.nth(i));
        }
        return items;
    }
}

// Solution 3: Text-based Dynamic Locators
class TextDynamicLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Get by exact text
    getByExactText(text: string) {
        return this.page.getByText(text, { exact: true });
    }
    
    // Get by partial text
    getByPartialText(text: string) {
        return this.page.getByText(text);
    }
    
    // Get button by text
    getButtonByText(text: string) {
        return this.page.getByRole('button', { name: text });
    }
    
    // Get link by text
    getLinkByText(text: string) {
        return this.page.getByRole('link', { name: text });
    }
}

// Solution 4: Template Locators
class TemplateLocatorsPage {
    readonly page: Page;
    
    // Locator templates
    private readonly templates = {
        menuItem: (name: string) => `nav a[data-menu="${name}"]`,
        formField: (field: string) => `form [name="${field}"]`,
        tableRow: (id: string) => `tr[data-row-id="${id}"]`,
        tabPanel: (tab: string) => `[role="tabpanel"][data-tab="${tab}"]`,
    };
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getMenuItem(name: string) {
        return this.page.locator(this.templates.menuItem(name));
    }
    
    getFormField(field: string) {
        return this.page.locator(this.templates.formField(field));
    }
    
    getTableRow(id: string) {
        return this.page.locator(this.templates.tableRow(id));
    }
    
    getTabPanel(tab: string) {
        return this.page.locator(this.templates.tabPanel(tab));
    }
}

// Solution 5: Conditional Locators
class ConditionalLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Get element based on condition
    getElement(useTestId: boolean, identifier: string) {
        if (useTestId) {
            return this.page.getByTestId(identifier);
        }
        return this.page.locator(`#${identifier}`);
    }
    
    // Get button based on state
    getButton(disabled: boolean) {
        if (disabled) {
            return this.page.locator('button[disabled]');
        }
        return this.page.locator('button:not([disabled])');
    }
}

// Solution 6: Composite Dynamic Locators
class CompositeDynamicLocatorsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Get cell in table
    getTableCell(rowId: string, columnName: string) {
        return this.page.locator(`tr[data-id="${rowId}"] td[data-column="${columnName}"]`);
    }
    
    // Get nested element
    getNestedElement(parentId: string, childClass: string) {
        return this.page.locator(`#${parentId} .${childClass}`);
    }
    
    // Get element with multiple attributes
    getElementByAttributes(attrs: Record<string, string>) {
        const selector = Object.entries(attrs)
            .map(([key, value]) => `[${key}="${value}"]`)
            .join('');
        return this.page.locator(selector);
    }
}

// Solution 7: Export
export {
    ParameterizedLocatorsPage,
    IndexLocatorsPage,
    TextDynamicLocatorsPage,
    TemplateLocatorsPage,
    ConditionalLocatorsPage,
    CompositeDynamicLocatorsPage,
};

