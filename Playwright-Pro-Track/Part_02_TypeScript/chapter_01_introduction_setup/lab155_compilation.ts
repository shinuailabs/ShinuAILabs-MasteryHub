/**
 * Lab 155: TypeScript Compilation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding TypeScript compilation:
 * 
 * - tsc compiler
 * - Watch mode
 * - Source maps
 * - Output options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compile TypeScript files
 * 2. Use watch mode
 * 3. Configure output
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Compilation
console.log("--- Basic Compilation ---");

/*
Compile a single file:
tsc filename.ts

Compile with options:
tsc --target ES2020 --module commonjs filename.ts

Compile entire project:
tsc

Compile with specific config:
tsc --project tsconfig.json
*/

// This TypeScript code
const greeting: string = "Hello, TypeScript!";
console.log(greeting);

// Compiles to JavaScript:
// const greeting = "Hello, TypeScript!";
// console.log(greeting);

// Solution 2: Watch Mode
console.log("\n--- Watch Mode ---");

/*
Watch mode recompiles on file changes:
tsc --watch
tsc -w

Watch specific files:
tsc --watch src/*.ts

Watch with project:
tsc --project tsconfig.json --watch
*/

// Solution 3: Source Maps
console.log("\n--- Source Maps ---");

/*
Enable source maps in tsconfig.json:
{
    "compilerOptions": {
        "sourceMap": true
    }
}

Or via command line:
tsc --sourceMap filename.ts

Source maps allow debugging TypeScript in browser/IDE
*/

function debugExample(): void {
    const x: number = 10;
    const y: number = 20;
    console.log("Sum:", x + y);
}

debugExample();

// Solution 4: Output Directory
console.log("\n--- Output Directory ---");

/*
Configure output directory:
{
    "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src"
    }
}

Project structure:
src/
  index.ts
  utils/
    helpers.ts

Compiles to:
dist/
  index.js
  utils/
    helpers.js
*/

// Solution 5: Declaration Files
console.log("\n--- Declaration Files ---");

/*
Generate .d.ts files:
{
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "./types"
    }
}

Declaration files provide type information for libraries
*/

// This function
export function add(a: number, b: number): number {
    return a + b;
}

// Generates add.d.ts:
// export declare function add(a: number, b: number): number;

console.log("Add:", add(5, 3));

// Solution 6: Target Versions
console.log("\n--- Target Versions ---");

/*
Target JavaScript version:
{
    "compilerOptions": {
        "target": "ES2020"  // or ES5, ES6, ES2015, ES2016, etc.
    }
}

ES5: Older browsers
ES6/ES2015: Modern browsers
ES2020+: Latest features
*/

// ES2020 features
const nullish = null ?? "default";
const optional = { a: { b: 1 } }?.a?.b;

console.log("Nullish:", nullish);
console.log("Optional:", optional);

// Solution 7: Module Systems
console.log("\n--- Module Systems ---");

/*
Module options:
{
    "compilerOptions": {
        "module": "commonjs"  // or ESNext, ES2020, AMD, UMD
    }
}

commonjs: Node.js (require/exports)
ESNext/ES2020: ES Modules (import/export)
AMD: RequireJS
UMD: Universal Module Definition
*/

// Solution 8: Incremental Compilation
console.log("\n--- Incremental Compilation ---");

/*
Enable incremental builds:
{
    "compilerOptions": {
        "incremental": true,
        "tsBuildInfoFile": "./.tsbuildinfo"
    }
}

Only recompiles changed files - faster builds
*/

// Solution 9: Build Mode
console.log("\n--- Build Mode ---");

/*
For multi-project builds:
tsc --build
tsc -b

With project references:
{
    "references": [
        { "path": "../common" },
        { "path": "../utils" }
    ]
}
*/

// Solution 10: Common Commands Summary
console.log("\n--- Command Summary ---");

const commands = [
    "tsc                     # Compile project",
    "tsc -w                  # Watch mode",
    "tsc --init              # Create tsconfig.json",
    "tsc --noEmit            # Type check only",
    "tsc --listFiles         # List compiled files",
    "tsc --showConfig        # Show resolved config",
    "tsc -b                  # Build mode",
    "tsc --declaration       # Generate .d.ts",
    "tsc --sourceMap         # Generate source maps",
    "tsc --target ES2020     # Set target version"
];

commands.forEach(cmd => console.log(cmd));

// Practical example
interface CompileOptions {
    target: string;
    module: string;
    strict: boolean;
    outDir: string;
}

const options: CompileOptions = {
    target: "ES2020",
    module: "commonjs",
    strict: true,
    outDir: "./dist"
};

console.log("\nCompile options:", options);

