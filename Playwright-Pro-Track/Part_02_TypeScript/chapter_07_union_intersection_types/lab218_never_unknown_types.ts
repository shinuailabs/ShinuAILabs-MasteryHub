/**
 * Lab 218: Never and Unknown Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Special TypeScript types:
 * 
 * - never type
 * - unknown type
 * - void type
 * - Type hierarchy
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use never type
 * 2. Work with unknown
 * 3. Understand type hierarchy
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: The never Type
console.log("--- never Type ---");

// Function that never returns
function throwError(message: string): never {
    throw new Error(message);
}

// Infinite loop
function infiniteLoop(): never {
    while (true) {
        // Never exits
    }
}

// Exhaustive checking
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
    switch (shape) {
        case "circle":
            return Math.PI;
        case "square":
            return 1;
        default:
            // If all cases handled, shape is never
            const _exhaustive: never = shape;
            return _exhaustive;
    }
}

console.log("Area:", getArea("circle"));

// Solution 2: never in Conditional Types
console.log("\n--- never in Conditionals ---");

// Filter out types
type NonString<T> = T extends string ? never : T;
type NonNull<T> = T extends null | undefined ? never : T;

type Test1 = NonString<string | number | boolean>;  // number | boolean
type Test2 = NonNull<string | null | undefined>;    // string

// Extract specific types
type ExtractString<T> = T extends string ? T : never;
type OnlyStrings = ExtractString<string | number | "hello">;  // string | "hello"

// Solution 3: The unknown Type
console.log("\n--- unknown Type ---");

let value: unknown;

value = "hello";
value = 42;
value = { name: "John" };

// Cannot use unknown directly
// console.log(value.name); // Error

// Must narrow first
if (typeof value === "object" && value !== null && "name" in value) {
    console.log("Name:", (value as { name: string }).name);
}

// Solution 4: unknown vs any
console.log("\n--- unknown vs any ---");

let anyValue: any = "hello";
let unknownValue: unknown = "hello";

// any allows anything (unsafe)
console.log(anyValue.toUpperCase());  // Works but unsafe

// unknown requires checking (safe)
if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase());  // Safe
}

// Solution 5: Type Guards with unknown
console.log("\n--- Type Guards ---");

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function processUnknown(value: unknown): string {
    if (isString(value)) {
        return value.toUpperCase();
    }
    if (isNumber(value)) {
        return value.toFixed(2);
    }
    if (isObject(value)) {
        return JSON.stringify(value);
    }
    return String(value);
}

console.log(processUnknown("hello"));
console.log(processUnknown(42.5));
console.log(processUnknown({ a: 1 }));

// Solution 6: void Type
console.log("\n--- void Type ---");

function logMessage(message: string): void {
    console.log(message);
    // No return value
}

// void vs undefined
let voidValue: void = undefined;
// let voidValue2: void = null; // Error in strict mode

// Callback with void return
type VoidCallback = () => void;

const callbacks: VoidCallback[] = [];
callbacks.push(() => console.log("Callback 1"));
callbacks.push(() => { return 42; });  // OK! void ignores return

logMessage("Hello");

// Solution 7: Type Hierarchy
console.log("\n--- Type Hierarchy ---");

// Top types: unknown, any
// Bottom type: never

// unknown is the top type
type UnknownSuper = string extends unknown ? true : false;  // true

// never is the bottom type
type NeverSub = never extends string ? true : false;  // true

// any bypasses type checking
type AnyWeird = any extends string ? true : false;  // boolean (both!)

// Solution 8: Practical unknown Usage
console.log("\n--- Practical unknown ---");

// Safe JSON parsing
function safeJsonParse(json: string): unknown {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

interface User {
    id: number;
    name: string;
}

function isUser(value: unknown): value is User {
    return (
        isObject(value) &&
        typeof (value as User).id === "number" &&
        typeof (value as User).name === "string"
    );
}

const parsed = safeJsonParse('{"id": 1, "name": "John"}');
if (isUser(parsed)) {
    console.log("User:", parsed.name);
}

// Solution 9: Assertion Functions
console.log("\n--- Assertion Functions ---");

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Expected string");
    }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Expected defined value");
    }
}

const maybeString: unknown = "hello";
assertIsString(maybeString);
console.log(maybeString.toUpperCase());  // TypeScript knows it's string

// Solution 10: Error Handling
console.log("\n--- Error Handling ---");

function handleError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "Unknown error";
}

try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log("Error:", handleError(error));
}

try {
    throw "String error";
} catch (error) {
    console.log("Error:", handleError(error));
}

