/**
 * Lab 074: String Transformation Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Methods to transform strings:
 * 
 * - toUpperCase/toLowerCase: Change case
 * - trim/trimStart/trimEnd: Remove whitespace
 * - padStart/padEnd: Add padding
 * - repeat: Repeat string
 * - replace/replaceAll: Replace content
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Transform string case
 * 2. Handle whitespace
 * 3. Replace content
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Case Transformation
console.log("--- Case Transformation ---");

const str = "Hello World";

console.log("toUpperCase:", str.toUpperCase());
console.log("toLowerCase:", str.toLowerCase());

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
console.log("Capitalize:", capitalize("hELLO"));

// Title case
function titleCase(str) {
    return str.split(" ")
        .map(word => capitalize(word))
        .join(" ");
}
console.log("Title case:", titleCase("the quick brown fox"));

// Solution 2: Trim Methods
console.log("\n--- Trim Methods ---");

const padded = "   Hello World   ";

console.log("Original:", `'${padded}'`);
console.log("trim:", `'${padded.trim()}'`);
console.log("trimStart:", `'${padded.trimStart()}'`);
console.log("trimEnd:", `'${padded.trimEnd()}'`);

// Solution 3: Padding
console.log("\n--- Padding ---");

const num = "42";

console.log("padStart(5, '0'):", num.padStart(5, "0")); // "00042"
console.log("padEnd(5, '0'):", num.padEnd(5, "0"));     // "42000"

// Default padding is space
console.log("padStart(5):", `'${num.padStart(5)}'`);

// Practical: Format numbers
function formatNumber(n, digits) {
    return String(n).padStart(digits, "0");
}
console.log("Format:", formatNumber(7, 3)); // "007"

// Format time
function formatTime(hours, minutes, seconds) {
    return [hours, minutes, seconds]
        .map(n => String(n).padStart(2, "0"))
        .join(":");
}
console.log("Time:", formatTime(9, 5, 3)); // "09:05:03"

// Solution 4: Repeat
console.log("\n--- Repeat ---");

console.log("'ab'.repeat(3):", "ab".repeat(3));
console.log("Separator:", "-".repeat(20));

// Create indentation
function indent(level) {
    return "  ".repeat(level);
}
console.log(indent(0) + "Level 0");
console.log(indent(1) + "Level 1");
console.log(indent(2) + "Level 2");

// Solution 5: Replace
console.log("\n--- Replace ---");

const text = "Hello World, Hello Universe";

// Replace first occurrence
console.log("replace:", text.replace("Hello", "Hi"));

// Replace all (with regex)
console.log("replace /g:", text.replace(/Hello/g, "Hi"));

// replaceAll (ES2021)
console.log("replaceAll:", text.replaceAll("Hello", "Hi"));

// Solution 6: Replace with Function
console.log("\n--- Replace with Function ---");

const prices = "Apple: $1.50, Banana: $0.75";

const doubled = prices.replace(/\$(\d+\.\d+)/g, (match, price) => {
    return "$" + (parseFloat(price) * 2).toFixed(2);
});
console.log("Doubled prices:", doubled);

// Mask sensitive data
const card = "1234-5678-9012-3456";
const masked = card.replace(/\d(?=\d{4})/g, "*");
console.log("Masked:", masked);

// Solution 7: Normalize Whitespace
console.log("\n--- Normalize Whitespace ---");

const messy = "  too   many    spaces  ";
const normalized = messy.trim().replace(/\s+/g, " ");
console.log("Normalized:", `'${normalized}'`);

// Solution 8: Remove Characters
console.log("\n--- Remove Characters ---");

// Remove all digits
const withDigits = "abc123def456";
console.log("Remove digits:", withDigits.replace(/\d/g, ""));

// Remove non-alphanumeric
const special = "Hello! How are you?";
console.log("Alphanumeric only:", special.replace(/[^a-zA-Z0-9\s]/g, ""));

// Solution 9: Case Conversions
console.log("\n--- Case Conversions ---");

// camelCase to kebab-case
function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
console.log("camelToKebab:", camelToKebab("backgroundColor"));

// kebab-case to camelCase
function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
console.log("kebabToCamel:", kebabToCamel("background-color"));

// snake_case to camelCase
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}
console.log("snakeToCamel:", snakeToCamel("background_color"));

// Solution 10: Reverse String
console.log("\n--- Reverse String ---");

function reverseString(str) {
    return str.split("").reverse().join("");
}
console.log("Reverse:", reverseString("Hello"));

// Handle Unicode properly
function reverseUnicode(str) {
    return [...str].reverse().join("");
}
console.log("Reverse emoji:", reverseUnicode("Hello 👋"));

