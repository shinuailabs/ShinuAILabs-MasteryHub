/**
 * Lab 190: Interface Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for interfaces:
 * 
 * - Naming conventions
 * - Interface vs type
 * - Composition patterns
 * - Documentation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply interface best practices
 * 2. Choose interface vs type
 * 3. Write maintainable interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Naming Conventions
console.log("--- Naming Conventions ---");

// PascalCase for interfaces
interface User {
    id: number;
    name: string;
}

// Optional: Prefix with 'I' (team preference)
interface IRepository<T> {
    find(id: number): T | null;
}

// Descriptive names
interface UserCreationRequest {
    name: string;
    email: string;
}

interface UserResponse {
    user: User;
    token: string;
}

console.log("Use PascalCase for interface names");

// Solution 2: Interface vs Type
console.log("\n--- Interface vs Type ---");

// Use interface for object shapes
interface Product {
    id: number;
    name: string;
    price: number;
}

// Use type for unions, tuples, primitives
type Status = "pending" | "active" | "completed";
type Point = [number, number];
type ID = string | number;

// Interface can be extended and merged
interface ExtendedProduct extends Product {
    category: string;
}

console.log("Interface for objects, type for unions");

// Solution 3: Small, Focused Interfaces
console.log("\n--- Small Interfaces ---");

// Bad: Large interface
interface BadUser {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    // ... many more properties
}

// Good: Composed interfaces
interface HasId {
    id: number;
}

interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

interface ContactInfo {
    email: string;
    phone?: string;
    address?: string;
}

interface GoodUser extends HasId, HasTimestamps {
    name: string;
    contact: ContactInfo;
}

console.log("Compose small, focused interfaces");

// Solution 4: Use Readonly Appropriately
console.log("\n--- Use Readonly ---");

// Immutable data
interface Config {
    readonly apiUrl: string;
    readonly apiKey: string;
}

// Mutable data
interface FormState {
    values: Record<string, string>;
    errors: Record<string, string>;
}

// Function parameters
function processItems(items: readonly number[]): number {
    return items.reduce((a, b) => a + b, 0);
}

console.log("Sum:", processItems([1, 2, 3]));

// Solution 5: Document Complex Interfaces
console.log("\n--- Document Interfaces ---");

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
    /** Response metadata */
    meta?: {
        /** Current page number */
        page: number;
        /** Total number of items */
        total: number;
    };
}

// Solution 6: Avoid Optional Overuse
console.log("\n--- Avoid Optional Overuse ---");

// Bad: Too many optionals
interface BadConfig {
    host?: string;
    port?: number;
    ssl?: boolean;
    timeout?: number;
}

// Good: Required with defaults or separate types
interface RequiredConfig {
    host: string;
    port: number;
}

interface OptionalConfig {
    ssl?: boolean;
    timeout?: number;
}

interface FullConfig extends RequiredConfig, OptionalConfig {}

function createConfig(
    required: RequiredConfig,
    optional: OptionalConfig = {}
): FullConfig {
    return { ...required, ...optional };
}

console.log(createConfig({ host: "localhost", port: 3000 }));

// Solution 7: Use Discriminated Unions
console.log("\n--- Discriminated Unions ---");

// Bad: Optional properties
interface BadResult {
    success?: boolean;
    data?: unknown;
    error?: string;
}

// Good: Discriminated union
interface SuccessResult<T> {
    success: true;
    data: T;
}

interface ErrorResult {
    success: false;
    error: string;
}

type Result<T> = SuccessResult<T> | ErrorResult;

function handleResult<T>(result: Result<T>): void {
    if (result.success) {
        console.log("Data:", result.data);
    } else {
        console.log("Error:", result.error);
    }
}

handleResult({ success: true, data: { id: 1 } });

// Solution 8: Consistent Method Signatures
console.log("\n--- Consistent Methods ---");

// Good: Consistent patterns
interface Repository<T> {
    find(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(item: T): Promise<T>;
    update(id: number, item: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<boolean>;
}

// Solution 9: Avoid Index Signatures When Possible
console.log("\n--- Avoid Index Signatures ---");

// Bad: Loose typing
interface LooseObject {
    [key: string]: unknown;
}

// Good: Explicit properties
interface StrictObject {
    name: string;
    age: number;
    email: string;
}

// When needed, use Record
type StringMap = Record<string, string>;

// Solution 10: Summary Checklist
console.log("\n--- Best Practices Checklist ---");

const checklist = [
    "✓ Use PascalCase for interface names",
    "✓ Use interface for objects, type for unions",
    "✓ Keep interfaces small and focused",
    "✓ Compose interfaces with extends",
    "✓ Use readonly for immutable data",
    "✓ Document complex interfaces",
    "✓ Avoid excessive optional properties",
    "✓ Use discriminated unions",
    "✓ Keep method signatures consistent",
    "✓ Prefer explicit properties over index signatures"
];

checklist.forEach(item => console.log(item));

