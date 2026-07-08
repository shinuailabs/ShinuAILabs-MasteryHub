/**
 * Lab 180: Type Annotation Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for type annotations:
 * 
 * - When to annotate
 * - When to let inference work
 * - Consistency guidelines
 * - Common patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply annotation best practices
 * 2. Balance explicitness and inference
 * 3. Write maintainable typed code
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Let Inference Work
console.log("--- Let Inference Work ---");

// Good: Let inference work for simple cases
const name = "John";           // string inferred
const age = 30;                // number inferred
const items = [1, 2, 3];       // number[] inferred

// Bad: Redundant annotations
// const name: string = "John";  // Unnecessary

console.log("Let TypeScript infer simple types");

// Solution 2: Annotate Function Signatures
console.log("\n--- Function Signatures ---");

// Good: Annotate parameters and return types
function createUser(name: string, age: number): User {
    return { id: Date.now(), name, age };
}

// Good: Public API functions
interface User {
    id: number;
    name: string;
    age: number;
}

function getUsers(): User[] {
    return [];
}

// OK: Let inference work for simple callbacks
const doubled = [1, 2, 3].map(n => n * 2);

console.log("Annotate function signatures");

// Solution 3: Annotate When Inference Fails
console.log("\n--- When Inference Fails ---");

// Delayed initialization
let config: { host: string; port: number };
config = { host: "localhost", port: 3000 };

// Empty arrays
let numbers: number[] = [];
numbers.push(1);

// When you want a different type
let id: string | number = "abc";

console.log("Annotate when inference doesn't work");

// Solution 4: Use Type Aliases
console.log("\n--- Use Type Aliases ---");

// Good: Named types for reuse
type UserId = string | number;
type UserRole = "admin" | "user" | "guest";

interface UserProfile {
    id: UserId;
    name: string;
    role: UserRole;
}

// Bad: Inline complex types everywhere
// function getUser(): { id: string | number; name: string; role: "admin" | "user" | "guest" }

const profile: UserProfile = {
    id: 1,
    name: "John",
    role: "admin"
};

console.log("Profile:", profile);

// Solution 5: Prefer Interfaces for Objects
console.log("\n--- Interfaces for Objects ---");

// Good: Interface for object shapes
interface Product {
    id: number;
    name: string;
    price: number;
}

// Good: Type for unions, tuples, primitives
type Status = "pending" | "active" | "completed";
type Point = [number, number];

// Interfaces can be extended
interface DigitalProduct extends Product {
    downloadUrl: string;
}

// Solution 6: Avoid any
console.log("\n--- Avoid any ---");

// Bad: Using any
function badProcess(data: any): any {
    return data.value;
}

// Good: Use unknown and narrow
function goodProcess(data: unknown): string {
    if (typeof data === "object" && data !== null && "value" in data) {
        return String((data as { value: unknown }).value);
    }
    return "";
}

// Good: Use generics
function genericProcess<T extends { value: string }>(data: T): string {
    return data.value;
}

console.log(genericProcess({ value: "hello" }));

// Solution 7: Use Readonly When Appropriate
console.log("\n--- Use Readonly ---");

// Good: Immutable data
interface Config {
    readonly host: string;
    readonly port: number;
}

// Good: Readonly arrays
function processItems(items: readonly number[]): number {
    return items.reduce((a, b) => a + b, 0);
}

console.log("Sum:", processItems([1, 2, 3]));

// Solution 8: Consistent Naming
console.log("\n--- Consistent Naming ---");

/*
Naming conventions:
- PascalCase for types and interfaces
- camelCase for variables and functions
- UPPER_CASE for constants
- Prefix interfaces with 'I' (optional)
*/

type UserResponse = { user: User; token: string };
interface IRepository<T> { find(id: number): T | null; }
const MAX_RETRIES = 3;

// Solution 9: Document Complex Types
console.log("\n--- Document Types ---");

/**
 * Represents an API response
 * @template T - The type of data in the response
 */
interface ApiResponse<T> {
    /** The response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Response message */
    message: string;
}

// Solution 10: Summary Checklist
console.log("\n--- Best Practices Checklist ---");

const checklist = [
    "✓ Let inference work for simple cases",
    "✓ Annotate function parameters and returns",
    "✓ Annotate when inference fails",
    "✓ Use type aliases for complex types",
    "✓ Prefer interfaces for objects",
    "✓ Avoid any - use unknown or generics",
    "✓ Use readonly for immutable data",
    "✓ Follow consistent naming conventions",
    "✓ Document complex types",
    "✓ Keep types close to usage"
];

checklist.forEach(item => console.log(item));

