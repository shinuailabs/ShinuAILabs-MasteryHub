/**
 * Lab 247: Declaration Files (.d.ts)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript declaration files:
 * 
 * - Type definitions
 * - Ambient declarations
 * - DefinitelyTyped
 * - Creating declarations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand .d.ts files
 * 2. Use @types packages
 * 3. Create declarations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: What are Declaration Files?
console.log("--- Declaration Files ---");

// .d.ts files contain only type information
// No runtime code - just type definitions

// Example: lodash.d.ts
// declare function map<T, U>(arr: T[], fn: (item: T) => U): U[];
// declare function filter<T>(arr: T[], fn: (item: T) => boolean): T[];

// Used for:
// - JavaScript libraries
// - Global variables
// - Module augmentation

console.log("Declaration files provide types for JS");

// Solution 2: Using @types Packages
console.log("\n--- @types Packages ---");

// Install type definitions:
// npm install --save-dev @types/lodash
// npm install --save-dev @types/node
// npm install --save-dev @types/express

// TypeScript automatically finds them in node_modules/@types

// Check if types exist:
// npm search @types/package-name

console.log("@types packages from DefinitelyTyped");

// Solution 3: Ambient Declarations
console.log("\n--- Ambient Declarations ---");

// Declare global variable
// declare const API_URL: string;

// Declare global function
// declare function gtag(...args: unknown[]): void;

// Declare module
// declare module 'untyped-module' {
//     export function doSomething(): void;
// }

// These tell TypeScript about external code

console.log("Ambient declarations describe external code");

// Solution 4: Creating Declaration Files
console.log("\n--- Creating Declarations ---");

// For a JavaScript library (my-lib.js):
// function greet(name) { return 'Hello, ' + name; }
// module.exports = { greet };

// Create my-lib.d.ts:
// declare module 'my-lib' {
//     export function greet(name: string): string;
// }

// Or inline in .d.ts:
// export function greet(name: string): string;

console.log("Create .d.ts for untyped libraries");

// Solution 5: Global Declarations
console.log("\n--- Global Declarations ---");

// globals.d.ts
// declare global {
//     interface Window {
//         myApp: {
//             version: string;
//             init(): void;
//         };
//     }
//     
//     const __DEV__: boolean;
// }

// Now TypeScript knows about window.myApp and __DEV__

// For Node.js environment variables:
// declare namespace NodeJS {
//     interface ProcessEnv {
//         NODE_ENV: 'development' | 'production';
//         API_KEY: string;
//     }
// }

console.log("Global declarations extend built-in types");

// Solution 6: Module Augmentation
console.log("\n--- Module Augmentation ---");

// Extend existing module types
// express.d.ts
// import 'express';
// 
// declare module 'express' {
//     interface Request {
//         user?: {
//             id: string;
//             name: string;
//         };
//     }
// }

// Now req.user is typed in Express handlers

console.log("Augment existing module types");

// Solution 7: Triple-Slash Directives
console.log("\n--- Triple-Slash Directives ---");

// Reference other declaration files
// /// <reference path="./other.d.ts" />

// Reference @types package
// /// <reference types="node" />

// Reference library
// /// <reference lib="es2020" />

// Usually not needed with modern tsconfig

console.log("Triple-slash for special references");

// Solution 8: Generating Declarations
console.log("\n--- Generating Declarations ---");

// tsconfig.json:
// {
//     "compilerOptions": {
//         "declaration": true,
//         "declarationDir": "./types",
//         "emitDeclarationOnly": true
//     }
// }

// Generates .d.ts files from TypeScript source
// Useful for publishing libraries

console.log("Generate .d.ts with declaration: true");

// Solution 9: Declaration File Structure
console.log("\n--- File Structure ---");

// For a library:
// my-library/
//   ├── src/
//   │   └── index.ts
//   ├── dist/
//   │   ├── index.js
//   │   └── index.d.ts
//   └── package.json

// package.json:
// {
//     "main": "dist/index.js",
//     "types": "dist/index.d.ts"
// }

console.log("Include types field in package.json");

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use @types packages when available",
    "✓ Create .d.ts for untyped dependencies",
    "✓ Generate declarations for libraries",
    "✓ Use module augmentation sparingly",
    "✓ Keep declarations in sync with code",
    "✓ Test declarations with dtslint",
    "✗ Don't put runtime code in .d.ts",
    "✗ Avoid any in declarations"
];

practices.forEach(p => console.log(p));

// Example declaration file:
// my-utils.d.ts
// export function formatDate(date: Date): string;
// export function parseDate(str: string): Date;
// export interface DateConfig {
//     format: string;
//     locale: string;
// }

