/**
 * Lab 133: Template Literals
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Template literals (backtick strings):
 * 
 * - String interpolation
 * - Multi-line strings
 * - Tagged templates
 * - Expression embedding
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use string interpolation
 * 2. Create multi-line strings
 * 3. Build tagged templates
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interpolation
console.log("--- Basic Interpolation ---");

const name = "John";
const age = 30;

// Old way
const old = "Hello, " + name + "! You are " + age + " years old.";

// Template literal
const modern = `Hello, ${name}! You are ${age} years old.`;

console.log("Old:", old);
console.log("Modern:", modern);

// Solution 2: Expressions in Templates
console.log("\n--- Expressions ---");

const a = 5;
const b = 10;

console.log(`Sum: ${a + b}`);
console.log(`Product: ${a * b}`);
console.log(`Comparison: ${a > b ? "a is greater" : "b is greater"}`);

// Function calls
const upper = (str) => str.toUpperCase();
console.log(`Uppercase: ${upper("hello")}`);

// Solution 3: Multi-line Strings
console.log("\n--- Multi-line ---");

const multiLine = `
This is a multi-line string.
It preserves line breaks
and indentation.
`;

console.log(multiLine);

// HTML template
const html = `
<div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
</div>
`;

console.log("HTML:", html);

// Solution 4: Nested Templates
console.log("\n--- Nested Templates ---");

const items = ["Apple", "Banana", "Orange"];

const list = `
<ul>
    ${items.map(item => `<li>${item}</li>`).join("\n    ")}
</ul>
`;

console.log("List:", list);

// Solution 5: Tagged Templates
console.log("\n--- Tagged Templates ---");

function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i] !== undefined ? `**${values[i]}**` : "";
        return result + str + value;
    }, "");
}

const product = "laptop";
const price = 999;

const message = highlight`The ${product} costs $${price}`;
console.log("Highlighted:", message);

// Solution 6: Safe HTML Tag
console.log("\n--- Safe HTML ---");

function safeHtml(strings, ...values) {
    const escape = (str) => String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    
    return strings.reduce((result, str, i) => {
        const value = values[i] !== undefined ? escape(values[i]) : "";
        return result + str + value;
    }, "");
}

const userInput = "<script>alert('xss')</script>";
const safe = safeHtml`User said: ${userInput}`;
console.log("Safe HTML:", safe);

// Solution 7: SQL Tag (Example)
console.log("\n--- SQL Tag ---");

function sql(strings, ...values) {
    const query = strings.reduce((result, str, i) => {
        return result + str + (values[i] !== undefined ? `$${i + 1}` : "");
    }, "");
    
    return { query, values };
}

const userId = 123;
const status = "active";
const result = sql`SELECT * FROM users WHERE id = ${userId} AND status = ${status}`;
console.log("SQL:", result);

// Solution 8: Styled Components Pattern
console.log("\n--- Styled Pattern ---");

function css(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] || "");
    }, "");
}

const primaryColor = "#007bff";
const styles = css`
    .button {
        background-color: ${primaryColor};
        padding: 10px 20px;
        border-radius: 4px;
    }
`;

console.log("CSS:", styles);

// Solution 9: Raw Strings
console.log("\n--- Raw Strings ---");

// String.raw preserves escape sequences
const path = String.raw`C:\Users\John\Documents`;
console.log("Raw path:", path);

const regex = String.raw`\d+\.\d+`;
console.log("Raw regex:", regex);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Email template
const createEmail = (to, subject, body) => `
To: ${to}
Subject: ${subject}

${body}

Best regards,
The Team
`;

console.log(createEmail("user@example.com", "Welcome!", "Thanks for signing up."));

// JSON-like structure
const user = {
    name: "John",
    email: "john@example.com",
    roles: ["admin", "user"]
};

const userInfo = `
User: ${user.name}
Email: ${user.email}
Roles: ${user.roles.join(", ")}
`;

console.log("User Info:", userInfo);

