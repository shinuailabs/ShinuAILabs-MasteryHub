/**
 * Lab 161: Primitive Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript primitive types:
 * 
 * - string, number, boolean
 * - null, undefined
 * - symbol, bigint
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Declare variables with primitive types
 * 2. Understand type inference
 * 3. Use type annotations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: String Type
console.log("--- String Type ---");

let firstName: string = "John";
let lastName: string = "Doe";
let greeting: string = `Hello, ${firstName} ${lastName}!`;

console.log("First name:", firstName);
console.log("Greeting:", greeting);

// String methods work with type safety
console.log("Uppercase:", firstName.toUpperCase());
console.log("Length:", firstName.length);

// Solution 2: Number Type
console.log("\n--- Number Type ---");

let age: number = 30;
let price: number = 19.99;
let hex: number = 0xff;
let binary: number = 0b1010;
let octal: number = 0o744;

console.log("Age:", age);
console.log("Price:", price);
console.log("Hex:", hex);
console.log("Binary:", binary);

// Number methods
console.log("Fixed:", price.toFixed(1));
console.log("Is integer:", Number.isInteger(age));

// Solution 3: Boolean Type
console.log("\n--- Boolean Type ---");

let isActive: boolean = true;
let isCompleted: boolean = false;
let hasPermission: boolean = age >= 18;

console.log("Is active:", isActive);
console.log("Has permission:", hasPermission);

// Solution 4: Null and Undefined
console.log("\n--- Null and Undefined ---");

let nullValue: null = null;
let undefinedValue: undefined = undefined;

// With strictNullChecks, these are distinct types
let maybeString: string | null = null;
maybeString = "Now has value";

let optionalNumber: number | undefined;
console.log("Optional before assignment:", optionalNumber);
optionalNumber = 42;
console.log("Optional after assignment:", optionalNumber);

// Solution 5: Symbol Type
console.log("\n--- Symbol Type ---");

const sym1: symbol = Symbol("description");
const sym2: symbol = Symbol("description");

console.log("Symbols equal:", sym1 === sym2); // false - always unique

// Unique symbol type
const uniqueSym: unique symbol = Symbol("unique");

const obj = {
    [sym1]: "value1",
    [uniqueSym]: "value2"
};

console.log("Symbol property:", obj[sym1]);

// Solution 6: BigInt Type
console.log("\n--- BigInt Type ---");

const bigNumber: bigint = 9007199254740991n;
const anotherBig: bigint = BigInt(9007199254740991);

console.log("BigInt:", bigNumber);
console.log("BigInt + 1:", bigNumber + 1n);

// Note: Can't mix bigint and number
// const mixed = bigNumber + 1; // Error!

// Solution 7: Type Inference
console.log("\n--- Type Inference ---");

// TypeScript infers types automatically
let inferredString = "TypeScript infers this";  // string
let inferredNumber = 42;                         // number
let inferredBoolean = true;                      // boolean

// Hover over variables in IDE to see inferred types
console.log("Inferred string:", typeof inferredString);
console.log("Inferred number:", typeof inferredNumber);

// Solution 8: Literal Types
console.log("\n--- Literal Types ---");

// Const creates literal types
const constantString = "hello";  // Type: "hello" (not string)
const constantNumber = 42;       // Type: 42 (not number)

// Explicit literal types
let direction: "north" | "south" | "east" | "west";
direction = "north";
// direction = "up"; // Error!

let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;
diceRoll = 3;

console.log("Direction:", direction);
console.log("Dice roll:", diceRoll);

// Solution 9: Type Assertions
console.log("\n--- Type Assertions ---");

let someValue: unknown = "this is a string";

// Assert type when you know more than TypeScript
let strLength: number = (someValue as string).length;
console.log("String length:", strLength);

// Alternative syntax (not in JSX)
let strLength2: number = (<string>someValue).length;

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

interface User {
    name: string;
    age: number;
    isActive: boolean;
    email: string | null;
    lastLogin: Date | undefined;
}

const user: User = {
    name: "John",
    age: 30,
    isActive: true,
    email: "john@example.com",
    lastLogin: new Date()
};

console.log("User:", user.name, user.age);

function formatUser(user: User): string {
    const email = user.email ?? "No email";
    return `${user.name} (${user.age}) - ${email}`;
}

console.log("Formatted:", formatUser(user));

