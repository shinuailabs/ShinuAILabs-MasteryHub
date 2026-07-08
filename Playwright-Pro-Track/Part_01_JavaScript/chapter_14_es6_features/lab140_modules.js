/**
 * Lab 140: ES6 Modules
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * ES6 module system:
 * 
 * - Named exports/imports
 * - Default exports/imports
 * - Re-exporting
 * - Dynamic imports
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create module exports
 * 2. Import modules
 * 3. Use dynamic imports
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This file demonstrates module syntax
// In real usage, these would be in separate files

// Solution 1: Named Exports
console.log("--- Named Exports ---");

// In math.js:
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export function subtract(a, b) { return a - b; }

// Or export at the end:
const PI = 3.14159;
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
// export { PI, add, subtract };

console.log("PI:", PI);
console.log("Add:", add(5, 3));

// Solution 2: Named Imports
console.log("\n--- Named Imports ---");

// import { PI, add, subtract } from './math.js';
// import { add as sum } from './math.js'; // Rename
// import * as math from './math.js'; // Import all

// Usage:
// console.log(PI);
// console.log(sum(1, 2));
// console.log(math.add(1, 2));

// Solution 3: Default Export
console.log("\n--- Default Export ---");

// In user.js:
// export default class User {
//     constructor(name) {
//         this.name = name;
//     }
// }

// Or:
// const User = class { ... };
// export default User;

class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("John");
console.log("User:", user.name);

// Solution 4: Default Import
console.log("\n--- Default Import ---");

// import User from './user.js';
// import MyUser from './user.js'; // Can use any name

// Solution 5: Mixed Exports
console.log("\n--- Mixed Exports ---");

// In api.js:
// export default class Api { ... }
// export const BASE_URL = 'https://api.example.com';
// export function request() { ... }

// Import:
// import Api, { BASE_URL, request } from './api.js';

// Solution 6: Re-exporting
console.log("\n--- Re-exporting ---");

// In index.js (barrel file):
// export { add, subtract } from './math.js';
// export { default as User } from './user.js';
// export * from './utils.js';

// Solution 7: Dynamic Imports
console.log("\n--- Dynamic Imports ---");

// Dynamic import returns a promise
async function loadModule() {
    // const module = await import('./math.js');
    // console.log(module.add(1, 2));
    
    // Simulated:
    const module = { add: (a, b) => a + b };
    console.log("Dynamic import result:", module.add(1, 2));
}

loadModule();

// Conditional import
async function loadFeature(featureName) {
    // const feature = await import(`./features/${featureName}.js`);
    // return feature.default;
    console.log("Would load feature:", featureName);
}

loadFeature("dashboard");

// Solution 8: Module Patterns
console.log("\n--- Module Patterns ---");

// Singleton pattern
// let instance = null;
// export default function getInstance() {
//     if (!instance) {
//         instance = { /* ... */ };
//     }
//     return instance;
// }

// Factory pattern
// export function createLogger(prefix) {
//     return {
//         log: (msg) => console.log(`[${prefix}] ${msg}`)
//     };
// }

// Solution 9: Circular Dependencies
console.log("\n--- Circular Dependencies ---");

// Avoid circular dependencies by:
// 1. Restructuring code
// 2. Using dependency injection
// 3. Moving shared code to a third module

// a.js imports from b.js
// b.js imports from a.js
// Solution: Create c.js with shared code

// Solution 10: Module Best Practices
console.log("\n--- Best Practices ---");

/*
1. One module per file
2. Use named exports for utilities
3. Use default export for main class/function
4. Create barrel files (index.js) for directories
5. Avoid circular dependencies
6. Use dynamic imports for code splitting

Example structure:
/src
  /components
    Button.js
    Input.js
    index.js  // export { Button } from './Button';
  /utils
    math.js
    string.js
    index.js
  /services
    api.js
    auth.js
    index.js
  index.js  // Main entry point
*/

console.log("\nModule syntax summary:");
console.log("- export const x = 1;");
console.log("- export default class X {}");
console.log("- import { x } from './module';");
console.log("- import X from './module';");
console.log("- import * as mod from './module';");
console.log("- const mod = await import('./module');");

// Simulated module usage
const mathModule = {
    PI: 3.14159,
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

const { PI: pi, add: sum2 } = mathModule;
console.log("\nSimulated import:");
console.log("PI:", pi);
console.log("Sum:", sum2(10, 5));

