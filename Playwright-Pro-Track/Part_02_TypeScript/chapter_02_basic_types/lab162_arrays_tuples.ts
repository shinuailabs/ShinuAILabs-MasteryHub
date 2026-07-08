/**
 * Lab 162: Arrays and Tuples
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typed arrays and tuples:
 * 
 * - Array type syntax
 * - Generic array syntax
 * - Tuple types
 * - Readonly arrays
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create typed arrays
 * 2. Use tuple types
 * 3. Work with readonly arrays
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Array Type Syntax
console.log("--- Array Type Syntax ---");

// Type[] syntax
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

console.log("Numbers:", numbers);
console.log("Names:", names);

// Array methods are type-safe
numbers.push(6);
// numbers.push("seven"); // Error!

// Solution 2: Generic Array Syntax
console.log("\n--- Generic Array Syntax ---");

// Array<Type> syntax
let scores: Array<number> = [90, 85, 92];
let words: Array<string> = ["hello", "world"];

console.log("Scores:", scores);
console.log("Words:", words);

// Both syntaxes are equivalent
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];

// Solution 3: Multi-dimensional Arrays
console.log("\n--- Multi-dimensional Arrays ---");

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

// Solution 4: Tuple Types
console.log("\n--- Tuple Types ---");

// Fixed-length array with specific types at each position
let tuple: [string, number] = ["age", 30];
let rgb: [number, number, number] = [255, 128, 0];
let mixed: [string, number, boolean] = ["hello", 42, true];

console.log("Tuple:", tuple);
console.log("RGB:", rgb);

// Access by index
console.log("First element:", tuple[0]); // string
console.log("Second element:", tuple[1]); // number

// Solution 5: Named Tuples
console.log("\n--- Named Tuples ---");

type Point = [x: number, y: number];
type RGB = [red: number, green: number, blue: number];

const point: Point = [10, 20];
const color: RGB = [255, 128, 64];

console.log("Point:", point);
console.log("Color:", color);

// Destructuring with names
const [x, y] = point;
console.log("X:", x, "Y:", y);

// Solution 6: Optional Tuple Elements
console.log("\n--- Optional Tuple Elements ---");

type OptionalTuple = [string, number, boolean?];

const withOptional: OptionalTuple = ["hello", 42, true];
const withoutOptional: OptionalTuple = ["hello", 42];

console.log("With optional:", withOptional);
console.log("Without optional:", withoutOptional);

// Rest elements in tuples
type StringNumberBooleans = [string, number, ...boolean[]];
const snb: StringNumberBooleans = ["hello", 42, true, false, true];

console.log("Rest tuple:", snb);

// Solution 7: Readonly Arrays
console.log("\n--- Readonly Arrays ---");

const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Error!
// readonlyNumbers[0] = 10; // Error!

// ReadonlyArray type
const readonlyNames: ReadonlyArray<string> = ["Alice", "Bob"];

// Readonly tuple
const readonlyTuple: readonly [string, number] = ["hello", 42];

console.log("Readonly array:", readonlyNumbers);

// Solution 8: Array Type Inference
console.log("\n--- Type Inference ---");

// TypeScript infers array types
const inferredNumbers = [1, 2, 3];        // number[]
const inferredStrings = ["a", "b", "c"];  // string[]
const inferredMixed = [1, "two", true];   // (string | number | boolean)[]

console.log("Inferred mixed:", inferredMixed);

// Const assertion for tuple inference
const asTuple = [1, 2, 3] as const;  // readonly [1, 2, 3]
console.log("As tuple:", asTuple);

// Solution 9: Array Methods with Types
console.log("\n--- Array Methods ---");

const nums: number[] = [1, 2, 3, 4, 5];

// map returns typed array
const doubled: number[] = nums.map(n => n * 2);
const strings: string[] = nums.map(n => n.toString());

// filter maintains type
const evens: number[] = nums.filter(n => n % 2 === 0);

// reduce with type annotation
const sum: number = nums.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Strings:", strings);
console.log("Evens:", evens);
console.log("Sum:", sum);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Function returning tuple
function getMinMax(arr: number[]): [min: number, max: number] {
    return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log("Min:", min, "Max:", max);

// Array of objects
interface User {
    name: string;
    age: number;
}

const users: User[] = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const userNames: string[] = users.map(u => u.name);
console.log("User names:", userNames);

