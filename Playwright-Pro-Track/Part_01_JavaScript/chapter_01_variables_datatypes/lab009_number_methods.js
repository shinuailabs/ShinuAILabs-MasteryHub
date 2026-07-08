/**
 * Lab 009: Number Methods and Properties
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript Number object provides useful methods:
 * 
 * Instance methods:
 * - toFixed(digits) - Format decimal places
 * - toString(radix) - Convert to string (with optional base)
 * - toPrecision(digits) - Format to specific precision
 * - toExponential(digits) - Scientific notation
 * 
 * Static methods:
 * - Number.parseInt() / Number.parseFloat()
 * - Number.isInteger() / Number.isFinite() / Number.isNaN()
 * 
 * Properties:
 * - Number.MAX_VALUE / Number.MIN_VALUE
 * - Number.MAX_SAFE_INTEGER / Number.MIN_SAFE_INTEGER
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Format numbers with toFixed and toPrecision
 * 2. Convert between number bases
 * 3. Use Number static methods for validation
 * 4. Understand Number limits
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: toFixed() - Decimal Places
console.log("--- toFixed() ---");
const price = 19.99678;

console.log("Original:", price);
console.log("toFixed(2):", price.toFixed(2));    // "19.99"
console.log("toFixed(0):", price.toFixed(0));    // "20" (rounded)
console.log("toFixed(4):", price.toFixed(4));    // "19.9968"

// Note: toFixed returns a string
const fixedPrice = price.toFixed(2);
console.log("Type of toFixed:", typeof fixedPrice); // "string"
console.log("Convert back:", Number(fixedPrice));   // number

// Solution 2: toPrecision() - Significant Digits
console.log("\n--- toPrecision() ---");
const num = 123.456789;

console.log("toPrecision(2):", num.toPrecision(2));  // "1.2e+2"
console.log("toPrecision(4):", num.toPrecision(4));  // "123.5"
console.log("toPrecision(6):", num.toPrecision(6));  // "123.457"

// Solution 3: toExponential() - Scientific Notation
console.log("\n--- toExponential() ---");
const bigNum = 123456;
const smallNum = 0.00045;

console.log("bigNum.toExponential(2):", bigNum.toExponential(2));   // "1.23e+5"
console.log("smallNum.toExponential(2):", smallNum.toExponential(2)); // "4.50e-4"

// Solution 4: toString() - Number Base Conversion
console.log("\n--- toString(radix) ---");
const decimal = 255;

console.log("Decimal:", decimal);
console.log("Binary:", decimal.toString(2));    // "11111111"
console.log("Octal:", decimal.toString(8));     // "377"
console.log("Hex:", decimal.toString(16));      // "ff"

// Solution 5: Number Static Methods
console.log("\n--- Number Static Methods ---");

// parseInt and parseFloat
console.log('parseInt("42"):', Number.parseInt("42"));
console.log('parseInt("42.5"):', Number.parseInt("42.5"));
console.log('parseFloat("42.5"):', Number.parseFloat("42.5"));
console.log('parseInt("42px"):', Number.parseInt("42px")); // 42

// isInteger
console.log("isInteger(42):", Number.isInteger(42));       // true
console.log("isInteger(42.0):", Number.isInteger(42.0));   // true
console.log("isInteger(42.5):", Number.isInteger(42.5));   // false

// isFinite
console.log("isFinite(100):", Number.isFinite(100));       // true
console.log("isFinite(Infinity):", Number.isFinite(Infinity)); // false
console.log("isFinite(NaN):", Number.isFinite(NaN));       // false

// isNaN (better than global isNaN)
console.log("isNaN(NaN):", Number.isNaN(NaN));             // true
console.log("isNaN('hello'):", Number.isNaN("hello"));     // false
console.log("global isNaN('hello'):", isNaN("hello"));     // true (coerces)

// Solution 6: Number Limits
console.log("\n--- Number Limits ---");
console.log("MAX_VALUE:", Number.MAX_VALUE);
console.log("MIN_VALUE:", Number.MIN_VALUE);
console.log("MAX_SAFE_INTEGER:", Number.MAX_SAFE_INTEGER);  // 2^53 - 1
console.log("MIN_SAFE_INTEGER:", Number.MIN_SAFE_INTEGER);  // -(2^53 - 1)

// Safe integer check
console.log("\nisSafeInteger tests:");
console.log("isSafeInteger(10):", Number.isSafeInteger(10));
console.log("isSafeInteger(Math.pow(2, 53)):", Number.isSafeInteger(Math.pow(2, 53)));

// Solution 7: Practical Example - Currency Formatting
console.log("\n--- Practical: Currency ---");
function formatCurrency(amount, decimals = 2) {
    return "$" + amount.toFixed(decimals);
}

console.log(formatCurrency(1234.5));      // "$1234.50"
console.log(formatCurrency(1234.5678, 2)); // "$1234.57"

