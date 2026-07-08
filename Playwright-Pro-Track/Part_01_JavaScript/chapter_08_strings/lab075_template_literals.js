/**
 * Lab 075: Template Literals
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Template literals use backticks (`) and provide:
 * 
 * - String interpolation: ${expression}
 * - Multi-line strings
 * - Tagged templates
 * - Raw strings
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use interpolation
 * 2. Create multi-line strings
 * 3. Create tagged templates
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interpolation
console.log("--- Basic Interpolation ---");

const name = "Alice";
const age = 25;

console.log(`Name: ${name}`);
console.log(`Age: ${age}`);
console.log(`Next year: ${age + 1}`);

// Solution 2: Expressions
console.log("\n--- Expressions ---");

const a = 10;
const b = 20;

console.log(`Sum: ${a + b}`);
console.log(`Product: ${a * b}`);
console.log(`Ternary: ${a > b ? "a is greater" : "b is greater"}`);

// Function calls
console.log(`Uppercase: ${name.toUpperCase()}`);
console.log(`Random: ${Math.floor(Math.random() * 100)}`);

// Solution 3: Multi-line Strings
console.log("\n--- Multi-line ---");

const html = `
<div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
</div>
`;
console.log("HTML:", html);

// Preserve indentation
const poem = `
    Roses are red,
    Violets are blue,
    Template literals,
    Are awesome too!
`;
console.log("Poem:", poem);

// Solution 4: Nested Templates
console.log("\n--- Nested Templates ---");

const items = ["apple", "banana", "orange"];

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
console.log(highlight`The ${product} costs $${price}`);

// Solution 6: HTML Escaping Tag
console.log("\n--- HTML Escape Tag ---");

function escapeHtml(strings, ...values) {
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

const userInput = '<script>alert("xss")</script>';
console.log(escapeHtml`User said: ${userInput}`);

// Solution 7: SQL Tag (Example)
console.log("\n--- SQL Tag ---");

function sql(strings, ...values) {
    const query = strings.reduce((result, str, i) => {
        return result + str + (values[i] !== undefined ? "?" : "");
    }, "");
    
    return {
        query: query.trim(),
        params: values
    };
}

const userId = 123;
const status = "active";
const result = sql`SELECT * FROM users WHERE id = ${userId} AND status = ${status}`;
console.log("SQL:", result);

// Solution 8: String.raw
console.log("\n--- String.raw ---");

// Normal template - escapes are processed
console.log(`Line1\nLine2`);

// String.raw - escapes are not processed
console.log(String.raw`Line1\nLine2`);

// Useful for regex
const regex = new RegExp(String.raw`\d+\.\d+`);
console.log("Regex test:", regex.test("3.14"));

// Solution 9: Conditional Content
console.log("\n--- Conditional Content ---");

const user = { name: "Bob", isAdmin: true, email: null };

const profile = `
User: ${user.name}
${user.isAdmin ? "Role: Administrator" : "Role: User"}
${user.email ? `Email: ${user.email}` : "Email: Not provided"}
`;
console.log("Profile:", profile);

// Solution 10: Building Complex Strings
console.log("\n--- Complex Strings ---");

function generateReport(data) {
    return `
=================================
        SALES REPORT
=================================
Date: ${new Date().toLocaleDateString()}

Items Sold:
${data.items.map(item => `  - ${item.name}: $${item.price}`).join("\n")}

---------------------------------
Total: $${data.items.reduce((sum, item) => sum + item.price, 0)}
=================================
    `.trim();
}

const reportData = {
    items: [
        { name: "Widget", price: 25 },
        { name: "Gadget", price: 50 },
        { name: "Gizmo", price: 30 }
    ]
};

console.log(generateReport(reportData));

