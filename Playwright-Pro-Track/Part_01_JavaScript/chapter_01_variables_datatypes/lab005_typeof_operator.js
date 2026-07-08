/**
 * Lab 005: The typeof Operator
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The typeof operator returns a string indicating the type of a value.
 * 
 * Syntax: typeof operand OR typeof(operand)
 * 
 * Returns:
 * - "string" for strings
 * - "number" for numbers (including NaN, Infinity)
 * - "boolean" for booleans
 * - "undefined" for undefined
 * - "object" for objects, arrays, and null (quirk!)
 * - "function" for functions
 * - "symbol" for symbols
 * - "bigint" for BigInt
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use typeof with all data types
 * 2. Understand typeof quirks (null, arrays, NaN)
 * 3. Create a type-checking utility function
 * 4. Use typeof for input validation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: typeof with Primitives
console.log("--- typeof with Primitives ---");
console.log('typeof "hello":', typeof "hello");         // "string"
console.log("typeof 42:", typeof 42);                   // "number"
console.log("typeof 3.14:", typeof 3.14);               // "number"
console.log("typeof true:", typeof true);               // "boolean"
console.log("typeof undefined:", typeof undefined);     // "undefined"
console.log("typeof Symbol():", typeof Symbol());       // "symbol"
console.log("typeof 10n:", typeof 10n);                 // "bigint"

// Solution 2: typeof Quirks
console.log("\n--- typeof Quirks ---");
console.log("typeof null:", typeof null);               // "object" (historical bug)
console.log("typeof []:", typeof []);                   // "object"
console.log("typeof {}:", typeof {});                   // "object"
console.log("typeof NaN:", typeof NaN);                 // "number" (quirk!)
console.log("typeof Infinity:", typeof Infinity);       // "number"
console.log("typeof function(){}:", typeof function(){}); // "function"

// Solution 3: Better Type Checking
console.log("\n--- Better Type Checking ---");

// Check for array
const arr = [1, 2, 3];
console.log("Array.isArray([1,2,3]):", Array.isArray(arr));

// Check for null
const nullVal = null;
console.log("Is null:", nullVal === null);

// Check for NaN
const nanVal = NaN;
console.log("Number.isNaN(NaN):", Number.isNaN(nanVal));

// Solution 4: Comprehensive Type Checker Function
function getType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (Number.isNaN(value)) return "NaN";
    return typeof value;
}

console.log("\n--- Custom getType Function ---");
console.log("getType(null):", getType(null));
console.log("getType([]):", getType([]));
console.log("getType({}):", getType({}));
console.log("getType(NaN):", getType(NaN));
console.log("getType('hello'):", getType('hello'));
console.log("getType(42):", getType(42));

// Solution 5: Using typeof for Validation
console.log("\n--- Input Validation ---");

function processInput(input) {
    if (typeof input === "string") {
        return `String: "${input.toUpperCase()}"`;
    } else if (typeof input === "number") {
        return `Number: ${input * 2}`;
    } else if (typeof input === "boolean") {
        return `Boolean: ${!input}`;
    } else if (typeof input === "undefined") {
        return "Error: Input is undefined";
    } else {
        return `Other type: ${typeof input}`;
    }
}

console.log(processInput("hello"));
console.log(processInput(21));
console.log(processInput(true));
console.log(processInput(undefined));
console.log(processInput({ key: "value" }));

// Solution 6: Check if Variable is Defined
console.log("\n--- Check if Defined ---");
let maybeUndefined;
if (typeof maybeUndefined === "undefined") {
    console.log("Variable is undefined");
}

// This is safe even if variable doesn't exist
if (typeof nonExistent === "undefined") {
    console.log("nonExistent is not defined");
}

