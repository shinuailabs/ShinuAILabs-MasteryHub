/**
 * Lab 519: CSV Data
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with CSV test data:
 * 
 * - Parsing CSV
 * - CSV to objects
 * - Type conversion
 * - Data-driven tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Parse CSV data
 * 2. Convert to objects
 * 3. Use in tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import * as fs from 'fs';

// Solution 1: Simple CSV Parser
class SimpleCSVParser {
    static parse(content: string, delimiter: string = ','): string[][] {
        const lines = content.trim().split('\n');
        return lines.map(line => line.split(delimiter).map(cell => cell.trim()));
    }
    
    static parseWithHeaders(content: string): Record<string, string>[] {
        const rows = this.parse(content);
        if (rows.length === 0) return [];
        
        const headers = rows[0];
        return rows.slice(1).map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });
    }
}

// Solution 2: Typed CSV Parser
interface CSVParseOptions {
    delimiter?: string;
    hasHeaders?: boolean;
    skipEmptyLines?: boolean;
}

class TypedCSVParser<T> {
    private options: Required<CSVParseOptions>;
    
    constructor(options: CSVParseOptions = {}) {
        this.options = {
            delimiter: options.delimiter || ',',
            hasHeaders: options.hasHeaders ?? true,
            skipEmptyLines: options.skipEmptyLines ?? true,
        };
    }
    
    parse(content: string, transform?: (row: Record<string, string>) => T): T[] {
        let lines = content.trim().split('\n');
        
        if (this.options.skipEmptyLines) {
            lines = lines.filter(line => line.trim() !== '');
        }
        
        const rows = lines.map(line => 
            line.split(this.options.delimiter).map(cell => cell.trim())
        );
        
        if (!this.options.hasHeaders || rows.length === 0) {
            return rows as unknown as T[];
        }
        
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return transform ? transform(obj) : obj as unknown as T;
        });
        
        return data;
    }
}

// Solution 3: CSV Data Loader
class CSVDataLoader {
    static loadFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }
    
    static loadAsObjects(filePath: string): Record<string, string>[] {
        const content = this.loadFile(filePath);
        return SimpleCSVParser.parseWithHeaders(content);
    }
    
    static loadAsTyped<T>(
        filePath: string,
        transform: (row: Record<string, string>) => T
    ): T[] {
        const objects = this.loadAsObjects(filePath);
        return objects.map(transform);
    }
}

// Solution 4: User Data from CSV
interface UserCSV {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

function transformUserRow(row: Record<string, string>): UserCSV {
    return {
        username: row.username,
        email: row.email,
        password: row.password,
        isAdmin: row.isAdmin?.toLowerCase() === 'true',
    };
}

// Solution 5: Data-Driven Test Helper
class CSVTestDataProvider {
    private data: Record<string, string>[];
    
    constructor(filePath: string) {
        this.data = CSVDataLoader.loadAsObjects(filePath);
    }
    
    getAll(): Record<string, string>[] {
        return this.data;
    }
    
    getByColumn(column: string, value: string): Record<string, string> | undefined {
        return this.data.find(row => row[column] === value);
    }
    
    filterByColumn(column: string, value: string): Record<string, string>[] {
        return this.data.filter(row => row[column] === value);
    }
    
    *[Symbol.iterator]() {
        for (const row of this.data) {
            yield row;
        }
    }
}

// Solution 6: Sample CSV Structure
/*
 * users.csv:
 * username,email,password,isAdmin
 * admin,admin@test.com,Admin123!,true
 * user1,user1@test.com,User123!,false
 * user2,user2@test.com,User123!,false
 * 
 * products.csv:
 * id,name,price,category
 * 1,Laptop,999.99,Electronics
 * 2,Mouse,29.99,Electronics
 */

// Solution 7: Export
export {
    SimpleCSVParser,
    TypedCSVParser,
    CSVDataLoader,
    CSVTestDataProvider,
    UserCSV,
    transformUserRow,
    CSVParseOptions,
};

