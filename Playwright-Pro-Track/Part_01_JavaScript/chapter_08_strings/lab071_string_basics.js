/**
 * Lab 071: String Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Strings are sequences of characters.
 * 
 * Key features:
 * - Immutable (cannot be changed)
 * - Zero-indexed
 * - Can use single, double, or backtick quotes
 * - Primitive but has object wrapper
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create strings
 * 2. Access characters
 * 3. Use string properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating Strings
console.log("--- Creating Strings ---");

// Single quotes
const single = 'Hello';

// Double quotes
const double = "World";

// Backticks (template literals)
const template = `Hello World`;

// String constructor (rarely used)
const constructed = String(123);

console.log("Single:", single);
console.log("Double:", double);
console.log("Template:", template);
console.log("Constructed:", constructed);

// Solution 2: String Length
console.log("\n--- String Length ---");

const str = "JavaScript";
console.log("String:", str);
console.log("Length:", str.length);

// Empty string
console.log("Empty length:", "".length);

// Solution 3: Accessing Characters
console.log("\n--- Accessing Characters ---");

const word = "Hello";

// Bracket notation
console.log("word[0]:", word[0]);
console.log("word[4]:", word[4]);

// charAt method
console.log("charAt(0):", word.charAt(0));
console.log("charAt(4):", word.charAt(4));

// at() method (supports negative indices)
console.log("at(0):", word.at(0));
console.log("at(-1):", word.at(-1)); // Last character

// Out of bounds
console.log("word[10]:", word[10]); // undefined
console.log("charAt(10):", word.charAt(10)); // empty string

// Solution 4: Strings are Immutable
console.log("\n--- Immutability ---");

let text = "Hello";
text[0] = "J"; // This doesn't work!
console.log("After attempt:", text); // Still "Hello"

// Must create new string
text = "J" + text.slice(1);
console.log("New string:", text);

// Solution 5: Escape Characters
console.log("\n--- Escape Characters ---");

console.log("New line:\nSecond line");
console.log("Tab:\tIndented");
console.log("Quote: \"quoted\"");
console.log('Apostrophe: it\'s');
console.log("Backslash: \\");

// Solution 6: String Concatenation
console.log("\n--- Concatenation ---");

const first = "Hello";
const second = "World";

// + operator
console.log("Plus:", first + " " + second);

// concat method
console.log("Concat:", first.concat(" ", second));

// Template literal (preferred)
console.log("Template:", `${first} ${second}`);

// Solution 7: Template Literals
console.log("\n--- Template Literals ---");

const name = "Alice";
const age = 25;

// Expression interpolation
console.log(`Name: ${name}, Age: ${age}`);
console.log(`Next year: ${age + 1}`);
console.log(`Uppercase: ${name.toUpperCase()}`);

// Multi-line strings
const multiLine = `
    This is line 1
    This is line 2
    This is line 3
`;
console.log("Multi-line:", multiLine);

// Solution 8: String Comparison
console.log("\n--- Comparison ---");

console.log("'a' < 'b':", 'a' < 'b');
console.log("'A' < 'a':", 'A' < 'a'); // Uppercase < lowercase
console.log("'10' < '9':", '10' < '9'); // String comparison!

// Case-insensitive comparison
const str1 = "Hello";
const str2 = "hello";
console.log("Equal:", str1 === str2);
console.log("Case-insensitive:", str1.toLowerCase() === str2.toLowerCase());

// localeCompare
console.log("localeCompare:", "apple".localeCompare("banana"));

// Solution 9: Checking String Content
console.log("\n--- Checking Content ---");

const sentence = "The quick brown fox";

console.log("includes('quick'):", sentence.includes("quick"));
console.log("startsWith('The'):", sentence.startsWith("The"));
console.log("endsWith('fox'):", sentence.endsWith("fox"));

// Solution 10: String to Array
console.log("\n--- String to Array ---");

const chars = "Hello";
console.log("Split(''):", chars.split(""));
console.log("Spread:", [...chars]);
console.log("Array.from:", Array.from(chars));

// Solution 11: Iterating Strings
console.log("\n--- Iterating ---");

for (const char of "Hi!") {
    console.log("Char:", char);
}

