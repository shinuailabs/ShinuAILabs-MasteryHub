/**
 * Lab 160: TypeScript Setup Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for TypeScript projects:
 *
 * - Recommended configurations
 * - Project organization
 * - Tooling setup
 * - Common patterns
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Set up optimal configuration
 * 3. Organize project properly
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Recommended tsconfig.json
console.log("--- Recommended tsconfig.json ---");

const recommendedConfig = {
    compilerOptions: {
        // Target and Module
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],

        // Strict Type Checking
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        strictBindCallApply: true,
        strictPropertyInitialization: true,
        noImplicitThis: true,

        // Module Resolution
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,

        // Output
        outDir: "./dist",
        rootDir: "./src",
        declaration: true,
        declarationMap: true,
        sourceMap: true,

        // Additional Checks
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,

        // Other
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist", "**/*.test.ts"]
};

console.log("Strict mode enabled with all checks");

// Solution 2: Project Structure
console.log("\n--- Project Structure ---");

const structure = `
my-project/
├── src/
│   ├── index.ts          # Entry point
│   ├── types/            # Type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── index.ts
│   ├── services/         # Business logic
│   │   └── index.ts
│   └── models/           # Data models
│       └── index.ts
├── tests/
│   └── *.test.ts
├── dist/                 # Compiled output
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
`;

console.log(structure);

// Solution 3: Essential Dependencies
console.log("\n--- Essential Dependencies ---");

const devDependencies = {
    // TypeScript
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",

    // Execution
    "ts-node": "^10.0.0",
    "tsx": "^4.0.0",

    // Linting
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",

    // Formatting
    "prettier": "^3.0.0",
    "eslint-config-prettier": "^9.0.0",

    // Testing
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
};

console.log("Dev dependencies:", Object.keys(devDependencies).join(", "));

// Solution 4: Package.json Scripts
console.log("\n--- Package Scripts ---");

const scripts = {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run build"
};

console.log("Scripts configured");

// Solution 5: Type Organization
console.log("\n--- Type Organization ---");

// src/types/index.ts - Central type exports
export interface User {
    id: number;
    name: string;
    email: string;
}

export type UserRole = "admin" | "user" | "guest";

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// Re-export from other type files
// export * from './user.types';
// export * from './api.types';

// Solution 6: Barrel Exports
console.log("\n--- Barrel Exports ---");

/*
// src/utils/index.ts
export * from './string';
export * from './number';
export * from './date';

// src/index.ts
export * from './types';
export * from './utils';
export * from './services';

Usage:
import { User, formatDate, UserService } from './';
*/

// Solution 7: Error Handling Pattern
console.log("\n--- Error Handling ---");

class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = "AppError";
    }
}

function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }
    if (error instanceof Error) {
        return new AppError(error.message, "UNKNOWN_ERROR");
    }
    return new AppError("An unknown error occurred", "UNKNOWN_ERROR");
}

// Solution 8: Configuration Pattern
console.log("\n--- Configuration Pattern ---");

interface Config {
    port: number;
    database: {
        host: string;
        port: number;
        name: string;
    };
    debug: boolean;
}

function loadConfig(): Config {
    return {
        port: parseInt(process.env.PORT || "3000", 10),
        database: {
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "5432", 10),
            name: process.env.DB_NAME || "myapp"
        },
        debug: process.env.NODE_ENV !== "production"
    };
}

const config = loadConfig();
console.log("Config loaded:", config.port);

// Solution 9: Testing Setup
console.log("\n--- Testing Setup ---");

/*
jest.config.js:
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage'
};
*/

// Solution 10: Summary Checklist
console.log("\n--- Setup Checklist ---");

const checklist = [
    "✓ TypeScript installed",
    "✓ tsconfig.json with strict mode",
    "✓ ESLint + Prettier configured",
    "✓ Jest for testing",
    "✓ Proper project structure",
    "✓ Type definitions organized",
    "✓ Barrel exports for clean imports",
    "✓ Error handling patterns",
    "✓ Configuration management",
    "✓ Scripts for dev, build, test, lint"
];

checklist.forEach(item => console.log(item));
