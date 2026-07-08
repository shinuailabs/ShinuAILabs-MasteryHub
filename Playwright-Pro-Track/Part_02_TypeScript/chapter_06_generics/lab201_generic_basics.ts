/**
 * Lab 201: Generic Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript generics:
 * 
 * - Type parameters
 * - Generic functions
 * - Type inference
 * - Why use generics
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic functions
 * 2. Understand type parameters
 * 3. Use type inference
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Why Generics?
console.log("--- Why Generics ---");

// Without generics - loses type information
function identityAny(value: any): any {
    return value;
}

// With generics - preserves type
function identity<T>(value: T): T {
    return value;
}

const str = identity<string>("hello");  // string
const num = identity<number>(42);       // number

console.log("String:", str);
console.log("Number:", num);

// Solution 2: Type Inference
console.log("\n--- Type Inference ---");

// TypeScript infers T from argument
const inferred1 = identity("hello");  // T inferred as string
const inferred2 = identity(42);       // T inferred as number
const inferred3 = identity(true);     // T inferred as boolean

console.log("Inferred types work automatically");

// Solution 3: Generic Array Functions
console.log("\n--- Array Functions ---");

function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

function reverse<T>(arr: T[]): T[] {
    return [...arr].reverse();
}

console.log("First:", first([1, 2, 3]));
console.log("Last:", last(["a", "b", "c"]));
console.log("Reverse:", reverse([1, 2, 3]));

// Solution 4: Multiple Type Parameters
console.log("\n--- Multiple Type Parameters ---");

function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

const p = pair("name", 42);
const swapped = swap(p);

console.log("Pair:", p);
console.log("Swapped:", swapped);

// Solution 5: Generic with Objects
console.log("\n--- Generic Objects ---");

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "John", age: 30, email: "john@example.com" };

console.log("Name:", getProperty(user, "name"));
console.log("Age:", getProperty(user, "age"));

// Solution 6: Generic Callbacks
console.log("\n--- Generic Callbacks ---");

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    return arr.filter(predicate);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = map(numbers, n => n * 2);
const evens = filter(numbers, n => n % 2 === 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);

// Solution 7: Generic Return Types
console.log("\n--- Generic Return Types ---");

function createArray<T>(length: number, value: T): T[] {
    return new Array(length).fill(value);
}

function wrap<T>(value: T): { value: T } {
    return { value };
}

console.log("Array:", createArray(3, "x"));
console.log("Wrapped:", wrap(42));

// Solution 8: Generic Type Aliases
console.log("\n--- Generic Type Aliases ---");

type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

const nullable: Nullable<string> = null;
const optional: Optional<number> = undefined;
const result: Result<string, Error> = { success: true, data: "Hello" };

console.log("Result:", result);

// Solution 9: Generic Utility Functions
console.log("\n--- Utility Functions ---");

function merge<T extends object, U extends object>(a: T, b: U): T & U {
    return { ...a, ...b };
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        result[key] = obj[key];
    });
    return result;
}

const merged = merge({ name: "John" }, { age: 30 });
const picked = pick(user, ["name", "email"]);

console.log("Merged:", merged);
console.log("Picked:", picked);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response wrapper
function createResponse<T>(data: T): { data: T; timestamp: Date } {
    return { data, timestamp: new Date() };
}

// Event handler
function createHandler<T>(handler: (event: T) => void): (event: T) => void {
    return (event) => {
        console.log("Handling event...");
        handler(event);
    };
}

const response = createResponse({ id: 1, name: "John" });
console.log("Response:", response);

const clickHandler = createHandler<{ x: number; y: number }>((event) => {
    console.log(`Clicked at (${event.x}, ${event.y})`);
});
clickHandler({ x: 100, y: 200 });

