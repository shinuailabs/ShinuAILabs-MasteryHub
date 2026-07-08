/**
 * Lab 463: Page Generics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using generics with page objects:
 * 
 * - Type parameters
 * - Generic methods
 * - Constraints
 * - Reusable patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic page classes
 * 2. Use type parameters
 * 3. Apply constraints
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Generic Data Page
class DataPage<T> {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async getData(): Promise<T | null> {
        const text = await this.page.locator('.data').textContent();
        return text ? JSON.parse(text) as T : null;
    }
    
    async setData(data: T) {
        await this.page.locator('.data-input').fill(JSON.stringify(data));
    }
}

// Solution 2: Using Generic Data Page
interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

async function useGenericPage(page: Page) {
    const userPage = new DataPage<User>(page);
    const productPage = new DataPage<Product>(page);
    
    const user = await userPage.getData();
    const product = await productPage.getData();
}

// Solution 3: Generic Form Page
class FormPage<T extends Record<string, string>> {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page, formSelector: string) {
        this.page = page;
        this.form = page.locator(formSelector);
    }
    
    async fillForm(data: T) {
        for (const [field, value] of Object.entries(data)) {
            await this.form.locator(`[name="${field}"]`).fill(value);
        }
    }
    
    async getFormData(): Promise<T> {
        const inputs = await this.form.locator('input, textarea').all();
        const data: Record<string, string> = {};
        
        for (const input of inputs) {
            const name = await input.getAttribute('name');
            if (name) {
                data[name] = await input.inputValue();
            }
        }
        
        return data as T;
    }
}

// Solution 4: Generic List Page
class ListPage<T> {
    readonly page: Page;
    readonly items: Locator;
    private parser: (text: string) => T;
    
    constructor(page: Page, itemSelector: string, parser: (text: string) => T) {
        this.page = page;
        this.items = page.locator(itemSelector);
        this.parser = parser;
    }
    
    async getItems(): Promise<T[]> {
        const texts = await this.items.allTextContents();
        return texts.map(this.parser);
    }
    
    async getItemCount(): Promise<number> {
        return await this.items.count();
    }
}

// Solution 5: Generic with Constraints
interface Identifiable {
    id: number;
}

class EntityPage<T extends Identifiable> {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async getEntityById(id: number): Promise<T | null> {
        await this.page.goto(`/entity/${id}`);
        const text = await this.page.locator('.entity-data').textContent();
        return text ? JSON.parse(text) as T : null;
    }
}

// Solution 6: Generic Method
class UtilityPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async fetchData<T>(endpoint: string): Promise<T> {
        const response = await this.page.request.get(endpoint);
        return await response.json() as T;
    }
    
    async postData<T, R>(endpoint: string, data: T): Promise<R> {
        const response = await this.page.request.post(endpoint, { data });
        return await response.json() as R;
    }
}

// Solution 7: Generic Factory
class PageFactory<T> {
    private page: Page;
    private PageClass: new (page: Page) => T;
    
    constructor(page: Page, PageClass: new (page: Page) => T) {
        this.page = page;
        this.PageClass = PageClass;
    }
    
    create(): T {
        return new this.PageClass(this.page);
    }
}

// Solution 8: Generic Component
class TableComponent<T> {
    readonly page: Page;
    readonly table: Locator;
    private rowParser: (row: Locator) => Promise<T>;
    
    constructor(page: Page, tableSelector: string, rowParser: (row: Locator) => Promise<T>) {
        this.page = page;
        this.table = page.locator(tableSelector);
        this.rowParser = rowParser;
    }
    
    async getRows(): Promise<T[]> {
        const rows = await this.table.locator('tbody tr').all();
        return Promise.all(rows.map(this.rowParser));
    }
}

// Solution 9: Generic with Default Type
class ConfigurablePage<T = Record<string, unknown>> {
    readonly page: Page;
    private config: T;
    
    constructor(page: Page, config: T) {
        this.page = page;
        this.config = config;
    }
    
    getConfig(): T {
        return this.config;
    }
}

// Solution 10: Export
export {
    DataPage,
    FormPage,
    ListPage,
    EntityPage,
    UtilityPage,
    PageFactory,
    TableComponent,
    ConfigurablePage,
};

