/**
 * Lab 203: Generic Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Functions with type parameters:
 * 
 * - Generic function syntax
 * - Type inference
 * - Multiple type parameters
 * - Constraints
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic functions
 * 2. Use type inference
 * 3. Apply constraints
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Generic Function
console.log("--- Basic Generic Function ---");

function identity<T>(value: T): T {
    return value;
}

// Explicit type argument
const str = identity<string>("hello");
// Type inference
const num = identity(42);

console.log("String:", str);
console.log("Number:", num);

// Solution 2: Multiple Type Parameters
console.log("\n--- Multiple Type Parameters ---");

function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

const p = pair("age", 30);
const swapped = swap(p);

console.log("Pair:", p);
console.log("Swapped:", swapped);

// Solution 3: Generic Array Functions
console.log("\n--- Array Functions ---");

function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

console.log("First:", first([1, 2, 3]));
console.log("Last:", last(["a", "b", "c"]));
console.log("Map:", map([1, 2, 3], n => n * 2));

// Solution 4: Constrained Generics
console.log("\n--- Constrained Generics ---");

interface HasLength {
    length: number;
}

function logLength<T extends HasLength>(item: T): T {
    console.log("Length:", item.length);
    return item;
}

logLength("hello");
logLength([1, 2, 3]);
logLength({ length: 10, value: "test" });

// Solution 5: keyof Constraint
console.log("\n--- keyof Constraint ---");

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "John", age: 30, email: "john@example.com" };

console.log("Name:", getProperty(user, "name"));
console.log("Age:", getProperty(user, "age"));

// Solution 6: Generic with Default Type
console.log("\n--- Default Type ---");

function createArray<T = string>(length: number, value: T): T[] {
    return Array(length).fill(value);
}

const strings = createArray(3, "hello");
const numbers = createArray<number>(3, 42);

console.log("Strings:", strings);
console.log("Numbers:", numbers);

// Solution 7: Generic Callback Functions
console.log("\n--- Callback Functions ---");

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    return arr.filter(predicate);
}

function reduce<T, U>(arr: T[], fn: (acc: U, item: T) => U, initial: U): U {
    return arr.reduce(fn, initial);
}

const evens = filter([1, 2, 3, 4, 5], n => n % 2 === 0);
const sum = reduce([1, 2, 3, 4, 5], (acc, n) => acc + n, 0);

console.log("Evens:", evens);
console.log("Sum:", sum);

// Solution 8: Generic Factory Function
console.log("\n--- Factory Function ---");

function create<T>(ctor: new () => T): T {
    return new ctor();
}

class MyClass {
    value = "Hello from MyClass";
}

const instance = create(MyClass);
console.log("Instance:", instance.value);

// Solution 9: Conditional Return Types
console.log("\n--- Conditional Returns ---");

function process<T extends string | number>(value: T): T extends string ? string : number {
    if (typeof value === "string") {
        return value.toUpperCase() as any;
    }
    return (value * 2) as any;
}

console.log("Process string:", process("hello"));
console.log("Process number:", process(21));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

async function fetchData<T>(url: string): Promise<T> {
    // Simulated fetch
    console.log(`Fetching from ${url}`);
    return {} as T;
}

interface User {
    id: number;
    name: string;
}

// Type-safe API calls
fetchData<User>("/api/user/1").then(user => {
    console.log("Fetched user type-safely");
});

