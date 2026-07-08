/**
 * Lab 164: Any and Unknown Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Special types for flexibility:
 * 
 * - any: Opt out of type checking
 * - unknown: Type-safe any
 * - When to use each
 * - Type narrowing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand any vs unknown
 * 2. Use type narrowing
 * 3. Avoid any when possible
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: The any Type
console.log("--- The any Type ---");

let anyValue: any = "hello";
anyValue = 42;
anyValue = { key: "value" };
anyValue = [1, 2, 3];

// No type checking - dangerous!
console.log(anyValue.nonExistentMethod); // undefined, no error
console.log(anyValue.length); // Works if it has length

// any disables all type checking
let num: number = anyValue; // No error, but might fail at runtime

// Solution 2: The unknown Type
console.log("\n--- The unknown Type ---");

let unknownValue: unknown = "hello";
unknownValue = 42;
unknownValue = { key: "value" };

// Cannot use unknown directly
// let str: string = unknownValue; // Error!
// unknownValue.length; // Error!

// Must narrow the type first
if (typeof unknownValue === "string") {
    console.log("String length:", unknownValue.length);
}

// Solution 3: Type Narrowing with unknown
console.log("\n--- Type Narrowing ---");

function processValue(value: unknown): string {
    // typeof narrowing
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    
    if (typeof value === "number") {
        return value.toFixed(2);
    }
    
    if (typeof value === "boolean") {
        return value ? "yes" : "no";
    }
    
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    
    if (value !== null && typeof value === "object") {
        return JSON.stringify(value);
    }
    
    return String(value);
}

console.log(processValue("hello"));
console.log(processValue(42.5));
console.log(processValue([1, 2, 3]));

// Solution 4: Type Guards
console.log("\n--- Type Guards ---");

interface User {
    name: string;
    email: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "email" in value
    );
}

function greetUser(value: unknown): string {
    if (isUser(value)) {
        return `Hello, ${value.name}!`;
    }
    return "Hello, stranger!";
}

console.log(greetUser({ name: "John", email: "john@example.com" }));
console.log(greetUser("not a user"));

// Solution 5: any vs unknown Comparison
console.log("\n--- any vs unknown ---");

// any - no type safety
function dangerousFunction(data: any): void {
    // All of these compile but might fail at runtime
    data.foo();
    data.bar.baz;
    data[0].something;
}

// unknown - type safe
function safeFunction(data: unknown): void {
    // Must check before using
    if (typeof data === "object" && data !== null) {
        if ("foo" in data && typeof (data as any).foo === "function") {
            (data as { foo: () => void }).foo();
        }
    }
}

// Solution 6: When to Use any
console.log("\n--- When to Use any ---");

/*
Use any sparingly:
1. Migrating JavaScript to TypeScript
2. Working with truly dynamic data
3. Third-party libraries without types
4. Prototyping (replace later)

Better alternatives:
- unknown for values of unknown type
- Generics for flexible but type-safe code
- Union types for multiple known types
*/

// Migration example
function legacyFunction(data: any): any {
    // TODO: Add proper types
    return data.process();
}

// Solution 7: Assertion Functions
console.log("\n--- Assertion Functions ---");

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value is not a string");
    }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined");
    }
}

let maybeString: unknown = "hello";
assertIsString(maybeString);
// Now TypeScript knows maybeString is a string
console.log("Asserted string:", maybeString.toUpperCase());

// Solution 8: unknown in Function Parameters
console.log("\n--- Function Parameters ---");

// Prefer unknown over any for function parameters
function safeJsonParse(json: string): unknown {
    return JSON.parse(json);
}

const parsed = safeJsonParse('{"name": "John"}');
// Must narrow before using
if (typeof parsed === "object" && parsed !== null && "name" in parsed) {
    console.log("Parsed name:", (parsed as { name: string }).name);
}

// Solution 9: unknown in Error Handling
console.log("\n--- Error Handling ---");

function handleError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    
    if (typeof error === "string") {
        return error;
    }
    
    return "Unknown error occurred";
}

try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log("Error:", handleError(error));
}

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

/*
1. Avoid any - use unknown instead
2. Always narrow unknown before using
3. Use type guards for complex narrowing
4. Use assertion functions for validation
5. Enable noImplicitAny in tsconfig
6. Use generics for flexible type-safe code
*/

// Good pattern: Generic with constraint
function processData<T extends { id: number }>(data: T): number {
    return data.id;
}

console.log(processData({ id: 1, name: "test" }));

// Summary
console.log("\nSummary:");
console.log("- any: No type checking (avoid)");
console.log("- unknown: Type-safe, requires narrowing");
console.log("- Use type guards and assertions");

