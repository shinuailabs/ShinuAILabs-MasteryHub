/**
 * Lab 156: ts-node and Development Tools
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running TypeScript directly:
 * 
 * - ts-node for direct execution
 * - nodemon for auto-reload
 * - Development workflow
 * - Debugging setup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use ts-node
 * 2. Set up development workflow
 * 3. Configure debugging
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: ts-node Basics
console.log("--- ts-node Basics ---");

/*
Install ts-node:
npm install -D ts-node typescript @types/node

Run TypeScript directly:
npx ts-node src/index.ts

Or with global install:
ts-node src/index.ts
*/

// This file can be run directly with ts-node
const message: string = "Running with ts-node!";
console.log(message);

// Solution 2: ts-node Configuration
console.log("\n--- ts-node Configuration ---");

/*
In tsconfig.json:
{
    "ts-node": {
        "transpileOnly": true,
        "files": true,
        "compilerOptions": {
            "module": "commonjs"
        }
    }
}

Options:
- transpileOnly: Skip type checking (faster)
- files: Include files from tsconfig
- compilerOptions: Override compiler options
*/

// Solution 3: nodemon with ts-node
console.log("\n--- nodemon Setup ---");

/*
Install nodemon:
npm install -D nodemon

nodemon.json:
{
    "watch": ["src"],
    "ext": "ts",
    "ignore": ["src/**/*.spec.ts"],
    "exec": "ts-node ./src/index.ts"
}

package.json scripts:
{
    "scripts": {
        "dev": "nodemon",
        "dev:ts": "nodemon --exec ts-node src/index.ts"
    }
}
*/

// Solution 4: tsx (Alternative to ts-node)
console.log("\n--- tsx Alternative ---");

/*
tsx is a faster alternative:
npm install -D tsx

Run:
npx tsx src/index.ts

Watch mode:
npx tsx watch src/index.ts

package.json:
{
    "scripts": {
        "dev": "tsx watch src/index.ts"
    }
}
*/

// Solution 5: REPL Mode
console.log("\n--- REPL Mode ---");

/*
Interactive TypeScript REPL:
npx ts-node

Then type TypeScript code interactively:
> const x: number = 5
> x * 2
10
> interface User { name: string }
> const user: User = { name: "John" }
*/

// Solution 6: Debugging with VS Code
console.log("\n--- VS Code Debugging ---");

/*
.vscode/launch.json:
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug TypeScript",
            "runtimeArgs": ["-r", "ts-node/register"],
            "args": ["${workspaceFolder}/src/index.ts"],
            "cwd": "${workspaceFolder}",
            "sourceMaps": true
        }
    ]
}
*/

// Debuggable code
function calculateSum(numbers: number[]): number {
    let sum = 0;
    for (const num of numbers) {
        sum += num; // Set breakpoint here
    }
    return sum;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log("Sum:", result);

// Solution 7: Environment Variables
console.log("\n--- Environment Variables ---");

/*
Using dotenv:
npm install dotenv
npm install -D @types/node

// src/index.ts
import 'dotenv/config';

console.log(process.env.API_KEY);
*/

// Type-safe environment variables
interface Env {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    API_URL: string;
}

// Simulated env
const env: Partial<Env> = {
    NODE_ENV: "development",
    PORT: "3000"
};

console.log("Environment:", env.NODE_ENV);

// Solution 8: Path Aliases with ts-node
console.log("\n--- Path Aliases ---");

/*
tsconfig.json:
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"]
        }
    }
}

For ts-node, also install:
npm install -D tsconfig-paths

Run with:
ts-node -r tsconfig-paths/register src/index.ts

Or in tsconfig.json:
{
    "ts-node": {
        "require": ["tsconfig-paths/register"]
    }
}
*/

// Solution 9: Scripts Setup
console.log("\n--- Complete Scripts Setup ---");

const packageScripts = {
    scripts: {
        // Development
        "dev": "nodemon",
        "dev:ts": "tsx watch src/index.ts",
        
        // Build
        "build": "tsc",
        "build:watch": "tsc --watch",
        
        // Production
        "start": "node dist/index.js",
        "start:ts": "ts-node src/index.ts",
        
        // Testing
        "test": "jest",
        "test:watch": "jest --watch",
        
        // Linting
        "lint": "eslint src/**/*.ts",
        "lint:fix": "eslint src/**/*.ts --fix",
        
        // Type checking
        "typecheck": "tsc --noEmit"
    }
};

console.log("Recommended scripts:");
Object.entries(packageScripts.scripts).forEach(([name, cmd]) => {
    console.log(`  ${name}: ${cmd}`);
});

// Solution 10: Development Workflow
console.log("\n--- Development Workflow ---");

console.log(`
Recommended workflow:
1. npm run dev        - Start development server
2. Make changes       - Auto-reload with nodemon
3. npm run typecheck  - Check types
4. npm run lint       - Check code style
5. npm run test       - Run tests
6. npm run build      - Build for production
7. npm start          - Run production build
`);

