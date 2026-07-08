/**
 * Lab 242: Named Exports
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Named exports in detail:
 * 
 * - Export declarations
 * - Export lists
 * - Renaming exports
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create named exports
 * 2. Use export lists
 * 3. Rename exports
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Inline Named Exports
console.log("--- Inline Named Exports ---");

// Export as you declare
export const VERSION = "1.0.0";

export function greet(name: string): string {
    return `Hello, ${name}!`;
}

export class Greeter {
    constructor(private prefix: string) {}
    
    greet(name: string): string {
        return `${this.prefix} ${name}!`;
    }
}

export interface Person {
    name: string;
    age: number;
}

export type ID = string | number;

console.log("VERSION:", VERSION);
console.log("greet:", greet("World"));

// Solution 2: Export List
console.log("\n--- Export List ---");

// Declare first, export later
const PI = 3.14159;
const E = 2.71828;

function add(a: number, b: number): number {
    return a + b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

// Export multiple items at once
// export { PI, E, add, multiply };

console.log("PI:", PI);
console.log("E:", E);

// Solution 3: Renaming Exports
console.log("\n--- Renaming Exports ---");

function internalAdd(a: number, b: number): number {
    return a + b;
}

function internalSubtract(a: number, b: number): number {
    return a - b;
}

// Export with different names
// export {
//     internalAdd as add,
//     internalSubtract as subtract
// };

console.log("Internal add:", internalAdd(2, 3));

// Solution 4: Exporting Types
console.log("\n--- Exporting Types ---");

// Regular type export
export interface User {
    id: number;
    name: string;
    email: string;
}

export type Status = "active" | "inactive" | "pending";

// Type-only export (TypeScript 3.8+)
// export type { User, Status };

// This ensures types are erased in JavaScript output

const user: User = { id: 1, name: "John", email: "john@example.com" };
console.log("User:", user);

// Solution 5: Exporting Classes
console.log("\n--- Exporting Classes ---");

export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
    
    subtract(a: number, b: number): number {
        return a - b;
    }
}

export abstract class Shape {
    abstract area(): number;
}

export class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
}

const calc = new Calculator();
console.log("Calculator:", calc.add(5, 3));

// Solution 6: Exporting Enums
console.log("\n--- Exporting Enums ---");

export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

export const enum FastDirection {
    Up = "UP",
    Down = "DOWN"
}

console.log("Direction:", Direction.Up);

// Solution 7: Exporting Constants
console.log("\n--- Exporting Constants ---");

export const CONFIG = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3
} as const;

export const COLORS = ["red", "green", "blue"] as const;

export const MAX_ITEMS = 100;

console.log("Config:", CONFIG);

// Solution 8: Organizing Exports
console.log("\n--- Organizing Exports ---");

// Group related exports
// math/index.ts
const mathExports = {
    PI: 3.14159,
    E: 2.71828,
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b
};

// string/index.ts
const stringExports = {
    capitalize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
    lowercase: (s: string) => s.toLowerCase()
};

console.log("Math PI:", mathExports.PI);
console.log("Capitalize:", stringExports.capitalize("hello"));

// Solution 9: Export Patterns
console.log("\n--- Export Patterns ---");

// Pattern 1: Feature module
// export { UserService } from './user.service';
// export { UserController } from './user.controller';
// export { User, UserDTO } from './user.types';

// Pattern 2: Utility module
// export { formatDate, parseDate } from './date';
// export { formatCurrency } from './currency';

// Pattern 3: Constants module
// export { API_URL, TIMEOUT } from './config';
// export { COLORS, SIZES } from './constants';

console.log("Export patterns demonstrated");

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use named exports for multiple items",
    "✓ Group related exports together",
    "✓ Use type-only exports for types",
    "✓ Keep export names consistent",
    "✓ Document exported APIs",
    "✓ Use barrel files (index.ts) for organization",
    "✗ Avoid exporting mutable variables",
    "✗ Don't export implementation details"
];

practices.forEach(p => console.log(p));

