/**
 * Lab 010: Special Values - undefined, null, NaN, Infinity
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript has several special values:
 * 
 * undefined:
 * - Default value for uninitialized variables
 * - Return value of functions without return statement
 * - Missing function parameters
 * 
 * null:
 * - Intentional absence of value
 * - Must be explicitly assigned
 * 
 * NaN (Not a Number):
 * - Result of invalid math operations
 * - NaN !== NaN (only value not equal to itself)
 * 
 * Infinity / -Infinity:
 * - Result of overflow or division by zero
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand when undefined occurs
 * 2. Use null appropriately
 * 3. Handle NaN in calculations
 * 4. Work with Infinity
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: undefined - When It Occurs
console.log("--- undefined ---");

// Uninitialized variable
let notInitialized;
console.log("Uninitialized:", notInitialized); // undefined

// Missing object property
const obj = { name: "John" };
console.log("Missing property:", obj.age); // undefined

// Function without return
function noReturn() {
    // no return statement
}
console.log("No return:", noReturn()); // undefined

// Missing function parameter
function greet(name) {
    console.log("Hello,", name);
}
greet(); // Hello, undefined

// Explicit undefined (rarely recommended)
let explicitUndefined = undefined;

// Solution 2: null - Intentional Absence
console.log("\n--- null ---");

// Use null to explicitly indicate "no value"
let selectedUser = null; // No user selected yet
console.log("Selected user:", selectedUser);

// Common pattern: reset a value
let data = { name: "test" };
data = null; // Cleared intentionally
console.log("Cleared data:", data);

// Check for null
if (selectedUser === null) {
    console.log("No user is selected");
}

// null vs undefined
console.log("\n--- null vs undefined ---");
console.log("null == undefined:", null == undefined);   // true (loose)
console.log("null === undefined:", null === undefined); // false (strict)
console.log("typeof null:", typeof null);               // "object"
console.log("typeof undefined:", typeof undefined);     // "undefined"

// Solution 3: NaN - Not a Number
console.log("\n--- NaN ---");

// When NaN occurs
console.log("0 / 0:", 0 / 0);                   // NaN
console.log("'hello' * 2:", "hello" * 2);       // NaN
console.log("Math.sqrt(-1):", Math.sqrt(-1));   // NaN
console.log("parseInt('abc'):", parseInt("abc")); // NaN

// NaN is not equal to itself!
console.log("NaN === NaN:", NaN === NaN);       // false

// Checking for NaN
console.log("Number.isNaN(NaN):", Number.isNaN(NaN));   // true
console.log("Number.isNaN('hello'):", Number.isNaN("hello")); // false

// Handling NaN in calculations
function safeDivide(a, b) {
    const result = a / b;
    return Number.isNaN(result) ? 0 : result;
}
console.log("safeDivide(10, 2):", safeDivide(10, 2));
console.log("safeDivide(0, 0):", safeDivide(0, 0));

// Solution 4: Infinity
console.log("\n--- Infinity ---");

console.log("1 / 0:", 1 / 0);                   // Infinity
console.log("-1 / 0:", -1 / 0);                 // -Infinity
console.log("Number.MAX_VALUE * 2:", Number.MAX_VALUE * 2); // Infinity

// Check for Infinity
console.log("isFinite(100):", isFinite(100));           // true
console.log("isFinite(Infinity):", isFinite(Infinity)); // false
console.log("isFinite(-Infinity):", isFinite(-Infinity)); // false

// Infinity in comparisons
console.log("Infinity > 1000000:", Infinity > 1000000); // true
console.log("Infinity === Infinity:", Infinity === Infinity); // true

// Solution 5: Practical - Safe Value Checking
console.log("\n--- Safe Value Checking ---");

function isValidNumber(value) {
    return typeof value === "number" && 
           !Number.isNaN(value) && 
           Number.isFinite(value);
}

console.log("isValidNumber(42):", isValidNumber(42));
console.log("isValidNumber(NaN):", isValidNumber(NaN));
console.log("isValidNumber(Infinity):", isValidNumber(Infinity));
console.log("isValidNumber('42'):", isValidNumber("42"));
console.log("isValidNumber(null):", isValidNumber(null));

// Nullish coalescing operator (??)
console.log("\n--- Nullish Coalescing ---");
const val1 = null ?? "default";
const val2 = undefined ?? "default";
const val3 = 0 ?? "default";  // 0 is NOT nullish
const val4 = "" ?? "default"; // "" is NOT nullish

console.log("null ?? 'default':", val1);
console.log("undefined ?? 'default':", val2);
console.log("0 ?? 'default':", val3);
console.log("'' ?? 'default':", val4);

