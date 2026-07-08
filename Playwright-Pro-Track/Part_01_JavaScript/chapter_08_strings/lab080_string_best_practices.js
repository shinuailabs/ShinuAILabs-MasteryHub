/**
 * Lab 080: String Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for working with strings:
 *
 * 1. Use template literals
 * 2. Prefer immutable operations
 * 3. Use appropriate methods
 * 4. Handle Unicode correctly
 * 5. Validate and sanitize input
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Write clean string code
 * 3. Handle edge cases
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Use Template Literals
console.log("--- Template Literals ---");

const name = "Alice";
const age = 25;

// BAD: String concatenation
const bad = "Name: " + name + ", Age: " + age;

// GOOD: Template literal
const good = `Name: ${name}, Age: ${age}`;

console.log("Template:", good);

// Best Practice 2: Use Appropriate Methods
console.log("\n--- Appropriate Methods ---");

const str = "Hello World";

// BAD: indexOf for existence check
const exists1 = str.indexOf("World") !== -1;

// GOOD: includes for existence
const exists2 = str.includes("World");

// BAD: slice(0, n) for prefix check
const startsWithHello1 = str.slice(0, 5) === "Hello";

// GOOD: startsWith
const startsWithHello2 = str.startsWith("Hello");

console.log("includes:", exists2);
console.log("startsWith:", startsWithHello2);

// Best Practice 3: Avoid Repeated Concatenation
console.log("\n--- Avoid Repeated Concat ---");

// BAD: Repeated concatenation in loop
function buildStringBad(items) {
    let result = "";
    for (const item of items) {
        result += item + ", ";
    }
    return result;
}

// GOOD: Use array and join
function buildStringGood(items) {
    return items.join(", ");
}

const items = ["a", "b", "c"];
console.log("Join:", buildStringGood(items));

// Best Practice 4: Trim User Input
console.log("\n--- Trim Input ---");

function processInput(input) {
    // Always trim user input
    const cleaned = input?.trim() ?? "";

    if (cleaned.length === 0) {
        return { valid: false, error: "Input required" };
    }

    return { valid: true, value: cleaned };
}

console.log("With spaces:", processInput("  hello  "));
console.log("Empty:", processInput("   "));

// Best Practice 5: Case-Insensitive Comparison
console.log("\n--- Case-Insensitive ---");

// BAD: Multiple toLowerCase calls
function findBad(items, search) {
    return items.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );
}

// GOOD: Normalize once
function findGood(items, search) {
    const normalizedSearch = search.toLowerCase();
    return items.filter(item =>
        item.toLowerCase().includes(normalizedSearch)
    );
}

// Best Practice 6: Use Optional Chaining
console.log("\n--- Optional Chaining ---");

const user = { profile: { name: "Bob" } };

// BAD: Manual null checks
const name1 = user && user.profile && user.profile.name;

// GOOD: Optional chaining
const name2 = user?.profile?.name ?? "Unknown";

console.log("Name:", name2);

// Best Practice 7: Escape Special Characters
console.log("\n--- Escape Characters ---");

function escapeHtml(str) {
    const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return str.replace(/[&<>"']/g, char => escapeMap[char]);
}

const userInput = '<script>alert("xss")</script>';
console.log("Escaped:", escapeHtml(userInput));

// Best Practice 8: Use Regex Wisely
console.log("\n--- Regex Best Practices ---");

// Cache regex if used repeatedly
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmails(emails) {
    return emails.filter(email => emailRegex.test(email));
}

// Avoid regex for simple operations
// BAD: /^hello/.test(str)
// GOOD: str.startsWith("hello")

// Best Practice 9: Handle Empty Strings
console.log("\n--- Handle Empty ---");

function formatName(name) {
    // Handle null, undefined, empty
    if (!name?.trim()) {
        return "Anonymous";
    }

    return name.trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

console.log("Format null:", formatName(null));
console.log("Format empty:", formatName(""));
console.log("Format name:", formatName("  john   doe  "));

// Best Practice 10: Use Constants for Magic Strings
console.log("\n--- Constants ---");

// BAD: Magic strings
// if (status === "active") { ... }

// GOOD: Constants
const STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending"
};

function checkStatus(status) {
    switch (status) {
        case STATUS.ACTIVE:
            return "User is active";
        case STATUS.INACTIVE:
            return "User is inactive";
        default:
            return "Unknown status";
    }
}

console.log("Status:", checkStatus(STATUS.ACTIVE));

// Summary
console.log("\n--- Summary ---");
console.log("1. Use template literals for interpolation");
console.log("2. Use includes/startsWith/endsWith");
console.log("3. Use join() instead of repeated concat");
console.log("4. Always trim user input");
console.log("5. Normalize case once for comparisons");
console.log("6. Use optional chaining for safe access");
console.log("7. Escape HTML to prevent XSS");
console.log("8. Cache regex patterns");
console.log("9. Handle empty/null strings");
console.log("10. Use constants for magic strings");