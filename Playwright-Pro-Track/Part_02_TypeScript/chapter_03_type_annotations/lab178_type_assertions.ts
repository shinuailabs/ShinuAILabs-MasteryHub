/**
 * Lab 178: Type Assertions
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Asserting types in TypeScript:
 *
 * - as syntax
 * - Angle bracket syntax
 * - Non-null assertion
 * - const assertions
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use type assertions
 * 2. Understand when to assert
 * 3. Avoid assertion pitfalls
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Type Assertions
console.log("--- Basic Type Assertions ---");

let someValue: unknown = "this is a string";

// as syntax (preferred)
let strLength1: number = (someValue as string).length;

// Angle bracket syntax (not in JSX)
let strLength2: number = (<string>someValue).length;

console.log("String length:", strLength1);

// Solution 2: Asserting Object Types
console.log("\n--- Object Assertions ---");

interface User {
    name: string;
    age: number;
}

// Asserting parsed JSON
const jsonString = '{"name": "John", "age": 30}';
const user = JSON.parse(jsonString) as User;

console.log("User:", user.name, user.age);

// Asserting API response
const response: unknown = { data: { id: 1, name: "Test" } };
const typedResponse = response as { data: { id: number; name: string } };
console.log("Response:", typedResponse.data.name);

// Solution 3: Non-null Assertion
console.log("\n--- Non-null Assertion ---");

function getElement(id: string): HTMLElement | null {
    // Simulated DOM query
    return null;
}

// Using non-null assertion (!)
// const element = getElement("myId")!;
// element.innerHTML = "Hello"; // Assumes element is not null

// Safer approach
const element = getElement("myId");
if (element) {
    console.log("Element found");
} else {
    console.log("Element not found");
}

// Solution 4: Const Assertions
console.log("\n--- Const Assertions ---");

// Without const assertion
const colors = ["red", "green", "blue"]; // string[]

// With const assertion
const colorsConst = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

const config = {
    host: "localhost",
    port: 3000
} as const;
// Type: { readonly host: "localhost"; readonly port: 3000 }

console.log("Colors:", colorsConst);
console.log("Config:", config);

// Solution 5: Double Assertion
console.log("\n--- Double Assertion ---");

// Sometimes needed for incompatible types
const value: string = "hello";

// Direct assertion fails
// const num: number = value as number; // Error!

// Double assertion (use sparingly!)
const num: number = value as unknown as number;

console.log("Double assertion (dangerous):", num);

// Solution 6: Assertion Functions
console.log("\n--- Assertion Functions ---");

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value is not a string");
    }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined");
    }
}

let maybeString: unknown = "hello";
assertIsString(maybeString);
// Now TypeScript knows maybeString is string
console.log("Asserted:", maybeString.toUpperCase());

// Solution 7: Type Predicates
console.log("\n--- Type Predicates ---");

interface Dog {
    bark(): void;
}

interface Cat {
    meow(): void;
}

function isDog(animal: Dog | Cat): animal is Dog {
    return "bark" in animal;
}

const pet: Dog | Cat = { bark: () => console.log("Woof!") };

if (isDog(pet)) {
    pet.bark(); // TypeScript knows it's a Dog
}

// Solution 8: Satisfies Operator
console.log("\n--- Satisfies Operator ---");

type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255]
} satisfies Record<Colors, RGB | string>;

// palette.red is still [number, number, number]
// palette.green is still string
console.log("Red:", palette.red[0]);
console.log("Green:", palette.green.toUpperCase());

// Solution 9: When to Use Assertions
console.log("\n--- When to Assert ---");

/*
Use assertions when:
1. You know more than TypeScript
2. Working with external data (JSON, APIs)
3. DOM manipulation
4. Migration from JavaScript

Avoid assertions when:
1. You're not sure about the type
2. Type guards would work
3. Proper typing is possible
*/

// Good: External data
const apiData = JSON.parse('{"id": 1}') as { id: number };

// Bad: Hiding type errors
// const wrong = "hello" as number; // Don't do this!

// Solution 10: Safe Assertion Patterns
console.log("\n--- Safe Patterns ---");

// Validate before asserting
function parseUser(data: unknown): User {
    if (
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        "age" in data
    ) {
        return data as User;
    }
    throw new Error("Invalid user data");
}

// Use type guards instead of assertions
function processValue(value: string | number): void {
    if (typeof value === "string") {
        console.log("String:", value.toUpperCase());
    } else {
        console.log("Number:", value.toFixed(2));
    }
}

processValue("hello");
processValue(42.5);

console.log("\nUse assertions carefully and validate data!");
