/**
 * Lab 225: Assertion Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Functions that assert types:
 * 
 * - asserts keyword
 * - Throwing assertions
 * - Narrowing after assertion
 * - Validation patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create assertion functions
 * 2. Use asserts keyword
 * 3. Build validation assertions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Assertion Function
console.log("--- Basic Assertion ---");

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error(`Expected string, got ${typeof value}`);
    }
}

function assertIsNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
    }
}

const input: unknown = "hello";
assertIsString(input);
console.log(input.toUpperCase()); // TypeScript knows it's string

// Solution 2: Non-null Assertion
console.log("\n--- Non-null Assertion ---");

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value must be defined");
    }
}

function assertNotNull<T>(value: T | null): asserts value is T {
    if (value === null) {
        throw new Error("Value must not be null");
    }
}

const maybeValue: string | null = "hello";
assertNotNull(maybeValue);
console.log(maybeValue.length); // Safe to use

// Solution 3: Object Shape Assertion
console.log("\n--- Object Assertion ---");

interface User {
    id: number;
    name: string;
    email: string;
}

function assertIsUser(value: unknown): asserts value is User {
    if (typeof value !== "object" || value === null) {
        throw new Error("Expected object");
    }
    
    const obj = value as Record<string, unknown>;
    
    if (typeof obj.id !== "number") {
        throw new Error("Expected id to be number");
    }
    if (typeof obj.name !== "string") {
        throw new Error("Expected name to be string");
    }
    if (typeof obj.email !== "string") {
        throw new Error("Expected email to be string");
    }
}

const data: unknown = { id: 1, name: "John", email: "john@example.com" };
assertIsUser(data);
console.log(`User: ${data.name}`);

// Solution 4: Array Assertion
console.log("\n--- Array Assertion ---");

function assertIsArray<T>(value: unknown): asserts value is T[] {
    if (!Array.isArray(value)) {
        throw new Error("Expected array");
    }
}

function assertIsStringArray(value: unknown): asserts value is string[] {
    assertIsArray(value);
    if (!value.every(item => typeof item === "string")) {
        throw new Error("Expected string array");
    }
}

const arr: unknown = ["a", "b", "c"];
assertIsStringArray(arr);
console.log(arr.join(", "));

// Solution 5: Condition Assertion
console.log("\n--- Condition Assertion ---");

function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message ?? "Assertion failed");
    }
}

function assertNever(value: never, message?: string): never {
    throw new Error(message ?? `Unexpected value: ${value}`);
}

const num = 42;
assert(num > 0, "Number must be positive");
console.log("Number is positive:", num);

// Solution 6: Type Narrowing Assertion
console.log("\n--- Type Narrowing ---");

type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function assertIsCircle(shape: Shape): asserts shape is Circle {
    if (shape.kind !== "circle") {
        throw new Error("Expected circle");
    }
}

function assertIsRectangle(shape: Shape): asserts shape is Rectangle {
    if (shape.kind !== "rectangle") {
        throw new Error("Expected rectangle");
    }
}

const shape: Shape = { kind: "circle", radius: 5 };
assertIsCircle(shape);
console.log("Radius:", shape.radius);

// Solution 7: Validation Chain
console.log("\n--- Validation Chain ---");

interface FormData {
    username: string;
    password: string;
    age: number;
}

function assertValidUsername(value: unknown): asserts value is string {
    assertIsString(value);
    if (value.length < 3) {
        throw new Error("Username must be at least 3 characters");
    }
}

function assertValidPassword(value: unknown): asserts value is string {
    assertIsString(value);
    if (value.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }
}

function assertValidAge(value: unknown): asserts value is number {
    assertIsNumber(value);
    if (value < 0 || value > 150) {
        throw new Error("Age must be between 0 and 150");
    }
}

function validateForm(data: unknown): asserts data is FormData {
    if (typeof data !== "object" || data === null) {
        throw new Error("Expected object");
    }
    
    const obj = data as Record<string, unknown>;
    assertValidUsername(obj.username);
    assertValidPassword(obj.password);
    assertValidAge(obj.age);
}

const formData: unknown = { username: "john", password: "secret123", age: 30 };
validateForm(formData);
console.log("Valid form:", formData.username);

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

function assertSuccess<T>(
    response: ApiResponse<T>
): asserts response is ApiResponse<T> & { success: true; data: T } {
    if (!response.success) {
        throw new Error(response.error ?? "Request failed");
    }
    if (response.data === undefined) {
        throw new Error("No data in response");
    }
}

async function fetchUser(id: number): Promise<User> {
    const response: ApiResponse<User> = {
        success: true,
        data: { id, name: "John", email: "john@example.com" }
    };
    
    assertSuccess(response);
    return response.data; // TypeScript knows data exists
}

fetchUser(1).then(user => console.log("Fetched:", user.name));

