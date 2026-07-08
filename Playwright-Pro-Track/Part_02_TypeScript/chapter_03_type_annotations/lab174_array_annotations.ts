/**
 * Lab 174: Array Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing arrays in TypeScript:
 * 
 * - Array syntax options
 * - Typed arrays
 * - Multi-dimensional arrays
 * - Array methods
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create typed arrays
 * 2. Use array methods with types
 * 3. Handle complex arrays
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Array Syntax
console.log("--- Basic Array Syntax ---");

// Type[] syntax
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

console.log("Numbers:", numbers);
console.log("Names:", names);

// Array<Type> syntax
let scores: Array<number> = [90, 85, 92];
let words: Array<string> = ["hello", "world"];

console.log("Scores:", scores);

// Solution 2: Array of Objects
console.log("\n--- Array of Objects ---");

type User = {
    id: number;
    name: string;
    email: string;
};

let users: User[] = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" }
];

console.log("Users:", users);

// Inline object array type
let products: { name: string; price: number }[] = [
    { name: "Widget", price: 9.99 },
    { name: "Gadget", price: 19.99 }
];

console.log("Products:", products);

// Solution 3: Multi-dimensional Arrays
console.log("\n--- Multi-dimensional Arrays ---");

// 2D array
let matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log("Matrix:", matrix);
console.log("Element [1][1]:", matrix[1][1]);

// 3D array
let cube: number[][][] = [
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]]
];

// Array of arrays with different types
let mixed: (string | number)[][] = [
    ["a", 1],
    ["b", 2]
];

// Solution 4: Readonly Arrays
console.log("\n--- Readonly Arrays ---");

const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Error!
// readonlyNumbers[0] = 10; // Error!

const readonlyUsers: ReadonlyArray<User> = users;
// readonlyUsers.push({ id: 3, name: "New", email: "new@example.com" }); // Error!

console.log("Readonly numbers:", readonlyNumbers);

// Solution 5: Tuple Types
console.log("\n--- Tuple Types ---");

// Fixed-length array with specific types
let tuple: [string, number] = ["age", 30];
let rgb: [number, number, number] = [255, 128, 0];

console.log("Tuple:", tuple);
console.log("RGB:", rgb);

// Named tuples
type Point = [x: number, y: number];
type NameAge = [name: string, age: number];

const point: Point = [10, 20];
const person: NameAge = ["John", 30];

console.log("Point:", point);

// Solution 6: Array Methods with Types
console.log("\n--- Array Methods ---");

const nums: number[] = [1, 2, 3, 4, 5];

// map - transforms type
const doubled: number[] = nums.map(n => n * 2);
const strings: string[] = nums.map(n => n.toString());

// filter - maintains type
const evens: number[] = nums.filter(n => n % 2 === 0);

// reduce - specify accumulator type
const sum: number = nums.reduce((acc, n) => acc + n, 0);
const obj: { [key: number]: boolean } = nums.reduce(
    (acc, n) => ({ ...acc, [n]: n % 2 === 0 }),
    {}
);

console.log("Doubled:", doubled);
console.log("Strings:", strings);
console.log("Sum:", sum);

// Solution 7: Array Type Inference
console.log("\n--- Type Inference ---");

// Inferred as number[]
const inferredNumbers = [1, 2, 3];

// Inferred as (string | number)[]
const inferredMixed = [1, "two", 3];

// Inferred as { name: string }[]
const inferredObjects = [{ name: "John" }, { name: "Jane" }];

// const assertion for tuple
const asTuple = [1, 2, 3] as const; // readonly [1, 2, 3]

console.log("Inferred mixed:", inferredMixed);

// Solution 8: Generic Array Functions
console.log("\n--- Generic Array Functions ---");

function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

console.log("First:", first([1, 2, 3]));
console.log("Last:", last(["a", "b", "c"]));
console.log("Unique:", unique([1, 1, 2, 2, 3]));

// Solution 9: Array Spread and Rest
console.log("\n--- Spread and Rest ---");

const arr1: number[] = [1, 2, 3];
const arr2: number[] = [4, 5, 6];

// Spread
const combined: number[] = [...arr1, ...arr2];
console.log("Combined:", combined);

// Rest in function
function sumAll(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log("Sum all:", sumAll(1, 2, 3, 4, 5));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API response with array
type ApiResponse<T> = {
    data: T[];
    total: number;
    page: number;
};

const response: ApiResponse<User> = {
    data: users,
    total: 2,
    page: 1
};

console.log("Response data count:", response.data.length);

// Array of union types
type Status = "pending" | "active" | "completed";
const statuses: Status[] = ["pending", "active", "completed"];

// Array with optional elements
type OptionalTuple = [string, number?];
const withOptional: OptionalTuple = ["hello"];
const withBoth: OptionalTuple = ["hello", 42];

console.log("Statuses:", statuses);

