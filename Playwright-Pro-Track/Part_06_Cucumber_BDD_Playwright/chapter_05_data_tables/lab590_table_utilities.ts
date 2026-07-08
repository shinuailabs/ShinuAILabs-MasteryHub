/**
 * Lab 590: Data Table Utilities
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Utility functions for data tables:
 * 
 * - Helper functions
 * - Reusable transformers
 * - Validation utilities
 * - Comparison helpers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create utility functions
 * 2. Build reusable helpers
 * 3. Implement validators
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { DataTable } from '@cucumber/cucumber';

// Solution 1: Table to Object Utility
export function tableToObject(dataTable: DataTable): Record<string, string> {
    return dataTable.rowsHash();
}

// Solution 2: Table to Typed Array
export function tableToTypedArray<T>(
    dataTable: DataTable,
    transformer: (row: Record<string, string>) => T
): T[] {
    return dataTable.hashes().map(transformer);
}

// Solution 3: Parse Currency
export function parseCurrency(value: string): number {
    return parseFloat(value.replace(/[$,]/g, ''));
}

// Solution 4: Parse Boolean
export function parseBoolean(value: string): boolean {
    const trueValues = ['true', 'yes', '1', 'on', 'enabled'];
    return trueValues.includes(value.toLowerCase());
}

// Solution 5: Parse Date
export function parseDate(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }
    return date;
}

// Solution 6: Field Name Normalizer
export function normalizeFieldName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

// Solution 7: Table Validator
export function validateTable(
    dataTable: DataTable,
    requiredColumns: string[]
): void {
    const headers = dataTable.raw()[0];
    
    for (const required of requiredColumns) {
        if (!headers.includes(required)) {
            throw new Error(`Missing required column: ${required}`);
        }
    }
}

// Solution 8: Table Comparator
export function compareTables(
    expected: DataTable,
    actual: Record<string, string>[]
): { matches: boolean; differences: string[] } {
    const expectedRows = expected.hashes();
    const differences: string[] = [];
    
    if (expectedRows.length !== actual.length) {
        differences.push(
            `Row count mismatch: expected ${expectedRows.length}, got ${actual.length}`
        );
    }
    
    const minLength = Math.min(expectedRows.length, actual.length);
    
    for (let i = 0; i < minLength; i++) {
        for (const [key, expectedValue] of Object.entries(expectedRows[i])) {
            const actualValue = actual[i][key];
            if (actualValue !== expectedValue) {
                differences.push(
                    `Row ${i + 1}, ${key}: expected "${expectedValue}", got "${actualValue}"`
                );
            }
        }
    }
    
    return {
        matches: differences.length === 0,
        differences,
    };
}

// Solution 9: Table Filter
export function filterTable(
    dataTable: DataTable,
    predicate: (row: Record<string, string>) => boolean
): Record<string, string>[] {
    return dataTable.hashes().filter(predicate);
}

// Solution 10: Table Aggregator
export function aggregateTable(
    dataTable: DataTable,
    column: string,
    aggregator: (values: string[]) => any
): any {
    const values = dataTable.hashes().map(row => row[column]);
    return aggregator(values);
}

// Solution 11: Sum Aggregator
export function sumColumn(dataTable: DataTable, column: string): number {
    return aggregateTable(dataTable, column, (values) =>
        values.reduce((sum, v) => sum + parseCurrency(v), 0)
    );
}

// Solution 12: Group By
export function groupBy(
    dataTable: DataTable,
    keyColumn: string
): Map<string, Record<string, string>[]> {
    const groups = new Map<string, Record<string, string>[]>();
    
    for (const row of dataTable.hashes()) {
        const key = row[keyColumn];
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)!.push(row);
    }
    
    return groups;
}

// Solution 13: Table Merger
export function mergeTables(
    table1: DataTable,
    table2: DataTable,
    keyColumn: string
): Record<string, string>[] {
    const map = new Map<string, Record<string, string>>();
    
    for (const row of table1.hashes()) {
        map.set(row[keyColumn], { ...row });
    }
    
    for (const row of table2.hashes()) {
        const existing = map.get(row[keyColumn]);
        if (existing) {
            map.set(row[keyColumn], { ...existing, ...row });
        } else {
            map.set(row[keyColumn], { ...row });
        }
    }
    
    return Array.from(map.values());
}

// Solution 14: Table to CSV
export function tableToCSV(dataTable: DataTable): string {
    const raw = dataTable.raw();
    return raw.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Solution 15: Table from JSON
export function jsonToTableFormat(
    data: Record<string, any>[]
): { headers: string[]; rows: string[][] } {
    if (data.length === 0) {
        return { headers: [], rows: [] };
    }
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(h => String(item[h] ?? '')));
    
    return { headers, rows };
}

// Solution 16: Export all utilities
export const TableUtils = {
    tableToObject,
    tableToTypedArray,
    parseCurrency,
    parseBoolean,
    parseDate,
    normalizeFieldName,
    validateTable,
    compareTables,
    filterTable,
    aggregateTable,
    sumColumn,
    groupBy,
    mergeTables,
    tableToCSV,
    jsonToTableFormat,
};

