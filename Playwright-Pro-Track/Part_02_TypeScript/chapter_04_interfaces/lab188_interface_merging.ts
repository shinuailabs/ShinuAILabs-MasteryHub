/**
 * Lab 188: Interface Merging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Declaration merging:
 * 
 * - Same-name interfaces merge
 * - Adding to existing interfaces
 * - Module augmentation
 * - Global augmentation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Merge interface declarations
 * 2. Extend library interfaces
 * 3. Use module augmentation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interface Merging
console.log("--- Basic Merging ---");

interface User {
    id: number;
    name: string;
}

interface User {
    email: string;
}

interface User {
    age?: number;
}

// User now has all properties
const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com",
    age: 30
};

console.log("Merged user:", user);

// Solution 2: Merging with Methods
console.log("\n--- Merging Methods ---");

interface Calculator {
    add(a: number, b: number): number;
}

interface Calculator {
    subtract(a: number, b: number): number;
}

interface Calculator {
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

const calc: Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

console.log("Add:", calc.add(10, 5));
console.log("Multiply:", calc.multiply(4, 3));

// Solution 3: Merging with Overloads
console.log("\n--- Merging Overloads ---");

interface Formatter {
    format(value: string): string;
}

interface Formatter {
    format(value: number): string;
}

interface Formatter {
    format(value: Date): string;
}

const formatter: Formatter = {
    format(value: string | number | Date): string {
        if (typeof value === "string") return value.toUpperCase();
        if (typeof value === "number") return value.toFixed(2);
        return value.toISOString();
    }
};

console.log(formatter.format("hello"));
console.log(formatter.format(42.567));

// Solution 4: Extending Built-in Interfaces
console.log("\n--- Extending Built-ins ---");

// Extend Array interface
interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
}

// Implementation
Array.prototype.first = function<T>(this: T[]): T | undefined {
    return this[0];
};

Array.prototype.last = function<T>(this: T[]): T | undefined {
    return this[this.length - 1];
};

const numbers = [1, 2, 3, 4, 5];
console.log("First:", numbers.first());
console.log("Last:", numbers.last());

// Solution 5: Namespace Merging
console.log("\n--- Namespace Merging ---");

interface Config {
    host: string;
    port: number;
}

namespace Config {
    export function create(host: string, port: number): Config {
        return { host, port };
    }
    
    export const defaults: Config = {
        host: "localhost",
        port: 3000
    };
}

const config = Config.create("example.com", 8080);
console.log("Config:", config);
console.log("Defaults:", Config.defaults);

// Solution 6: Class and Interface Merging
console.log("\n--- Class Interface Merging ---");

class Point {
    x: number = 0;
    y: number = 0;
}

interface Point {
    z?: number;
    distanceTo(other: Point): number;
}

// Extend the class prototype
Point.prototype.distanceTo = function(other: Point): number {
    return Math.sqrt(
        (other.x - this.x) ** 2 + 
        (other.y - this.y) ** 2
    );
};

const p1 = new Point();
p1.x = 0;
p1.y = 0;

const p2 = new Point();
p2.x = 3;
p2.y = 4;

console.log("Distance:", p1.distanceTo(p2));

// Solution 7: Module Augmentation Pattern
console.log("\n--- Module Augmentation ---");

// Original module (simulated)
const originalModule = {
    greet(name: string): string {
        return `Hello, ${name}!`;
    }
};

// Augmented interface
interface AugmentedModule {
    greet(name: string): string;
    farewell(name: string): string;
}

// Add new functionality
const augmentedModule: AugmentedModule = {
    ...originalModule,
    farewell(name: string): string {
        return `Goodbye, ${name}!`;
    }
};

console.log(augmentedModule.greet("World"));
console.log(augmentedModule.farewell("World"));

// Solution 8: Practical Example - Express-like
console.log("\n--- Practical Example ---");

interface Request {
    url: string;
    method: string;
}

interface Request {
    body?: unknown;
    params?: Record<string, string>;
}

interface Request {
    user?: { id: number; name: string };
}

const request: Request = {
    url: "/api/users",
    method: "GET",
    params: { id: "1" },
    user: { id: 1, name: "John" }
};

console.log("Request:", request);

// Solution 9: Merging Rules
console.log("\n--- Merging Rules ---");

/*
Interface merging rules:
1. Non-function members must be unique or identical
2. Function members become overloads
3. Later declarations have higher priority for overloads
4. Cannot merge incompatible types
*/

interface Example {
    value: string;
}

// interface Example {
//     value: number; // Error: incompatible types
// }

interface Example {
    value: string; // OK: same type
    extra: number;
}

// Solution 10: When to Use Merging
console.log("\n--- When to Use ---");

/*
Use interface merging for:
1. Extending library types
2. Adding properties to global objects
3. Plugin systems
4. Polyfills

Avoid when:
1. You control the original interface
2. Type aliases would work
3. It makes code harder to understand
*/

console.log("Interface merging is powerful but use carefully!");

