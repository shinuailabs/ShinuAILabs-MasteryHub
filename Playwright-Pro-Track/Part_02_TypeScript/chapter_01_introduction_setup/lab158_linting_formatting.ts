/**
 * Lab 158: Linting and Formatting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Code quality tools for TypeScript:
 * 
 * - ESLint with TypeScript
 * - Prettier for formatting
 * - Configuration
 * - IDE integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up ESLint
 * 2. Configure Prettier
 * 3. Integrate with IDE
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: ESLint Setup
console.log("--- ESLint Setup ---");

/*
Install ESLint for TypeScript:
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

Initialize ESLint:
npx eslint --init
*/

const eslintConfig = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json"
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn"
    }
};

console.log("ESLint config:", JSON.stringify(eslintConfig, null, 2));

// Solution 2: Prettier Setup
console.log("\n--- Prettier Setup ---");

/*
Install Prettier:
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
*/

const prettierConfig = {
    semi: true,
    trailingComma: "es5",
    singleQuote: true,
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    bracketSpacing: true,
    arrowParens: "always"
};

console.log("Prettier config:", JSON.stringify(prettierConfig, null, 2));

// Solution 3: Combined ESLint + Prettier
console.log("\n--- Combined Config ---");

const combinedConfig = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier" // Must be last
    ],
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": "error"
    }
};

console.log("Combined config extends:", combinedConfig.extends);

// Solution 4: ESLint Rules for TypeScript
console.log("\n--- TypeScript ESLint Rules ---");

const typescriptRules = {
    // Require explicit return types
    "@typescript-eslint/explicit-function-return-type": "warn",
    
    // Disallow any type
    "@typescript-eslint/no-explicit-any": "error",
    
    // Require await in async functions
    "@typescript-eslint/require-await": "error",
    
    // Disallow unused variables
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    
    // Require type annotations
    "@typescript-eslint/typedef": ["error", {
        variableDeclaration: true,
        parameter: true
    }],
    
    // Naming conventions
    "@typescript-eslint/naming-convention": [
        "error",
        { selector: "interface", format: ["PascalCase"] },
        { selector: "typeAlias", format: ["PascalCase"] },
        { selector: "enum", format: ["PascalCase"] }
    ]
};

console.log("Key TypeScript rules configured");

// Solution 5: Ignore Patterns
console.log("\n--- Ignore Patterns ---");

/*
.eslintignore:
node_modules/
dist/
coverage/
*.js
*.d.ts

.prettierignore:
node_modules/
dist/
coverage/
package-lock.json
*/

// Solution 6: Scripts
console.log("\n--- Package Scripts ---");

const scripts = {
    "lint": "eslint 'src/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' --fix",
    "format": "prettier --write 'src/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.ts'",
    "check": "npm run lint && npm run format:check && npm run typecheck"
};

console.log("Scripts:", JSON.stringify(scripts, null, 2));

// Solution 7: VS Code Settings
console.log("\n--- VS Code Settings ---");

const vscodeSettings = {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
};

console.log("VS Code settings:", JSON.stringify(vscodeSettings, null, 2));

// Solution 8: Pre-commit Hooks
console.log("\n--- Pre-commit Hooks ---");

/*
Install husky and lint-staged:
npm install -D husky lint-staged

package.json:
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.ts": [
            "eslint --fix",
            "prettier --write"
        ]
    }
}
*/

// Solution 9: Example Code (Properly Formatted)
console.log("\n--- Properly Formatted Code ---");

interface User {
    id: number;
    name: string;
    email: string;
}

function createUser(name: string, email: string): User {
    return {
        id: Date.now(),
        name,
        email,
    };
}

const user = createUser("John", "john@example.com");
console.log("User:", user);

// Solution 10: Common Issues and Fixes
console.log("\n--- Common Issues ---");

/*
Issue: Conflict between ESLint and Prettier
Fix: Use eslint-config-prettier to disable conflicting rules

Issue: ESLint can't find tsconfig
Fix: Set parserOptions.project in .eslintrc

Issue: Slow linting
Fix: Use .eslintignore, enable caching with --cache

Issue: Type-aware rules slow
Fix: Use separate config for CI with type-aware rules
*/

console.log("Linting and formatting configured!");

