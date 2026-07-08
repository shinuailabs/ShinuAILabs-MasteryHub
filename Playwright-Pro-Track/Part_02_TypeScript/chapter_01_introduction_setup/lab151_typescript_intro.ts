/**
 * Lab 151: Introduction to TypeScript
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript fundamentals:
 * 
 * - What is TypeScript
 * - Benefits of static typing
 * - TypeScript vs JavaScript
 * - Compilation process
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand TypeScript basics
 * 2. Write your first TypeScript code
 * 3. Compile and run TypeScript
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Type Annotations
console.log("--- Basic Type Annotations ---");

let message: string = "Hello, TypeScript!";
let count: number = 42;
let isActive: boolean = true;

console.log("Message:", message);
console.log("Count:", count);
console.log("Is Active:", isActive);

// Solution 2: Type Inference
console.log("\n--- Type Inference ---");

// TypeScript infers types automatically
let inferredString = "TypeScript infers this is a string";
let inferredNumber = 100;
let inferredBoolean = false;

console.log("Inferred string:", inferredString);
console.log("Inferred number:", inferredNumber);

// Solution 3: Function Types
console.log("\n--- Function Types ---");

function greet(name: string): string {
    return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
    return a + b;
}

console.log(greet("World"));
console.log("Sum:", add(5, 3));

// Solution 4: Arrays
console.log("\n--- Arrays ---");

let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// Alternative syntax
let scores: Array<number> = [90, 85, 92];

console.log("Numbers:", numbers);
console.log("Names:", names);
console.log("Scores:", scores);

// Solution 5: Objects
console.log("\n--- Objects ---");

let user: { name: string; age: number; email: string } = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

console.log("User:", user);

// Solution 6: Any Type
console.log("\n--- Any Type ---");

// Use sparingly - defeats purpose of TypeScript
let flexible: any = "string";
flexible = 42;
flexible = { key: "value" };

console.log("Flexible:", flexible);

// Solution 7: Unknown Type
console.log("\n--- Unknown Type ---");

// Safer than any - requires type checking
let uncertain: unknown = "might be anything";

if (typeof uncertain === "string") {
    console.log("It's a string:", uncertain.toUpperCase());
}

// Solution 8: Void and Never
console.log("\n--- Void and Never ---");

function logMessage(msg: string): void {
    console.log("Log:", msg);
    // No return value
}

function throwError(message: string): never {
    throw new Error(message);
}

logMessage("This function returns void");

// Solution 9: Type Assertions
console.log("\n--- Type Assertions ---");

let someValue: unknown = "this is a string";

// Two syntaxes for type assertion
let strLength1: number = (someValue as string).length;
let strLength2: number = (<string>someValue).length;

console.log("String length:", strLength1);

// Solution 10: Why TypeScript?
console.log("\n--- Why TypeScript? ---");

/*
Benefits of TypeScript:
1. Catch errors at compile time
2. Better IDE support (autocomplete, refactoring)
3. Self-documenting code
4. Easier refactoring
5. Better team collaboration
6. Gradual adoption possible

TypeScript compiles to JavaScript:
- tsc filename.ts -> filename.js
- Configure with tsconfig.json
*/

// Example: This would cause a compile error
// let num: number = "not a number"; // Error!

// This is valid JavaScript but TypeScript catches the error
function multiply(a: number, b: number): number {
    return a * b;
}

// multiply("5", 3); // TypeScript Error: Argument of type 'string' is not assignable

console.log("Multiply:", multiply(5, 3));

console.log("\nTypeScript = JavaScript + Types");
console.log("Compile with: tsc filename.ts");
console.log("Run with: node filename.js");

