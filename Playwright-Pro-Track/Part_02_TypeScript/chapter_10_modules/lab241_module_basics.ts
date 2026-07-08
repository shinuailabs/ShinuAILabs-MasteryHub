/**
 * Lab 241: Module Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * ES Modules in TypeScript:
 * 
 * - import/export syntax
 * - Named exports
 * - Default exports
 * - Module scope
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create module exports
 * 2. Import from modules
 * 3. Understand module scope
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Named Exports
console.log("--- Named Exports ---");

// In a real module file (math.ts):
// export const PI = 3.14159;
// export function add(a: number, b: number): number {
//     return a + b;
// }
// export class Calculator { ... }

// Simulating exports
const PI = 3.14159;
function add(a: number, b: number): number {
    return a + b;
}

console.log("PI:", PI);
console.log("add(2, 3):", add(2, 3));

// Solution 2: Default Export
console.log("\n--- Default Export ---");

// In a module file (logger.ts):
// export default class Logger {
//     log(message: string): void {
//         console.log(message);
//     }
// }

// Or function:
// export default function greet(name: string): string {
//     return `Hello, ${name}!`;
// }

class Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

const logger = new Logger();
logger.log("Hello from logger");

// Solution 3: Import Syntax
console.log("\n--- Import Syntax ---");

// Named imports:
// import { PI, add } from './math';

// Default import:
// import Logger from './logger';

// Rename import:
// import { add as sum } from './math';

// Import all:
// import * as MathUtils from './math';

// Combined:
// import Logger, { PI, add } from './module';

console.log("Import syntax demonstrated");

// Solution 4: Re-exports
console.log("\n--- Re-exports ---");

// In index.ts (barrel file):
// export { PI, add } from './math';
// export { default as Logger } from './logger';
// export * from './utils';

// Rename on re-export:
// export { add as sum } from './math';

console.log("Re-export patterns shown");

// Solution 5: Module Scope
console.log("\n--- Module Scope ---");

// Each module has its own scope
// Variables are not global

// module-a.ts
const moduleVar = "Module A";

// module-b.ts
// const moduleVar = "Module B"; // No conflict!

// Only exported items are accessible
// Private by default

console.log("Module var:", moduleVar);

// Solution 6: Type Exports
console.log("\n--- Type Exports ---");

// Export types and interfaces
// export interface User {
//     id: number;
//     name: string;
// }

// export type Status = 'active' | 'inactive';

// Type-only exports (TypeScript 3.8+)
// export type { User, Status };

interface User {
    id: number;
    name: string;
}

type Status = "active" | "inactive";

const user: User = { id: 1, name: "John" };
const status: Status = "active";

console.log("User:", user);
console.log("Status:", status);

// Solution 7: Dynamic Imports
console.log("\n--- Dynamic Imports ---");

// Lazy loading modules
// async function loadModule() {
//     const module = await import('./heavy-module');
//     module.doSomething();
// }

// Conditional imports
// if (condition) {
//     const { feature } = await import('./feature');
//     feature();
// }

async function demonstrateDynamicImport(): Promise<void> {
    console.log("Dynamic import would load module here");
    // const { something } = await import('./module');
}

demonstrateDynamicImport();

// Solution 8: CommonJS Interop
console.log("\n--- CommonJS Interop ---");

// Import CommonJS module
// import fs = require('fs');
// import * as fs from 'fs';

// Export for CommonJS
// export = myFunction;

// With esModuleInterop: true
// import fs from 'fs';

console.log("CommonJS interop available");

// Solution 9: Module Resolution
console.log("\n--- Module Resolution ---");

// Relative imports
// import { x } from './module';
// import { y } from '../utils/helper';

// Non-relative imports
// import { z } from 'lodash';
// import { w } from '@company/shared';

// Path mapping (tsconfig.json)
// "paths": {
//     "@utils/*": ["src/utils/*"]
// }

console.log("Module resolution configured in tsconfig");

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

// Typical module structure:

// types.ts
interface Product {
    id: number;
    name: string;
    price: number;
}

// utils.ts
function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
}

// service.ts
class ProductService {
    private products: Product[] = [];
    
    add(product: Product): void {
        this.products.push(product);
    }
    
    getAll(): Product[] {
        return this.products;
    }
}

// index.ts (barrel)
// export { Product } from './types';
// export { formatPrice } from './utils';
// export { ProductService } from './service';

const service = new ProductService();
service.add({ id: 1, name: "Widget", price: 9.99 });
console.log("Products:", service.getAll());
console.log("Price:", formatPrice(9.99));

