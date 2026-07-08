/**
 * Lab 502: Table Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating table components:
 * 
 * - Table structure
 * - Row/cell access
 * - Sorting
 * - Pagination
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create table component
 * 2. Access rows and cells
 * 3. Implement sorting
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Basic Table Component
class TableComponent {
    readonly root: Locator;
    readonly headers: Locator;
    readonly rows: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.headers = root.locator('thead th');
        this.rows = root.locator('tbody tr');
    }
    
    async getHeaderTexts() {
        return await this.headers.allTextContents();
    }
    
    async getRowCount() {
        return await this.rows.count();
    }
    
    async getRow(index: number) {
        return this.rows.nth(index);
    }
    
    async getCellText(rowIndex: number, colIndex: number) {
        return await this.rows.nth(rowIndex).locator('td').nth(colIndex).textContent();
    }
}

// Solution 2: Sortable Table Component
class SortableTableComponent extends TableComponent {
    async sortByColumn(columnName: string) {
        await this.headers.filter({ hasText: columnName }).click();
    }
    
    async sortByColumnIndex(index: number) {
        await this.headers.nth(index).click();
    }
    
    async getColumnValues(columnIndex: number) {
        const cells = this.rows.locator(`td:nth-child(${columnIndex + 1})`);
        return await cells.allTextContents();
    }
    
    async isSortedAscending(columnIndex: number) {
        const values = await this.getColumnValues(columnIndex);
        const sorted = [...values].sort();
        return JSON.stringify(values) === JSON.stringify(sorted);
    }
}

// Solution 3: Table with Actions
class ActionTableComponent extends TableComponent {
    async clickRowAction(rowIndex: number, actionName: string) {
        await this.rows.nth(rowIndex).locator(`button:has-text("${actionName}")`).click();
    }
    
    async clickEditForRow(rowIndex: number) {
        await this.clickRowAction(rowIndex, 'Edit');
    }
    
    async clickDeleteForRow(rowIndex: number) {
        await this.clickRowAction(rowIndex, 'Delete');
    }
    
    async getRowByText(text: string) {
        return this.rows.filter({ hasText: text });
    }
}

// Solution 4: Paginated Table Component
class PaginatedTableComponent extends TableComponent {
    readonly pagination: Locator;
    readonly prevButton: Locator;
    readonly nextButton: Locator;
    readonly pageInfo: Locator;
    
    constructor(root: Locator) {
        super(root);
        this.pagination = root.locator('.pagination');
        this.prevButton = this.pagination.locator('.prev');
        this.nextButton = this.pagination.locator('.next');
        this.pageInfo = this.pagination.locator('.page-info');
    }
    
    async goToNextPage() {
        await this.nextButton.click();
    }
    
    async goToPrevPage() {
        await this.prevButton.click();
    }
    
    async goToPage(pageNumber: number) {
        await this.pagination.locator(`button:has-text("${pageNumber}")`).click();
    }
    
    async getCurrentPage() {
        const text = await this.pageInfo.textContent();
        const match = text?.match(/Page (\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
}

// Solution 5: Selectable Table Component
class SelectableTableComponent extends TableComponent {
    readonly selectAllCheckbox: Locator;
    readonly rowCheckboxes: Locator;
    
    constructor(root: Locator) {
        super(root);
        this.selectAllCheckbox = root.locator('thead input[type="checkbox"]');
        this.rowCheckboxes = root.locator('tbody input[type="checkbox"]');
    }
    
    async selectAll() {
        await this.selectAllCheckbox.check();
    }
    
    async deselectAll() {
        await this.selectAllCheckbox.uncheck();
    }
    
    async selectRow(index: number) {
        await this.rowCheckboxes.nth(index).check();
    }
    
    async getSelectedCount() {
        let count = 0;
        const total = await this.rowCheckboxes.count();
        for (let i = 0; i < total; i++) {
            if (await this.rowCheckboxes.nth(i).isChecked()) {
                count++;
            }
        }
        return count;
    }
}

// Solution 6: Export
export {
    TableComponent,
    SortableTableComponent,
    ActionTableComponent,
    PaginatedTableComponent,
    SelectableTableComponent,
};

