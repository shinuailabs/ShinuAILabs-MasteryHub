/**
 * Lab 171: Variable Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Annotating variable types:
 * 
 * - Explicit annotations
 * - Type inference
 * - When to annotate
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add type annotations
 * 2. Understand inference
 * 3. Know when to annotate
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Explicit Annotations
console.log("--- Explicit Annotations ---");

// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

console.log("Name:", name);
console.log("Age:", age);
console.log("Active:", isActive);

// Array types
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

console.log("Numbers:", numbers);

// Solution 2: Type Inference
console.log("\n--- Type Inference ---");

// TypeScript infers types from values
let inferredString = "Hello";      // string
let inferredNumber = 42;           // number
let inferredBoolean = true;        // boolean
let inferredArray = [1, 2, 3];     // number[]

console.log("Inferred string:", typeof inferredString);
console.log("Inferred number:", typeof inferredNumber);

// Inference from expressions
let sum = 10 + 20;                 // number
let greeting = "Hello " + name;   // string

// Solution 3: When to Annotate
console.log("\n--- When to Annotate ---");

// 1. Delayed initialization
let laterValue: string;
laterValue = "assigned later";
console.log("Later value:", laterValue);

// 2. Function return types
function getUser(): { name: string; age: number } {
    return { name: "John", age: 30 };
}

// 3. When inference is wrong
let id: string | number = "abc";  // Want union, not just string
id = 123;

// 4. Complex types
let config: {
    host: string;
    port: number;
    ssl?: boolean;
} = {
    host: "localhost",
    port: 3000
};

// Solution 4: Object Annotations
console.log("\n--- Object Annotations ---");

// Inline object type
let user: { name: string; age: number; email?: string } = {
    name: "John",
    age: 30
};

// With type alias
type User = {
    id: number;
    name: string;
    email: string;
};

let typedUser: User = {
    id: 1,
    name: "Jane",
    email: "jane@example.com"
};

console.log("User:", typedUser);

// Solution 5: Array Annotations
console.log("\n--- Array Annotations ---");

// Array of primitives
let scores: number[] = [90, 85, 92];
let tags: string[] = ["typescript", "javascript"];

// Array of objects
let users: User[] = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" }
];

// Generic array syntax
let items: Array<string> = ["a", "b", "c"];

console.log("Scores:", scores);
console.log("Users count:", users.length);

// Solution 6: Union Type Annotations
console.log("\n--- Union Annotations ---");

let mixedId: string | number = "abc123";
mixedId = 12345;

let nullableString: string | null = null;
nullableString = "now has value";

let optionalValue: number | undefined;
optionalValue = 42;

console.log("Mixed ID:", mixedId);
console.log("Nullable:", nullableString);

// Solution 7: Const Assertions
console.log("\n--- Const Assertions ---");

// Regular const - infers literal type for primitives
const constString = "hello";  // Type: "hello"
const constNumber = 42;       // Type: 42

// But objects/arrays are still mutable
const mutableArray = [1, 2, 3];  // number[]
mutableArray.push(4);  // OK

// as const makes everything readonly and literal
const immutableArray = [1, 2, 3] as const;  // readonly [1, 2, 3]
// immutableArray.push(4);  // Error!

const immutableObject = {
    name: "John",
    age: 30
} as const;
// immutableObject.age = 31;  // Error!

console.log("Immutable:", immutableArray);

// Solution 8: Contextual Typing
console.log("\n--- Contextual Typing ---");

// TypeScript infers types from context
const numbers2 = [1, 2, 3];

// Parameter type inferred from array type
const doubled = numbers2.map(n => n * 2);  // n is number

// Event handlers
// document.addEventListener("click", event => {
//     // event is MouseEvent (inferred from "click")
// });

console.log("Doubled:", doubled);

// Solution 9: Type Widening
console.log("\n--- Type Widening ---");

// let widens to general type
let letValue = "hello";  // string (widened)

// const keeps literal type
const constValue = "hello";  // "hello" (literal)

// Explicit annotation prevents widening
let explicitLiteral: "hello" = "hello";

// Object properties widen
const obj = { x: 10 };  // { x: number } not { x: 10 }

// Prevent with as const
const literalObj = { x: 10 } as const;  // { readonly x: 10 }

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

/*
1. Let TypeScript infer when possible
2. Annotate function parameters and returns
3. Annotate when inference is wrong
4. Annotate delayed initialization
5. Use type aliases for complex types
6. Use as const for literal objects/arrays
*/

// Good: Let inference work
const message = "Hello";  // No annotation needed

// Good: Annotate function signature
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Good: Annotate when needed
let status: "pending" | "active" = "pending";

console.log(greet("World"));
console.log("Status:", status);

