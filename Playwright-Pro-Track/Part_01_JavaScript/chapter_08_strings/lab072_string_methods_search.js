/**
 * Lab 072: String Search Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Methods to search within strings:
 * 
 * - indexOf/lastIndexOf: Find position
 * - includes: Check existence
 * - startsWith/endsWith: Check boundaries
 * - search: Regex search
 * - match/matchAll: Find matches
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Find substrings
 * 2. Check string content
 * 3. Use regex for searching
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: indexOf
console.log("--- indexOf ---");

const str = "Hello World, Hello Universe";

console.log("indexOf('Hello'):", str.indexOf("Hello")); // 0
console.log("indexOf('World'):", str.indexOf("World")); // 6
console.log("indexOf('xyz'):", str.indexOf("xyz"));     // -1

// Start from position
console.log("indexOf('Hello', 1):", str.indexOf("Hello", 1)); // 13

// Solution 2: lastIndexOf
console.log("\n--- lastIndexOf ---");

console.log("lastIndexOf('Hello'):", str.lastIndexOf("Hello")); // 13
console.log("lastIndexOf('o'):", str.lastIndexOf("o")); // 22

// Search backwards from position
console.log("lastIndexOf('o', 10):", str.lastIndexOf("o", 10)); // 7

// Solution 3: includes
console.log("\n--- includes ---");

const text = "JavaScript is awesome";

console.log("includes('Script'):", text.includes("Script")); // true
console.log("includes('script'):", text.includes("script")); // false (case-sensitive)
console.log("includes('Java', 5):", text.includes("Java", 5)); // false

// Solution 4: startsWith
console.log("\n--- startsWith ---");

const url = "https://example.com/path";

console.log("startsWith('https'):", url.startsWith("https")); // true
console.log("startsWith('http'):", url.startsWith("http"));   // true
console.log("startsWith('ftp'):", url.startsWith("ftp"));     // false

// Start from position
console.log("startsWith('example', 8):", url.startsWith("example", 8)); // true

// Solution 5: endsWith
console.log("\n--- endsWith ---");

const filename = "document.pdf";

console.log("endsWith('.pdf'):", filename.endsWith(".pdf")); // true
console.log("endsWith('.doc'):", filename.endsWith(".doc")); // false

// Check up to length
console.log("endsWith('doc', 11):", filename.endsWith("doc", 11)); // true

// Solution 6: search (with regex)
console.log("\n--- search ---");

const sentence = "The quick brown fox jumps";

console.log("search(/quick/):", sentence.search(/quick/)); // 4
console.log("search(/QUICK/i):", sentence.search(/QUICK/i)); // 4 (case-insensitive)
console.log("search(/cat/):", sentence.search(/cat/)); // -1

// Solution 7: match
console.log("\n--- match ---");

const text2 = "The rain in Spain falls mainly in the plain";

// Single match
const single = text2.match(/ain/);
console.log("Single match:", single);

// Global match
const global = text2.match(/ain/g);
console.log("Global match:", global);

// With groups
const withGroups = "2024-01-15".match(/(\d{4})-(\d{2})-(\d{2})/);
console.log("With groups:", withGroups);
console.log("Year:", withGroups[1]);
console.log("Month:", withGroups[2]);
console.log("Day:", withGroups[3]);

// Solution 8: matchAll
console.log("\n--- matchAll ---");

const text3 = "test1 test2 test3";
const matches = text3.matchAll(/test(\d)/g);

for (const match of matches) {
    console.log(`Found: ${match[0]}, Group: ${match[1]}, Index: ${match.index}`);
}

// Solution 9: Practical Examples
console.log("\n--- Practical Examples ---");

// Check file extension
function hasExtension(filename, ext) {
    return filename.toLowerCase().endsWith(ext.toLowerCase());
}
console.log("Is PDF:", hasExtension("doc.PDF", ".pdf"));

// Find all occurrences
function findAllIndices(str, substr) {
    const indices = [];
    let index = str.indexOf(substr);
    while (index !== -1) {
        indices.push(index);
        index = str.indexOf(substr, index + 1);
    }
    return indices;
}
console.log("All 'o' indices:", findAllIndices("Hello World", "o"));

// Count occurrences
function countOccurrences(str, substr) {
    return (str.match(new RegExp(substr, "g")) || []).length;
}
console.log("Count 'the':", countOccurrences("the cat and the dog", "the"));

// Solution 10: Case-Insensitive Search
console.log("\n--- Case-Insensitive ---");

function includesIgnoreCase(str, search) {
    return str.toLowerCase().includes(search.toLowerCase());
}

console.log("Includes 'HELLO':", includesIgnoreCase("Hello World", "HELLO"));

// Using regex
function searchIgnoreCase(str, search) {
    return str.search(new RegExp(search, "i")) !== -1;
}

console.log("Search 'WORLD':", searchIgnoreCase("Hello World", "WORLD"));

