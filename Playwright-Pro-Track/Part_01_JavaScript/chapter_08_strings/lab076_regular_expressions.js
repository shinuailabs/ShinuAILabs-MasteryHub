/**
 * Lab 076: Regular Expressions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Regular expressions (regex) are patterns for matching strings.
 * 
 * Creating regex:
 * - Literal: /pattern/flags
 * - Constructor: new RegExp("pattern", "flags")
 * 
 * Common flags:
 * - g: global (find all)
 * - i: case-insensitive
 * - m: multiline
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create and test patterns
 * 2. Use character classes
 * 3. Use quantifiers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating Regex
console.log("--- Creating Regex ---");

// Literal
const regex1 = /hello/;

// Constructor
const regex2 = new RegExp("hello");

// With flags
const regex3 = /hello/gi;

console.log("Test 'hello':", regex1.test("hello world"));
console.log("Test 'HELLO':", regex3.test("HELLO world"));

// Solution 2: test() Method
console.log("\n--- test() ---");

const emailRegex = /\S+@\S+\.\S+/;
console.log("Valid email:", emailRegex.test("test@example.com"));
console.log("Invalid email:", emailRegex.test("invalid-email"));

// Solution 3: Character Classes
console.log("\n--- Character Classes ---");

// \d - digit, \w - word char, \s - whitespace
console.log("/\\d/.test('a1b'):", /\d/.test("a1b"));
console.log("/\\w/.test('_'):", /\w/.test("_"));
console.log("/\\s/.test('a b'):", /\s/.test("a b"));

// Custom class [abc]
console.log("/[aeiou]/.test('hello'):", /[aeiou]/.test("hello"));

// Negated class [^abc]
console.log("/[^0-9]/.test('123'):", /[^0-9]/.test("123"));

// Solution 4: Quantifiers
console.log("\n--- Quantifiers ---");

// * (0 or more), + (1 or more), ? (0 or 1)
console.log("/a*/.test(''):", /a*/.test(""));
console.log("/a+/.test(''):", /a+/.test(""));
console.log("/a?/.test(''):", /a?/.test(""));

// {n}, {n,}, {n,m}
console.log("/a{3}/.test('aaa'):", /a{3}/.test("aaa"));
console.log("/a{2,4}/.test('aaaa'):", /a{2,4}/.test("aaaa"));

// Solution 5: Anchors
console.log("\n--- Anchors ---");

// ^ start, $ end
console.log("/^hello/.test('hello world'):", /^hello/.test("hello world"));
console.log("/world$/.test('hello world'):", /world$/.test("hello world"));
console.log("/^hello$/.test('hello'):", /^hello$/.test("hello"));

// Word boundary \b
console.log("/\\bcat\\b/.test('cat'):", /\bcat\b/.test("the cat sat"));
console.log("/\\bcat\\b/.test('category'):", /\bcat\b/.test("category"));

// Solution 6: Groups
console.log("\n--- Groups ---");

// Capturing groups ()
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const match = "2024-01-15".match(dateRegex);
console.log("Full match:", match[0]);
console.log("Year:", match[1]);
console.log("Month:", match[2]);
console.log("Day:", match[3]);

// Non-capturing group (?:)
const nonCapture = /(?:https?:\/\/)?(\w+\.\w+)/;
const urlMatch = "https://example.com".match(nonCapture);
console.log("Domain:", urlMatch[1]);

// Solution 7: Alternation
console.log("\n--- Alternation ---");

const colorRegex = /red|green|blue/;
console.log("Has color:", colorRegex.test("I like red"));

// Solution 8: Lookahead/Lookbehind
console.log("\n--- Lookahead/Lookbehind ---");

// Positive lookahead (?=)
console.log("/\\d(?=px)/.test('10px'):", /\d(?=px)/.test("10px"));

// Negative lookahead (?!)
console.log("/\\d(?!px)/.test('10em'):", /\d(?!px)/.test("10em"));

// Positive lookbehind (?<=)
console.log("/(?<=\\$)\\d+/.exec('$100'):", /(?<=\$)\d+/.exec("$100")?.[0]);

// Solution 9: Common Patterns
console.log("\n--- Common Patterns ---");

// Email (simple)
const email = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
console.log("Email valid:", email.test("user@example.com"));

// Phone (US)
const phone = /^\d{3}-\d{3}-\d{4}$/;
console.log("Phone valid:", phone.test("123-456-7890"));

// URL
const url = /^https?:\/\/[\w.-]+(?:\/[\w.-]*)*$/;
console.log("URL valid:", url.test("https://example.com/path"));

// Solution 10: Replace with Regex
console.log("\n--- Replace ---");

const text = "Hello World";
console.log("Replace:", text.replace(/world/i, "JavaScript"));

// With groups
const name = "John Smith";
console.log("Swap:", name.replace(/(\w+) (\w+)/, "$2, $1"));

// With function
const prices = "Apple $1.50, Banana $0.75";
const doubled = prices.replace(/\$(\d+\.\d+)/g, (_, price) => {
    return "$" + (parseFloat(price) * 2).toFixed(2);
});
console.log("Doubled:", doubled);

// Solution 11: exec() for Iteration
console.log("\n--- exec() ---");

const regex = /\d+/g;
const str = "a1b22c333";
let result;

while ((result = regex.exec(str)) !== null) {
    console.log(`Found ${result[0]} at index ${result.index}`);
}

