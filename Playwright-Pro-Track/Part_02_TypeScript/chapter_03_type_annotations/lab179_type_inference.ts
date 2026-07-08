/**
 * Lab 179: Type Inference
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * How TypeScript infers types:
 * 
 * - Variable inference
 * - Return type inference
 * - Contextual typing
 * - Best common type
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand inference rules
 * 2. Know when inference works
 * 3. Override inference when needed
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Variable Inference
console.log("--- Variable Inference ---");

// TypeScript infers from initialization
let name = "John";           // string
let age = 30;                // number
let isActive = true;         // boolean
let items = [1, 2, 3];       // number[]

console.log("Types inferred from values");

// const infers literal types
const constName = "John";    // "John" (literal)
const constAge = 30;         // 30 (literal)

// Solution 2: Return Type Inference
console.log("\n--- Return Type Inference ---");

// Return type inferred from return statement
function add(a: number, b: number) {
    return a + b;  // Returns number
}

function greet(name: string) {
    return `Hello, ${name}!`;  // Returns string
}

function getUser() {
    return { name: "John", age: 30 };  // Returns { name: string; age: number }
}

console.log("Add:", add(5, 3));
console.log("Greet:", greet("World"));

// Solution 3: Contextual Typing
console.log("\n--- Contextual Typing ---");

// Parameter types inferred from context
const numbers = [1, 2, 3, 4, 5];

// n is inferred as number
const doubled = numbers.map(n => n * 2);

// item is inferred as number
numbers.forEach(item => {
    console.log("Item:", item);
});

// Event handlers (in browser)
// document.addEventListener("click", event => {
//     // event is MouseEvent
// });

// Solution 4: Best Common Type
console.log("\n--- Best Common Type ---");

// TypeScript finds best common type
let mixed = [1, 2, "three"];  // (string | number)[]

let animals = [
    { name: "Dog", legs: 4 },
    { name: "Bird", legs: 2 }
];  // { name: string; legs: number }[]

// With null
let maybeNumbers = [1, 2, null];  // (number | null)[]

console.log("Mixed:", mixed);

// Solution 5: Type Widening
console.log("\n--- Type Widening ---");

// let widens to general type
let letString = "hello";  // string

// const keeps literal
const constString = "hello";  // "hello"

// Object properties widen
const obj = { x: 10 };  // { x: number }

// Prevent widening with as const
const literalObj = { x: 10 } as const;  // { readonly x: 10 }

// Solution 6: Type Narrowing
console.log("\n--- Type Narrowing ---");

function process(value: string | number) {
    // TypeScript narrows type based on checks
    if (typeof value === "string") {
        // value is string here
        console.log("String:", value.toUpperCase());
    } else {
        // value is number here
        console.log("Number:", value.toFixed(2));
    }
}

process("hello");
process(42.5);

// Solution 7: Generic Inference
console.log("\n--- Generic Inference ---");

function identity<T>(value: T): T {
    return value;
}

// T inferred from argument
const str = identity("hello");  // string
const num = identity(42);       // number

function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

// T inferred as number
const first = firstElement([1, 2, 3]);

console.log("Identity:", str, num);
console.log("First:", first);

// Solution 8: Inference Limitations
console.log("\n--- Inference Limitations ---");

// Delayed initialization needs annotation
let laterValue: string;
laterValue = "assigned later";

// Empty arrays need annotation
let emptyArray: number[] = [];
emptyArray.push(1);

// Complex objects may need annotation
let config: { host: string; port: number };
config = { host: "localhost", port: 3000 };

// Solution 9: Inference with Destructuring
console.log("\n--- Destructuring Inference ---");

const user = { name: "John", age: 30, email: "john@example.com" };

// Types inferred from object
const { name: userName, age: userAge } = user;
// userName: string, userAge: number

const numbers2 = [1, 2, 3];
const [first2, second] = numbers2;
// first: number, second: number

console.log("Destructured:", userName, userAge);

// Solution 10: When to Override Inference
console.log("\n--- Override Inference ---");

/*
Override inference when:
1. Inference is wrong
2. You want a more specific type
3. Delayed initialization
4. Empty collections
*/

// Want union, not just string
let id: string | number = "abc";
id = 123;

// Want literal union
let status: "pending" | "active" = "pending";

// Want readonly
const readonlyArray: readonly number[] = [1, 2, 3];

// Want specific object type
interface User {
    name: string;
    age: number;
}
const typedUser: User = { name: "John", age: 30 };

console.log("Override when needed for precision");

