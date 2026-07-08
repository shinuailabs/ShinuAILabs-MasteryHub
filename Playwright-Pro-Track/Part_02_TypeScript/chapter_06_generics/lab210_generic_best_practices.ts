/**
 * Lab 210: Generic Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for generics:
 * 
 * - When to use generics
 * - Naming conventions
 * - Constraint patterns
 * - Common pitfalls
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply generic best practices
 * 2. Avoid common mistakes
 * 3. Write maintainable generics
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Use Descriptive Type Names
console.log("--- Descriptive Names ---");

// Bad: Single letter for complex types
// function process<T, U, V>(a: T, b: U): V { ... }

// Good: Descriptive names
function transform<TInput, TOutput>(
    input: TInput,
    transformer: (item: TInput) => TOutput
): TOutput {
    return transformer(input);
}

// Common conventions
// T - Type
// K - Key
// V - Value
// E - Element
// R - Return

console.log(transform("hello", s => s.length));

// Solution 2: Use Constraints Appropriately
console.log("\n--- Appropriate Constraints ---");

// Bad: Too loose
function badLength<T>(item: T): number {
    // return item.length; // Error: T doesn't have length
    return 0;
}

// Good: Proper constraint
function goodLength<T extends { length: number }>(item: T): number {
    return item.length;
}

console.log(goodLength("hello"));
console.log(goodLength([1, 2, 3]));

// Solution 3: Don't Overuse Generics
console.log("\n--- Don't Overuse ---");

// Bad: Unnecessary generic
function badGreet<T extends string>(name: T): string {
    return `Hello, ${name}`;
}

// Good: Simple parameter
function goodGreet(name: string): string {
    return `Hello, ${name}`;
}

console.log(goodGreet("World"));

// Solution 4: Use Generic Defaults
console.log("\n--- Generic Defaults ---");

interface ApiResponse<T = unknown> {
    data: T;
    status: number;
}

// Can use without specifying type
const response1: ApiResponse = { data: "anything", status: 200 };

// Or with specific type
const response2: ApiResponse<{ id: number }> = { 
    data: { id: 1 }, 
    status: 200 
};

console.log("Response:", response1);

// Solution 5: Prefer Interfaces for Object Generics
console.log("\n--- Interface vs Type ---");

// Good: Interface for object shapes
interface Repository<T> {
    find(id: number): T | null;
    save(item: T): T;
}

// Good: Type for unions and utilities
type Nullable<T> = T | null;
type AsyncResult<T> = Promise<T> | T;

// Solution 6: Use Utility Types
console.log("\n--- Use Utility Types ---");

interface User {
    id: number;
    name: string;
    email: string;
}

// Good: Use built-in utilities
type PartialUser = Partial<User>;
type UserWithoutId = Omit<User, "id">;
type ReadonlyUser = Readonly<User>;

// Instead of recreating them
// type MyPartial<T> = { [K in keyof T]?: T[K] };

// Solution 7: Avoid Excessive Nesting
console.log("\n--- Avoid Nesting ---");

// Bad: Hard to read
// type Complex<T> = Promise<Array<Partial<Readonly<T>>>>;

// Good: Break into named types
type ReadonlyPartial<T> = Readonly<Partial<T>>;
type AsyncArray<T> = Promise<T[]>;

// Solution 8: Document Complex Generics
console.log("\n--- Document Generics ---");

/**
 * Maps object values through a transformer function
 * @template T - The input object type
 * @template U - The output value type
 * @param obj - Object to transform
 * @param fn - Transformation function
 * @returns New object with transformed values
 */
function mapValues<T extends object, U>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
    const result = {} as Record<keyof T, U>;
    for (const key in obj) {
        result[key] = fn(obj[key], key);
    }
    return result;
}

const doubled = mapValues({ a: 1, b: 2 }, v => (v as number) * 2);
console.log("Doubled:", doubled);

// Solution 9: Type Inference Guidelines
console.log("\n--- Type Inference ---");

// Let TypeScript infer when possible
const numbers = [1, 2, 3].map(n => n * 2);  // number[] inferred

// Specify when inference fails
const emptyArray: number[] = [];

// Use explicit types for public APIs
function createUser(name: string): User {
    return { id: Date.now(), name, email: "" };
}

// Solution 10: Common Patterns
console.log("\n--- Common Patterns ---");

// Factory pattern
function createFactory<T>(ctor: new () => T): () => T {
    return () => new ctor();
}

// Builder pattern
class Builder<T extends object> {
    private obj: Partial<T> = {};
    
    set<K extends keyof T>(key: K, value: T[K]): this {
        this.obj[key] = value;
        return this;
    }
    
    build(): T {
        return this.obj as T;
    }
}

// Event emitter pattern
type EventMap = Record<string, unknown[]>;

interface TypedEmitter<T extends EventMap> {
    on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void;
    emit<K extends keyof T>(event: K, ...args: T[K]): void;
}

// Summary
console.log("\n--- Best Practices Summary ---");
const practices = [
    "✓ Use descriptive type parameter names",
    "✓ Apply appropriate constraints",
    "✓ Don't overuse generics",
    "✓ Use generic defaults",
    "✓ Prefer interfaces for objects",
    "✓ Use built-in utility types",
    "✓ Avoid excessive nesting",
    "✓ Document complex generics",
    "✓ Let TypeScript infer when possible",
    "✓ Follow common patterns"
];

practices.forEach(p => console.log(p));

