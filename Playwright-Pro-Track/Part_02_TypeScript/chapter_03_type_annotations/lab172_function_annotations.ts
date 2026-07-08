/**
 * Lab 172: Function Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing functions in TypeScript:
 * 
 * - Parameter types
 * - Return types
 * - Optional parameters
 * - Function types
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Annotate function parameters
 * 2. Specify return types
 * 3. Use function type expressions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Function Annotations
console.log("--- Basic Function Annotations ---");

// Parameter and return type annotations
function add(a: number, b: number): number {
    return a + b;
}

function greet(name: string): string {
    return `Hello, ${name}!`;
}

function isEven(num: number): boolean {
    return num % 2 === 0;
}

console.log("Add:", add(5, 3));
console.log("Greet:", greet("World"));
console.log("Is 4 even:", isEven(4));

// Solution 2: Optional Parameters
console.log("\n--- Optional Parameters ---");

function createUser(name: string, age?: number): object {
    return { name, age: age ?? "unknown" };
}

function formatName(first: string, last?: string): string {
    return last ? `${first} ${last}` : first;
}

console.log(createUser("John"));
console.log(createUser("Jane", 25));
console.log(formatName("John"));
console.log(formatName("John", "Doe"));

// Solution 3: Default Parameters
console.log("\n--- Default Parameters ---");

function greetWithDefault(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

function createConfig(
    host: string = "localhost",
    port: number = 3000
): { host: string; port: number } {
    return { host, port };
}

console.log(greetWithDefault("World"));
console.log(greetWithDefault("World", "Hi"));
console.log(createConfig());
console.log(createConfig("example.com", 8080));

// Solution 4: Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}

function joinStrings(separator: string, ...strings: string[]): string {
    return strings.join(separator);
}

console.log("Sum:", sum(1, 2, 3, 4, 5));
console.log("Join:", joinStrings("-", "a", "b", "c"));

// Solution 5: Function Type Expressions
console.log("\n--- Function Type Expressions ---");

// Type alias for function
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
const divide: MathOperation = (a, b) => a / b;

console.log("Multiply:", multiply(4, 5));
console.log("Divide:", divide(20, 4));

// Callback type
type Callback = (result: string) => void;

function processData(data: string, callback: Callback): void {
    const result = data.toUpperCase();
    callback(result);
}

processData("hello", (result) => console.log("Processed:", result));

// Solution 6: Arrow Function Annotations
console.log("\n--- Arrow Functions ---");

// Inline annotation
const square = (n: number): number => n * n;

// With type alias
type StringTransformer = (s: string) => string;
const toUpper: StringTransformer = (s) => s.toUpperCase();
const toLower: StringTransformer = (s) => s.toLowerCase();

console.log("Square:", square(5));
console.log("Upper:", toUpper("hello"));

// Solution 7: Void Return Type
console.log("\n--- Void Return Type ---");

function logMessage(message: string): void {
    console.log(`[LOG] ${message}`);
}

function printUser(user: { name: string }): void {
    console.log(`User: ${user.name}`);
}

logMessage("Test message");
printUser({ name: "John" });

// Solution 8: Never Return Type
console.log("\n--- Never Return Type ---");

function throwError(message: string): never {
    throw new Error(message);
}

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

// Used in exhaustive checks
type Status = "pending" | "active";

function handleStatus(status: Status): string {
    switch (status) {
        case "pending":
            return "Waiting...";
        case "active":
            return "Running";
        default:
            return assertNever(status);
    }
}

console.log(handleStatus("active"));

// Solution 9: Overloaded Functions
console.log("\n--- Function Overloads ---");

// Overload signatures
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;

// Implementation
function format(value: string | number | Date): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    if (typeof value === "number") {
        return value.toFixed(2);
    }
    return value.toISOString();
}

console.log(format("hello"));
console.log(format(42.567));
console.log(format(new Date()));

// Solution 10: Generic Functions
console.log("\n--- Generic Functions ---");

function identity<T>(value: T): T {
    return value;
}

function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

console.log(identity("hello"));
console.log(identity(42));
console.log(firstElement([1, 2, 3]));
console.log(map([1, 2, 3], n => n * 2));

