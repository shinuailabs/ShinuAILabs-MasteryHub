/**
 * Lab 003: Type Conversion (Coercion) in JavaScript
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Type conversion can be:
 * - Explicit (manual): Using functions like String(), Number(), Boolean()
 * - Implicit (automatic): JavaScript converts types automatically in operations
 * 
 * Common conversions:
 * - String(): Converts to string
 * - Number(): Converts to number
 * - Boolean(): Converts to boolean
 * - parseInt(): Parses string to integer
 * - parseFloat(): Parses string to float
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert numbers to strings
 * 2. Convert strings to numbers
 * 3. Understand truthy and falsy values
 * 4. Practice implicit type coercion
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Converting to String
console.log("--- Converting to String ---");
let num = 42;
let strFromNum = String(num);
let strUsingToString = num.toString();
let strUsingConcat = num + "";

console.log("String(42):", strFromNum, "| Type:", typeof strFromNum);
console.log("(42).toString():", strUsingToString);
console.log('42 + "":', strUsingConcat);

// Solution 2: Converting to Number
console.log("\n--- Converting to Number ---");
let str = "123";
let numFromStr = Number(str);
let numUsingParseInt = parseInt("123.45");
let numUsingParseFloat = parseFloat("123.45");
let numUsingPlus = +"456";

console.log('Number("123"):', numFromStr, "| Type:", typeof numFromStr);
console.log('parseInt("123.45"):', numUsingParseInt);
console.log('parseFloat("123.45"):', numUsingParseFloat);
console.log('+"456":', numUsingPlus);

// Edge cases
console.log('Number("hello"):', Number("hello")); // NaN
console.log('Number(""):', Number("")); // 0
console.log('Number(true):', Number(true)); // 1
console.log('Number(false):', Number(false)); // 0
console.log('Number(null):', Number(null)); // 0
console.log('Number(undefined):', Number(undefined)); // NaN

// Solution 3: Converting to Boolean (Truthy/Falsy)
console.log("\n--- Truthy and Falsy Values ---");

// Falsy values (convert to false)
console.log("Falsy values:");
console.log("Boolean(0):", Boolean(0));
console.log("Boolean(''):", Boolean(''));
console.log("Boolean(null):", Boolean(null));
console.log("Boolean(undefined):", Boolean(undefined));
console.log("Boolean(NaN):", Boolean(NaN));
console.log("Boolean(false):", Boolean(false));

// Truthy values (convert to true)
console.log("\nTruthy values:");
console.log("Boolean(1):", Boolean(1));
console.log("Boolean('hello'):", Boolean('hello'));
console.log("Boolean([]):", Boolean([])); // Empty array is truthy!
console.log("Boolean({}):", Boolean({})); // Empty object is truthy!
console.log("Boolean('0'):", Boolean('0')); // String '0' is truthy!

// Solution 4: Implicit Type Coercion
console.log("\n--- Implicit Coercion ---");
console.log('"5" + 3:', "5" + 3); // "53" (string concat)
console.log('"5" - 3:', "5" - 3); // 2 (number subtraction)
console.log('"5" * 2:', "5" * 2); // 10
console.log('true + 1:', true + 1); // 2
console.log('false + 1:', false + 1); // 1
console.log('"" + true:', "" + true); // "true"

// Practical example: Form input handling
let userInput = "25";
let age = Number(userInput);
if (age >= 18) {
    console.log("\nUser is an adult");
}

