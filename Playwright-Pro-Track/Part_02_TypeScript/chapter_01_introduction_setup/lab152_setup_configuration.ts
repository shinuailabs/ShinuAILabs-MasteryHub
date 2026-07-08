/**
 * Lab 152: TypeScript Setup and Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up TypeScript projects:
 * 
 * - Installing TypeScript
 * - tsconfig.json configuration
 * - Compiler options
 * - Project structure
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Initialize a TypeScript project
 * 2. Configure tsconfig.json
 * 3. Understand compiler options
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Installation Commands
console.log("--- Installation ---");

/*
Install TypeScript globally:
npm install -g typescript

Install locally in project:
npm install --save-dev typescript

Check version:
tsc --version

Initialize tsconfig.json:
tsc --init
*/

console.log("npm install -g typescript");
console.log("tsc --init");

// Solution 2: Basic tsconfig.json
console.log("\n--- tsconfig.json ---");

const basicTsConfig = {
    compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        strict: true,
        outDir: "./dist",
        rootDir: "./src",
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules"]
};

console.log("Basic tsconfig:", JSON.stringify(basicTsConfig, null, 2));

// Solution 3: Important Compiler Options
console.log("\n--- Compiler Options ---");

const compilerOptions = {
    // Target JavaScript version
    target: "ES2020",
    
    // Module system
    module: "commonjs", // or "ESNext", "ES2020"
    
    // Strict type checking
    strict: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    
    // Output directory
    outDir: "./dist",
    
    // Source directory
    rootDir: "./src",
    
    // Generate source maps
    sourceMap: true,
    
    // Generate declaration files
    declaration: true,
    
    // Allow JavaScript files
    allowJs: true,
    
    // Check JavaScript files
    checkJs: false,
    
    // Module resolution
    moduleResolution: "node",
    
    // Base URL for imports
    baseUrl: "./",
    
    // Path aliases
    paths: {
        "@/*": ["src/*"]
    }
};

console.log("Key options explained:");
console.log("- target: JavaScript version to compile to");
console.log("- strict: Enable all strict type checks");
console.log("- outDir: Where compiled JS goes");

// Solution 4: Project Structure
console.log("\n--- Project Structure ---");

const projectStructure = `
my-typescript-project/
├── src/
│   ├── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── models/
│       └── user.ts
├── dist/           (compiled output)
├── tests/
│   └── index.test.ts
├── package.json
├── tsconfig.json
└── README.md
`;

console.log(projectStructure);

// Solution 5: package.json Scripts
console.log("\n--- package.json Scripts ---");

const packageScripts = {
    scripts: {
        build: "tsc",
        watch: "tsc --watch",
        start: "node dist/index.js",
        dev: "ts-node src/index.ts",
        test: "jest",
        lint: "eslint src/**/*.ts"
    }
};

console.log("Scripts:", JSON.stringify(packageScripts, null, 2));

// Solution 6: Strict Mode Options
console.log("\n--- Strict Mode ---");

/*
strict: true enables all of these:
- strictNullChecks: null/undefined are distinct types
- strictFunctionTypes: Stricter function type checking
- strictBindCallApply: Check bind, call, apply
- strictPropertyInitialization: Class properties must be initialized
- noImplicitAny: Error on implicit any
- noImplicitThis: Error on implicit this
- alwaysStrict: Parse in strict mode
*/

// With strictNullChecks
function getLength(str: string | null): number {
    if (str === null) {
        return 0;
    }
    return str.length;
}

console.log("Length:", getLength("hello"));
console.log("Null length:", getLength(null));

// Solution 7: Declaration Files
console.log("\n--- Declaration Files ---");

/*
Declaration files (.d.ts) provide type information:

// types/custom.d.ts
declare module 'my-library' {
    export function doSomething(): void;
    export const version: string;
}

// For global variables
declare const API_URL: string;
*/

// Solution 8: Path Aliases
console.log("\n--- Path Aliases ---");

/*
In tsconfig.json:
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"],
            "@utils/*": ["src/utils/*"],
            "@models/*": ["src/models/*"]
        }
    }
}

Usage:
import { helper } from '@utils/helpers';
import { User } from '@models/user';
*/

// Solution 9: Multiple Config Files
console.log("\n--- Multiple Configs ---");

/*
tsconfig.base.json - shared settings
tsconfig.json - extends base
tsconfig.build.json - production build

// tsconfig.json
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
*/

// Solution 10: Common Commands
console.log("\n--- Common Commands ---");

const commands = [
    "tsc                    # Compile project",
    "tsc --watch            # Watch mode",
    "tsc --init             # Create tsconfig.json",
    "tsc file.ts            # Compile single file",
    "tsc --noEmit           # Type check only",
    "tsc --project ./path   # Use specific config",
    "ts-node file.ts        # Run directly"
];

commands.forEach(cmd => console.log(cmd));

