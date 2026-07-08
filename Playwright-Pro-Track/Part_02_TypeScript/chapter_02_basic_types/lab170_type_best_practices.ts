/**
 * Lab 170: Type Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for TypeScript types:
 * 
 * - Type naming conventions
 * - When to use which type
 * - Avoiding common mistakes
 * - Type organization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply naming conventions
 * 2. Choose appropriate types
 * 3. Organize types properly
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Naming Conventions
console.log("--- Naming Conventions ---");

// PascalCase for types and interfaces
type UserRole = "admin" | "user" | "guest";
interface UserProfile {
    id: number;
    name: string;
}

// Prefix interfaces with 'I' (optional, team preference)
interface IRepository<T> {
    find(id: number): T | null;
    save(item: T): void;
}

// Suffix for specific types
type UserDTO = { id: number; name: string };
type CreateUserRequest = { name: string; email: string };
type UserResponse = { user: UserProfile; token: string };

console.log("Follow consistent naming conventions");

// Solution 2: Prefer Interfaces for Objects
console.log("\n--- Interface vs Type ---");

// Use interface for object shapes
interface User {
    id: number;
    name: string;
    email: string;
}

// Use type for unions, tuples, primitives
type ID = string | number;
type Coordinates = [number, number];
type Status = "active" | "inactive";

// Interfaces can be extended
interface Admin extends User {
    permissions: string[];
}

console.log("Use interface for objects, type for unions");

// Solution 3: Avoid any
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

// Solution 4: Use Strict Null Checks
console.log("\n--- Strict Null Checks ---");

// Bad: Implicit null handling
function badGetUser(id: number): User {
    // Might return undefined but type says User
    return { id, name: "John", email: "john@example.com" };
}

// Good: Explicit null handling
function goodGetUser(id: number): User | null {
    if (id <= 0) return null;
    return { id, name: "John", email: "john@example.com" };
}

const user = goodGetUser(1);
if (user) {
    console.log("User:", user.name);
}

// Solution 5: Use Discriminated Unions
console.log("\n--- Discriminated Unions ---");

// Bad: Optional properties
interface BadResult {
    success?: boolean;
    data?: string;
    error?: string;
}

// Good: Discriminated union
type GoodResult = 
    | { success: true; data: string }
    | { success: false; error: string };

function handleResult(result: GoodResult): void {
    if (result.success) {
        console.log("Data:", result.data);
    } else {
        console.log("Error:", result.error);
    }
}

handleResult({ success: true, data: "Hello" });

// Solution 6: Prefer readonly
console.log("\n--- Prefer readonly ---");

// Immutable by default
interface Config {
    readonly host: string;
    readonly port: number;
    readonly options: Readonly<{
        timeout: number;
        retries: number;
    }>;
}

const config: Config = {
    host: "localhost",
    port: 3000,
    options: { timeout: 5000, retries: 3 }
};

// config.host = "other"; // Error!
console.log("Config:", config.host);

// Solution 7: Use Utility Types
console.log("\n--- Utility Types ---");

interface FullUser {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Pick what you need
type PublicUser = Pick<FullUser, "id" | "name" | "email">;

// Omit sensitive data
type SafeUser = Omit<FullUser, "password">;

// Make all optional for updates
type UserUpdate = Partial<FullUser>;

// Make all required
type RequiredUser = Required<Partial<FullUser>>;

console.log("Use Partial, Pick, Omit, Required");

// Solution 8: Type Organization
console.log("\n--- Type Organization ---");

/*
Organize types in dedicated files:

src/
├── types/
│   ├── index.ts      # Re-exports
│   ├── user.ts       # User-related types
│   ├── api.ts        # API types
│   └── common.ts     # Shared types
*/

// types/user.ts
export interface UserType {
    id: number;
    name: string;
}

// types/api.ts
export interface ApiResponseType<T> {
    data: T;
    status: number;
}

// types/index.ts
// export * from './user';
// export * from './api';

// Solution 9: Generic Constraints
console.log("\n--- Generic Constraints ---");

// Bad: Too permissive
function badMerge<T, U>(a: T, b: U): T & U {
    return { ...a, ...b } as T & U;
}

// Good: Constrained generics
function goodMerge<T extends object, U extends object>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const merged = goodMerge({ name: "John" }, { age: 30 });
console.log("Merged:", merged);

// Solution 10: Summary Checklist
console.log("\n--- Best Practices Checklist ---");

const checklist = [
    "✓ Use PascalCase for types/interfaces",
    "✓ Prefer interface for objects",
    "✓ Use type for unions/tuples",
    "✓ Avoid any - use unknown",
    "✓ Enable strict null checks",
    "✓ Use discriminated unions",
    "✓ Prefer readonly properties",
    "✓ Use utility types (Partial, Pick, etc.)",
    "✓ Organize types in dedicated files",
    "✓ Constrain generics appropriately"
];

checklist.forEach(item => console.log(item));

