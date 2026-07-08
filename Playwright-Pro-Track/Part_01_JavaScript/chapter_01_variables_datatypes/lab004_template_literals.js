/**
 * Lab 004: Template Literals (Template Strings)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Template literals are string literals using backticks (`).
 * Features:
 * - String interpolation with ${expression}
 * - Multi-line strings without escape characters
 * - Embedded expressions and function calls
 * - Tagged templates for advanced use
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create strings with variable interpolation
 * 2. Create multi-line strings
 * 3. Use expressions inside template literals
 * 4. Nest template literals
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic String Interpolation
console.log("--- String Interpolation ---");
const firstName = "John";
const lastName = "Doe";
const age = 25;

// Old way (concatenation)
const oldWay = "Hello, " + firstName + " " + lastName + "! You are " + age + " years old.";
console.log("Old way:", oldWay);

// New way (template literals)
const newWay = `Hello, ${firstName} ${lastName}! You are ${age} years old.`;
console.log("New way:", newWay);

// Solution 2: Multi-line Strings
console.log("\n--- Multi-line Strings ---");

// Old way
const oldMultiline = "Line 1\n" +
    "Line 2\n" +
    "Line 3";

// New way
const newMultiline = `Line 1
Line 2
Line 3`;

console.log("Template multi-line:\n", newMultiline);

// Solution 3: Expressions in Template Literals
console.log("\n--- Expressions ---");
const price = 19.99;
const quantity = 3;
const taxRate = 0.08;

const receipt = `
Order Summary:
--------------
Item Price: $${price}
Quantity: ${quantity}
Subtotal: $${(price * quantity).toFixed(2)}
Tax (${taxRate * 100}%): $${(price * quantity * taxRate).toFixed(2)}
Total: $${(price * quantity * (1 + taxRate)).toFixed(2)}
`;
console.log(receipt);

// Solution 4: Function Calls in Templates
console.log("--- Function Calls ---");
const getGreeting = (name) => `Welcome, ${name}!`;
const formatDate = (date) => date.toLocaleDateString();

console.log(`Message: ${getGreeting("Alice")}`);
console.log(`Today is: ${formatDate(new Date())}`);

// Solution 5: Conditional (Ternary) in Templates
console.log("\n--- Conditionals ---");
const score = 85;
const result = `You ${score >= 60 ? 'passed' : 'failed'} the test with ${score} points.`;
console.log(result);

// Solution 6: Nested Template Literals
console.log("\n--- Nested Templates ---");
const items = ['Apple', 'Banana', 'Orange'];
const itemList = `
Shopping List:
${items.map((item, index) => `  ${index + 1}. ${item}`).join('\n')}
`;
console.log(itemList);

// Solution 7: HTML Generation (useful for DOM manipulation)
console.log("--- HTML Generation ---");
const user = { name: "Jane", role: "Admin", active: true };
const userCard = `
<div class="user-card ${user.active ? 'active' : 'inactive'}">
  <h2>${user.name}</h2>
  <p>Role: ${user.role}</p>
  <span class="status">${user.active ? '🟢 Online' : '🔴 Offline'}</span>
</div>
`;
console.log(userCard);

