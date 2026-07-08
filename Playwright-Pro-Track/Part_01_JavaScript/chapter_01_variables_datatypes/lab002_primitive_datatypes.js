/**
 * Lab 002: Primitive Data Types in JavaScript
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript has 7 primitive data types:
 * 1. String - Text values ("hello", 'world')
 * 2. Number - Numeric values (42, 3.14, -10)
 * 3. Boolean - true or false
 * 4. undefined - Variable declared but not assigned
 * 5. null - Intentional absence of value
 * 6. Symbol - Unique identifier (ES6+)
 * 7. BigInt - Large integers (ES2020+)
 * 
 * Use typeof operator to check data type.
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create variables of each primitive type
 * 2. Use typeof to check each variable's type
 * 3. Understand the difference between undefined and null
 * 4. Create a BigInt and perform operations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: String
let greeting = "Hello, Playwright!";
let singleQuote = 'Single quotes work too';
let templateLiteral = `Template literals allow ${greeting}`;
console.log("String:", greeting, "| Type:", typeof greeting);

// Solution 2: Number (integers and floats)
let integer = 42;
let float = 3.14159;
let negative = -100;
let infinity = Infinity;
let notANumber = NaN;
console.log("Number:", integer, "| Type:", typeof integer);
console.log("Float:", float, "| Type:", typeof float);
console.log("Infinity:", infinity, "| Type:", typeof infinity);
console.log("NaN:", notANumber, "| Type:", typeof notANumber);

// Solution 3: Boolean
let isActive = true;
let isCompleted = false;
console.log("Boolean:", isActive, "| Type:", typeof isActive);

// Solution 4: undefined
let notAssigned;
console.log("Undefined:", notAssigned, "| Type:", typeof notAssigned);

// Solution 5: null (note: typeof null is "object" - this is a JS quirk)
let emptyValue = null;
console.log("Null:", emptyValue, "| Type:", typeof emptyValue);

// Solution 6: Symbol (unique identifiers)
let sym1 = Symbol("description");
let sym2 = Symbol("description");
console.log("Symbol:", sym1, "| Type:", typeof sym1);
console.log("Are symbols equal?", sym1 === sym2); // false - always unique

// Solution 7: BigInt (for very large numbers)
let bigNumber = 9007199254740991n; // Add 'n' suffix
let anotherBigInt = BigInt("123456789012345678901234567890");
console.log("BigInt:", bigNumber, "| Type:", typeof bigNumber);

// BigInt operations
let bigSum = bigNumber + 1n;
console.log("BigInt sum:", bigSum);
// Note: Cannot mix BigInt and Number directly
// let mixed = bigNumber + 1; // TypeError

// Practical Example: Type checking function
function checkType(value) {
    console.log(`Value: ${value}, Type: ${typeof value}`);
}

console.log("\n--- Type Checking ---");
checkType("test");
checkType(100);
checkType(true);
checkType(undefined);
checkType(null);
checkType(Symbol("id"));
checkType(10n);

