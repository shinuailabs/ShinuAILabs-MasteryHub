/**
 * Lab 230: Type Guard Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for type guards:
 * 
 * - Choosing the right guard
 * - Reusable guards
 * - Performance considerations
 * - Common patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Create reusable guards
 * 3. Optimize type checking
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Choose the Right Guard
console.log("--- Choosing Guards ---");

// For primitives: typeof
function processPrimitive(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toString();
}

// For classes: instanceof
class MyClass { value = 42; }
function processClass(obj: MyClass | object): number {
    if (obj instanceof MyClass) {
        return obj.value;
    }
    return 0;
}

// For objects with properties: in
interface HasName { name: string; }
function processObject(obj: HasName | {}): string {
    if ("name" in obj) {
        return obj.name;
    }
    return "unknown";
}

console.log(processPrimitive("hello"));
console.log(processClass(new MyClass()));
console.log(processObject({ name: "John" }));

// Solution 2: Reusable Type Guards
console.log("\n--- Reusable Guards ---");

// Generic null check
function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

function isDefined<T>(value: T | null | undefined): value is T {
    return value != null;
}

// Use with filter
const values: (string | null)[] = ["a", null, "b", null];
const filtered = values.filter(isNotNull);
console.log("Filtered:", filtered);

// Solution 3: Composable Guards
console.log("\n--- Composable Guards ---");

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function hasProperty<K extends string>(
    obj: unknown,
    key: K
): obj is Record<K, unknown> {
    return isObject(obj) && key in obj;
}

function hasStringProperty<K extends string>(
    obj: unknown,
    key: K
): obj is Record<K, string> {
    return hasProperty(obj, key) && typeof obj[key] === "string";
}

const data: unknown = { name: "John", age: 30 };
if (hasStringProperty(data, "name")) {
    console.log("Name:", data.name);
}

// Solution 4: Validation Guards
console.log("\n--- Validation Guards ---");

interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(value: unknown): value is User {
    if (!isObject(value)) return false;
    if (typeof value.id !== "number") return false;
    if (typeof value.name !== "string") return false;
    if (typeof value.email !== "string") return false;
    return true;
}

const userData: unknown = { id: 1, name: "John", email: "john@example.com" };
if (isUser(userData)) {
    console.log("Valid user:", userData.name);
}

// Solution 5: Guard Factory
console.log("\n--- Guard Factory ---");

function createTypeGuard<T>(
    check: (value: unknown) => boolean
): (value: unknown) => value is T {
    return (value: unknown): value is T => check(value);
}

const isString = createTypeGuard<string>(
    (v) => typeof v === "string"
);

const isNumber = createTypeGuard<number>(
    (v) => typeof v === "number"
);

console.log("isString('hello'):", isString("hello"));
console.log("isNumber(42):", isNumber(42));

// Solution 6: Discriminated Union Guards
console.log("\n--- Discriminated Guards ---");

type Result<T> = 
    | { type: "success"; data: T }
    | { type: "error"; error: string };

function isSuccess<T>(result: Result<T>): result is { type: "success"; data: T } {
    return result.type === "success";
}

function isError<T>(result: Result<T>): result is { type: "error"; error: string } {
    return result.type === "error";
}

const result: Result<number> = { type: "success", data: 42 };
if (isSuccess(result)) {
    console.log("Data:", result.data);
}

// Solution 7: Performance Tips
console.log("\n--- Performance Tips ---");

// Prefer simple checks first
function processEfficiently(value: unknown): string {
    // Fast checks first
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    
    // Expensive checks last
    if (Array.isArray(value)) return "array";
    if (isObject(value)) return "object";
    
    return "unknown";
}

console.log(processEfficiently("hello"));
console.log(processEfficiently([1, 2, 3]));

// Solution 8: Error Handling Guards
console.log("\n--- Error Handling ---");

function isError(value: unknown): value is Error {
    return value instanceof Error;
}

function getErrorMessage(error: unknown): string {
    if (isError(error)) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "Unknown error";
}

try {
    throw new Error("Something went wrong");
} catch (e) {
    console.log("Error:", getErrorMessage(e));
}

// Solution 9: Summary
console.log("\n--- Best Practices Summary ---");
const practices = [
    "✓ Use typeof for primitives",
    "✓ Use instanceof for classes",
    "✓ Use 'in' for object properties",
    "✓ Create reusable type guards",
    "✓ Compose guards for complex types",
    "✓ Use discriminated unions when possible",
    "✓ Put fast checks before slow ones",
    "✓ Document complex type guards",
    "✓ Test type guards thoroughly",
    "✓ Consider assertion functions for validation"
];

practices.forEach(p => console.log(p));

