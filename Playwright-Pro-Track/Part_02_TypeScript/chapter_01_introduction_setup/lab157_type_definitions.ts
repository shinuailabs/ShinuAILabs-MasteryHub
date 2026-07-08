/**
 * Lab 157: Type Definitions and @types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using type definitions:
 * 
 * - DefinitelyTyped (@types)
 * - Installing type packages
 * - Creating custom declarations
 * - Ambient declarations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Install type definitions
 * 2. Create custom declarations
 * 3. Use ambient types
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Installing @types
console.log("--- Installing @types ---");

/*
Install type definitions from DefinitelyTyped:

npm install -D @types/node
npm install -D @types/express
npm install -D @types/lodash
npm install -D @types/jest

These provide types for JavaScript libraries
*/

// With @types/node installed:
// import * as fs from 'fs';
// import * as path from 'path';

console.log("@types packages provide type definitions");

// Solution 2: Checking for Types
console.log("\n--- Checking for Types ---");

/*
Many packages include their own types:
- axios (built-in)
- typescript (built-in)
- date-fns (built-in)

Check package.json for "types" or "typings" field

If no types exist:
1. Check @types/package-name
2. Create your own declarations
3. Use 'any' as last resort
*/

// Solution 3: Custom Declaration Files
console.log("\n--- Custom Declarations ---");

/*
Create a .d.ts file for untyped modules:

// types/my-library.d.ts
declare module 'my-library' {
    export function doSomething(input: string): string;
    export const version: string;
    
    export interface Config {
        debug: boolean;
        timeout: number;
    }
    
    export default class MyLibrary {
        constructor(config: Config);
        run(): void;
    }
}
*/

// Solution 4: Global Declarations
console.log("\n--- Global Declarations ---");

/*
// types/global.d.ts
declare global {
    interface Window {
        myApp: {
            version: string;
            init(): void;
        };
    }
    
    const API_URL: string;
    const DEBUG: boolean;
}

export {}; // Makes this a module
*/

// Simulated global
declare const APP_VERSION: string;
// console.log(APP_VERSION); // Would work if defined

// Solution 5: Ambient Declarations
console.log("\n--- Ambient Declarations ---");

/*
Ambient declarations describe existing code:

// types/ambient.d.ts
declare function $(selector: string): HTMLElement;
declare namespace $ {
    function ajax(url: string): Promise<any>;
}

declare class ExternalClass {
    constructor(name: string);
    getName(): string;
}
*/

// Solution 6: Module Augmentation
console.log("\n--- Module Augmentation ---");

/*
Extend existing module types:

// types/express-augment.d.ts
import 'express';

declare module 'express' {
    interface Request {
        user?: {
            id: string;
            email: string;
        };
    }
}
*/

// Example: Augmenting Array
declare global {
    interface Array<T> {
        customMethod(): T[];
    }
}

// Implementation would be needed
// Array.prototype.customMethod = function() { return this; };

// Solution 7: Triple-Slash Directives
console.log("\n--- Triple-Slash Directives ---");

/*
Reference type definitions:

/// <reference types="node" />
/// <reference path="./types/custom.d.ts" />

Used at the top of files to include type definitions
*/

// Solution 8: Declaration Merging
console.log("\n--- Declaration Merging ---");

// Interfaces merge automatically
interface User {
    name: string;
}

interface User {
    email: string;
}

// User now has both name and email
const user: User = {
    name: "John",
    email: "john@example.com"
};

console.log("Merged interface:", user);

// Solution 9: Namespace Declarations
console.log("\n--- Namespace Declarations ---");

/*
// types/my-namespace.d.ts
declare namespace MyNamespace {
    interface Config {
        debug: boolean;
    }
    
    function init(config: Config): void;
    
    class Service {
        constructor();
        start(): void;
    }
}
*/

// Using namespace
namespace Utils {
    export function log(message: string): void {
        console.log(`[Utils] ${message}`);
    }
    
    export interface LogOptions {
        level: "info" | "warn" | "error";
    }
}

Utils.log("Namespace example");

// Solution 10: Type Definition Best Practices
console.log("\n--- Best Practices ---");

/*
1. Always install @types for libraries you use
2. Create custom .d.ts for untyped libraries
3. Put declarations in a 'types' folder
4. Include types folder in tsconfig.json:
   {
       "compilerOptions": {
           "typeRoots": ["./node_modules/@types", "./types"]
       }
   }
5. Use 'declare' for ambient declarations
6. Export types from declaration files
7. Use module augmentation to extend existing types
*/

// Example project structure
const structure = `
project/
├── src/
│   └── index.ts
├── types/
│   ├── global.d.ts
│   ├── my-library.d.ts
│   └── express-augment.d.ts
├── tsconfig.json
└── package.json
`;

console.log("Project structure:", structure);

// tsconfig.json for types
const tsconfig = {
    compilerOptions: {
        typeRoots: ["./node_modules/@types", "./types"],
        types: ["node", "jest"]
    },
    include: ["src/**/*", "types/**/*"]
};

console.log("tsconfig for types:", JSON.stringify(tsconfig, null, 2));

