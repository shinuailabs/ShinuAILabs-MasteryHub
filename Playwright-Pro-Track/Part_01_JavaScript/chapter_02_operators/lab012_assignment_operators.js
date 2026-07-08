/**
 * Lab 012: Assignment Operators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Assignment operators assign values to variables:
 * 
 * =   Simple assignment
 * +=  Addition assignment (x += y → x = x + y)
 * -=  Subtraction assignment
 * *=  Multiplication assignment
 * /=  Division assignment
 * %=  Modulus assignment
 * **= Exponentiation assignment
 * 
 * Also: &&=, ||=, ??= (ES2021)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use compound assignment operators
 * 2. Understand logical assignment operators
 * 3. Apply in practical scenarios
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Assignment
console.log("--- Basic Assignment ---");
let x = 10;
console.log("x =", x);

// Solution 2: Compound Assignment Operators
console.log("\n--- Compound Assignment ---");
let num = 20;

num += 5;  // num = num + 5
console.log("num += 5:", num);  // 25

num -= 3;  // num = num - 3
console.log("num -= 3:", num);  // 22

num *= 2;  // num = num * 2
console.log("num *= 2:", num);  // 44

num /= 4;  // num = num / 4
console.log("num /= 4:", num);  // 11

num %= 3;  // num = num % 3
console.log("num %= 3:", num);  // 2

num **= 4; // num = num ** 4
console.log("num **= 4:", num); // 16

// Solution 3: String Concatenation Assignment
console.log("\n--- String Assignment ---");
let message = "Hello";
message += " ";
message += "World";
message += "!";
console.log("message:", message); // "Hello World!"

// Solution 4: Logical AND Assignment (&&=)
console.log("\n--- Logical AND Assignment (&&=) ---");
// Assigns if left side is truthy

let a = 1;
let b = 0;

a &&= 100; // a is truthy, so assign 100
console.log("a &&= 100:", a); // 100

b &&= 100; // b is falsy (0), so no assignment
console.log("b &&= 100:", b); // 0

// Solution 5: Logical OR Assignment (||=)
console.log("\n--- Logical OR Assignment (||=) ---");
// Assigns if left side is falsy

let c = 0;
let d = 5;

c ||= 50; // c is falsy, so assign 50
console.log("c ||= 50:", c); // 50

d ||= 50; // d is truthy, so no assignment
console.log("d ||= 50:", d); // 5

// Practical: Default values
let username = "";
username ||= "Anonymous";
console.log("username:", username); // "Anonymous"

// Solution 6: Nullish Coalescing Assignment (??=)
console.log("\n--- Nullish Assignment (??=) ---");
// Assigns only if left side is null or undefined

let e = null;
let f = 0;
let g = "";

e ??= "default"; // e is null, so assign
console.log("e ??= 'default':", e); // "default"

f ??= "default"; // f is 0 (not nullish), no assign
console.log("f ??= 'default':", f); // 0

g ??= "default"; // g is "" (not nullish), no assign
console.log("g ??= 'default':", g); // ""

// Solution 7: Practical Examples
console.log("\n--- Practical Examples ---");

// Running total
let total = 0;
const prices = [10.50, 25.99, 8.75, 15.00];
for (const price of prices) {
    total += price;
}
console.log("Total:", total.toFixed(2));

// Build query string
let query = "SELECT * FROM users WHERE 1=1";
const activeOnly = true;
const minAge = 18;

if (activeOnly) query += " AND active = true";
if (minAge) query += ` AND age >= ${minAge}`;
console.log("Query:", query);

// Counter with compound operators
let counter = 0;
console.log("\nCounting:");
console.log(counter += 1); // 1
console.log(counter += 1); // 2
console.log(counter += 1); // 3

// Config object with defaults using ??=
const config = {
    timeout: null,
    retries: undefined,
    debug: false
};

config.timeout ??= 5000;
config.retries ??= 3;
config.debug ??= true; // Won't change, false is not nullish

console.log("\nConfig:", config);

