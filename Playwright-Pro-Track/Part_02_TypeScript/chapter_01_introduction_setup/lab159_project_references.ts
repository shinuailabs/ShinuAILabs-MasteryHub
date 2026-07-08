/**
 * Lab 159: Project References
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript project references:
 * 
 * - Multi-project builds
 * - Composite projects
 * - Build dependencies
 * - Incremental builds
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up project references
 * 2. Configure composite projects
 * 3. Build multi-project workspace
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Project Structure
console.log("--- Project Structure ---");

const projectStructure = `
monorepo/
├── packages/
│   ├── common/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── api/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
├── tsconfig.json (root)
└── package.json
`;

console.log(projectStructure);

// Solution 2: Root tsconfig.json
console.log("\n--- Root tsconfig.json ---");

const rootConfig = {
    files: [],
    references: [
        { path: "./packages/common" },
        { path: "./packages/api" },
        { path: "./packages/web" }
    ]
};

console.log("Root config:", JSON.stringify(rootConfig, null, 2));

// Solution 3: Composite Project Config
console.log("\n--- Composite Project ---");

const commonConfig = {
    compilerOptions: {
        composite: true,
        declaration: true,
        declarationMap: true,
        rootDir: "./src",
        outDir: "./dist"
    },
    include: ["src/**/*"]
};

console.log("Common package config:", JSON.stringify(commonConfig, null, 2));

// Solution 4: Dependent Project Config
console.log("\n--- Dependent Project ---");

const apiConfig = {
    compilerOptions: {
        composite: true,
        declaration: true,
        rootDir: "./src",
        outDir: "./dist"
    },
    references: [
        { path: "../common" }
    ],
    include: ["src/**/*"]
};

console.log("API package config:", JSON.stringify(apiConfig, null, 2));

// Solution 5: Build Commands
console.log("\n--- Build Commands ---");

/*
Build all projects:
tsc --build

Build specific project:
tsc --build packages/api

Clean build:
tsc --build --clean

Force rebuild:
tsc --build --force

Watch mode:
tsc --build --watch

Verbose output:
tsc --build --verbose
*/

const buildCommands = [
    "tsc --build              # Build all",
    "tsc -b                   # Short form",
    "tsc -b --clean           # Clean outputs",
    "tsc -b --force           # Force rebuild",
    "tsc -b --watch           # Watch mode",
    "tsc -b packages/api      # Build specific"
];

buildCommands.forEach(cmd => console.log(cmd));

// Solution 6: Package.json Scripts
console.log("\n--- Package Scripts ---");

const scripts = {
    "build": "tsc --build",
    "build:clean": "tsc --build --clean",
    "build:force": "tsc --build --force",
    "build:watch": "tsc --build --watch",
    "build:common": "tsc --build packages/common",
    "build:api": "tsc --build packages/api",
    "build:web": "tsc --build packages/web"
};

console.log("Scripts:", JSON.stringify(scripts, null, 2));

// Solution 7: Importing from References
console.log("\n--- Importing ---");

/*
In packages/api/src/index.ts:

// Import from common package
import { utils, types } from '@monorepo/common';

// Or with path mapping
import { utils } from '../../../common/src';
*/

// Solution 8: Path Mapping
console.log("\n--- Path Mapping ---");

const pathMappingConfig = {
    compilerOptions: {
        baseUrl: ".",
        paths: {
            "@common/*": ["../common/src/*"],
            "@api/*": ["../api/src/*"]
        }
    }
};

console.log("Path mapping:", JSON.stringify(pathMappingConfig, null, 2));

// Solution 9: Incremental Builds
console.log("\n--- Incremental Builds ---");

/*
Project references enable incremental builds:
- Only rebuilds changed projects
- Uses .tsbuildinfo files
- Much faster for large codebases

Benefits:
1. Faster builds
2. Better IDE performance
3. Logical code separation
4. Independent versioning
*/

// Solution 10: Example Code
console.log("\n--- Example Code ---");

// packages/common/src/index.ts
namespace Common {
    export interface User {
        id: number;
        name: string;
        email: string;
    }
    
    export function validateEmail(email: string): boolean {
        return email.includes("@");
    }
}

// packages/api/src/index.ts (would import from common)
namespace Api {
    // import { User, validateEmail } from '@common';
    
    export function createUser(name: string, email: string): Common.User {
        if (!Common.validateEmail(email)) {
            throw new Error("Invalid email");
        }
        return { id: Date.now(), name, email };
    }
}

const user = Api.createUser("John", "john@example.com");
console.log("Created user:", user);

console.log("\nProject references enable scalable TypeScript monorepos!");

