/**
 * Lab 073: String Extraction Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Methods to extract parts of strings:
 * 
 * - slice: Extract portion (supports negative)
 * - substring: Extract portion (no negative)
 * - substr: Extract by length (deprecated)
 * - split: Split into array
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Extract substrings
 * 2. Split strings
 * 3. Handle edge cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: slice
console.log("--- slice ---");

const str = "Hello World";

// slice(start, end) - end not included
console.log("slice(0, 5):", str.slice(0, 5));   // "Hello"
console.log("slice(6):", str.slice(6));         // "World"
console.log("slice(6, 11):", str.slice(6, 11)); // "World"

// Negative indices (from end)
console.log("slice(-5):", str.slice(-5));       // "World"
console.log("slice(-5, -1):", str.slice(-5, -1)); // "Worl"
console.log("slice(0, -6):", str.slice(0, -6)); // "Hello"

// Solution 2: substring
console.log("\n--- substring ---");

// substring(start, end) - similar to slice
console.log("substring(0, 5):", str.substring(0, 5)); // "Hello"
console.log("substring(6):", str.substring(6));       // "World"

// Differences from slice:
// - Negative values treated as 0
console.log("substring(-5):", str.substring(-5)); // "Hello World" (treats as 0)

// - Swaps if start > end
console.log("substring(5, 0):", str.substring(5, 0)); // "Hello" (swaps to 0, 5)

// Solution 3: split
console.log("\n--- split ---");

const sentence = "The quick brown fox";

// Split by space
console.log("split(' '):", sentence.split(" "));

// Split by character
console.log("split(''):", "Hello".split(""));

// Split with limit
console.log("split(' ', 2):", sentence.split(" ", 2));

// Split by regex
const csv = "a,b;c,d;e";
console.log("split(/[,;]/):", csv.split(/[,;]/));

// Solution 4: Split and Join
console.log("\n--- Split and Join ---");

const words = "hello world".split(" ");
const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1));
const result = capitalized.join(" ");
console.log("Capitalized:", result);

// Solution 5: Extract Between Delimiters
console.log("\n--- Extract Between ---");

function extractBetween(str, start, end) {
    const startIndex = str.indexOf(start);
    if (startIndex === -1) return null;
    
    const endIndex = str.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return null;
    
    return str.slice(startIndex + start.length, endIndex);
}

const html = "<div>Content here</div>";
console.log("Between tags:", extractBetween(html, "<div>", "</div>"));

// Solution 6: Get First/Last N Characters
console.log("\n--- First/Last N ---");

const text = "JavaScript";

// First N
console.log("First 4:", text.slice(0, 4));

// Last N
console.log("Last 4:", text.slice(-4));

// Remove first N
console.log("Remove first 4:", text.slice(4));

// Remove last N
console.log("Remove last 4:", text.slice(0, -4));

// Solution 7: Truncate with Ellipsis
console.log("\n--- Truncate ---");

function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + "...";
}

const longText = "This is a very long string that needs truncation";
console.log("Truncated:", truncate(longText, 20));

// Solution 8: Extract Words
console.log("\n--- Extract Words ---");

function getWords(str) {
    return str.trim().split(/\s+/);
}

const messy = "  multiple   spaces   here  ";
console.log("Words:", getWords(messy));

// Get nth word
function getNthWord(str, n) {
    const words = getWords(str);
    return words[n - 1] || null;
}

console.log("3rd word:", getNthWord("one two three four", 3));

// Solution 9: Extract Numbers
console.log("\n--- Extract Numbers ---");

function extractNumbers(str) {
    return str.match(/\d+/g)?.map(Number) || [];
}

console.log("Numbers:", extractNumbers("abc123def456ghi789"));

// Extract first number
function extractFirstNumber(str) {
    const match = str.match(/\d+/);
    return match ? Number(match[0]) : null;
}

console.log("First number:", extractFirstNumber("Price: $42.99"));

// Solution 10: Parse Key-Value
console.log("\n--- Parse Key-Value ---");

function parseKeyValue(str, delimiter = "=") {
    const index = str.indexOf(delimiter);
    if (index === -1) return { key: str, value: null };
    
    return {
        key: str.slice(0, index).trim(),
        value: str.slice(index + 1).trim()
    };
}

console.log("Parsed:", parseKeyValue("name = John Doe"));
console.log("Parsed:", parseKeyValue("key:value", ":"));

// Solution 11: Extract Domain from URL
console.log("\n--- Extract Domain ---");

function extractDomain(url) {
    return url.replace(/^https?:\/\//, "").split("/")[0];
}

console.log("Domain:", extractDomain("https://www.example.com/path/page"));

