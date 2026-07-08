/**
 * Lab 243: Default Exports
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Default exports in TypeScript:
 * 
 * - export default syntax
 * - When to use
 * - Importing defaults
 * - Trade-offs
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create default exports
 * 2. Import default exports
 * 3. Understand trade-offs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Default Export Class
console.log("--- Default Export Class ---");

// In Logger.ts:
// export default class Logger {
//     log(message: string): void {
//         console.log(`[LOG] ${message}`);
//     }
// }

class Logger {
    private prefix: string;
    
    constructor(prefix: string = "LOG") {
        this.prefix = prefix;
    }
    
    log(message: string): void {
        console.log(`[${this.prefix}] ${message}`);
    }
}

// export default Logger;

const logger = new Logger();
logger.log("Hello from default export");

// Solution 2: Default Export Function
console.log("\n--- Default Export Function ---");

// In greet.ts:
// export default function greet(name: string): string {
//     return `Hello, ${name}!`;
// }

function greet(name: string): string {
    return `Hello, ${name}!`;
}

// export default greet;

console.log(greet("World"));

// Solution 3: Default Export Object
console.log("\n--- Default Export Object ---");

// In config.ts:
// export default {
//     apiUrl: 'https://api.example.com',
//     timeout: 5000
// };

const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3
};

// export default config;

console.log("Config:", config);

// Solution 4: Importing Default Exports
console.log("\n--- Importing Defaults ---");

// Import with any name
// import Logger from './Logger';
// import MyLogger from './Logger';  // Same thing, different name

// Import default and named
// import Logger, { LogLevel } from './Logger';

// Import default as named
// import { default as Logger } from './Logger';

console.log("Import syntax demonstrated");

// Solution 5: Anonymous Default Exports
console.log("\n--- Anonymous Defaults ---");

// Can export anonymous
// export default function(x: number): number {
//     return x * 2;
// }

// export default class {
//     value = 42;
// }

// Not recommended - harder to debug
const anonymousFunc = function(x: number): number {
    return x * 2;
};

console.log("Anonymous result:", anonymousFunc(5));

// Solution 6: Default vs Named
console.log("\n--- Default vs Named ---");

// Default export:
// - One per module
// - Import with any name
// - Good for main export

// Named export:
// - Multiple per module
// - Must use exact name (or rename)
// - Good for utilities

// Example module structure:
// UserService.ts - default export (main class)
// utils.ts - named exports (multiple functions)

console.log("Comparison explained");

// Solution 7: Combined Exports
console.log("\n--- Combined Exports ---");

// In api.ts:
// export default class ApiClient { ... }
// export interface ApiConfig { ... }
// export type ApiResponse<T> = { data: T; status: number };

class ApiClient {
    constructor(private baseUrl: string) {}
    
    async get(path: string): Promise<unknown> {
        console.log(`GET ${this.baseUrl}${path}`);
        return {};
    }
}

interface ApiConfig {
    baseUrl: string;
    timeout: number;
}

type ApiResponse<T> = {
    data: T;
    status: number;
};

// export default ApiClient;
// export { ApiConfig, ApiResponse };

const client = new ApiClient("https://api.example.com");
client.get("/users");

// Solution 8: Re-exporting Defaults
console.log("\n--- Re-exporting Defaults ---");

// In index.ts:
// export { default } from './Logger';
// export { default as Logger } from './Logger';

// Re-export default as named
// export { default as ApiClient } from './ApiClient';

console.log("Re-export patterns shown");

// Solution 9: When to Use Default Exports
console.log("\n--- When to Use ---");

const useDefault = [
    "✓ Single main export per file",
    "✓ React components",
    "✓ Main class of a module",
    "✓ Configuration objects"
];

const avoidDefault = [
    "✗ Multiple related exports",
    "✗ Utility functions",
    "✗ Constants and enums",
    "✗ When refactoring is common"
];

console.log("Use default exports for:");
useDefault.forEach(u => console.log(u));

console.log("\nAvoid default exports for:");
avoidDefault.forEach(a => console.log(a));

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "1. One default export per module",
    "2. Name should match filename",
    "3. Prefer named exports for libraries",
    "4. Use default for React components",
    "5. Combine with named exports when needed",
    "6. Avoid anonymous default exports",
    "7. Be consistent across project"
];

practices.forEach(p => console.log(p));

// Example of good default export
class UserService {
    private users: Map<number, { name: string }> = new Map();
    
    create(name: string): number {
        const id = this.users.size + 1;
        this.users.set(id, { name });
        return id;
    }
    
    get(id: number): { name: string } | undefined {
        return this.users.get(id);
    }
}

// export default UserService;

const userService = new UserService();
const userId = userService.create("John");
console.log("Created user:", userId);

