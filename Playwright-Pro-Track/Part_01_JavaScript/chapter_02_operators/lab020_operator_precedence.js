/**
 * Lab 020: Operator Precedence
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Operator precedence determines the order in which operators are evaluated.
 * Higher precedence operators are evaluated first.
 * 
 * Precedence (high to low):
 * 1. () Grouping
 * 2. . [] () Member/Call
 * 3. ++ -- Postfix
 * 4. ! ~ ++ -- typeof Unary
 * 5. ** Exponentiation
 * 6. * / % Multiplication
 * 7. + - Addition
 * 8. < > <= >= Relational
 * 9. == != === !== Equality
 * 10. && Logical AND
 * 11. || Logical OR
 * 12. ?? Nullish
 * 13. ?: Ternary
 * 14. = += -= Assignment
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand precedence without parentheses
 * 2. Use parentheses for clarity
 * 3. Understand associativity
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Precedence
console.log("--- Basic Precedence ---");

// Multiplication before addition
console.log("2 + 3 * 4 =", 2 + 3 * 4);     // 14 (not 20)
console.log("(2 + 3) * 4 =", (2 + 3) * 4); // 20

// Division before subtraction
console.log("10 - 6 / 2 =", 10 - 6 / 2);   // 7 (not 2)

// Exponentiation is right-to-left
console.log("2 ** 3 ** 2 =", 2 ** 3 ** 2); // 512 (2^9, not 8^2)
console.log("(2 ** 3) ** 2 =", (2 ** 3) ** 2); // 64

// Solution 2: Comparison and Logical
console.log("\n--- Comparison and Logical ---");

// Comparison before logical
console.log("5 > 3 && 2 < 4:", 5 > 3 && 2 < 4); // true && true = true

// AND before OR
console.log("true || false && false:", true || false && false); // true
// Evaluated as: true || (false && false) = true

console.log("(true || false) && false:", (true || false) && false); // false

// NOT before AND/OR
console.log("!false && true:", !false && true); // true
console.log("!(false && true):", !(false && true)); // true

// Solution 3: Mixed Operations
console.log("\n--- Mixed Operations ---");

const a = 5, b = 3, c = 2;

// Without parentheses - hard to read
const result1 = a + b * c > 10 && a - c < 5;
console.log("Complex without parens:", result1);

// With parentheses - clear intent
const result2 = ((a + (b * c)) > 10) && ((a - c) < 5);
console.log("Complex with parens:", result2);

// Solution 4: Assignment Precedence
console.log("\n--- Assignment Precedence ---");

// Assignment is right-to-left and low precedence
let x, y, z;
x = y = z = 5;  // All get 5
console.log("x, y, z:", x, y, z);

// Expression is evaluated before assignment
let num = 10;
num = num + 5 * 2;  // num = 10 + 10 = 20
console.log("num:", num);

// Solution 5: Ternary Precedence
console.log("\n--- Ternary Precedence ---");

const score = 75;

// Ternary has low precedence
const message = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
console.log("Grade:", message); // C

// Parentheses make it clearer
const message2 = score >= 90 ? "A" : (score >= 80 ? "B" : (score >= 70 ? "C" : "F"));
console.log("Grade (parens):", message2);

// Solution 6: typeof and Other Unary
console.log("\n--- Unary Operators ---");

console.log("typeof 5 + ' is number':", typeof 5 + " is number"); // "number is number"
console.log("typeof (5 + ' is'):", typeof (5 + " is")); // "string"

// Unary plus/minus
console.log("-3 ** 2:", -(3 ** 2)); // -9
// Note: -3 ** 2 is actually a syntax error, use parentheses!
console.log("(-3) ** 2:", (-3) ** 2); // 9

// Solution 7: Associativity
console.log("\n--- Associativity ---");

// Left-to-right: +, -, *, /
console.log("10 - 5 - 2:", 10 - 5 - 2);   // 3 (left-to-right)
console.log("10 - (5 - 2):", 10 - (5 - 2)); // 7

// Right-to-left: =, **, ?:
console.log("2 ** 2 ** 3:", 2 ** 2 ** 3);     // 256 (right-to-left)
console.log("(2 ** 2) ** 3:", (2 ** 2) ** 3); // 64

// Solution 8: Best Practices
console.log("\n--- Best Practices ---");

// ALWAYS use parentheses for:

// 1. Mixed logical operators
const condition = (a > b) && (c < d) || (e === f); // Unclear
const betterCondition = ((a > b) && (c < d)) || (e === f); // Clear

// 2. Negating comparisons
const notGreater = !(a > b);  // Clear: not (a > b)

// 3. Compound conditions
const isValid = (value !== null) && (value !== undefined) && (value.length > 0);

// 4. Ternary in templates
const status = `Status: ${(count > 0) ? "has items" : "empty"}`;

// Example: Readable complex expression
const canPurchase = (
    (user.isLoggedIn === true) &&
    (user.age >= 18) &&
    ((user.balance >= price) || (user.hasCredit === true))
);

console.log("Use parentheses for clarity!");

// Quick reference
console.log("\n--- Quick Reference ---");
console.log("Remember: PEMDAS for math");
console.log("Remember: NOT > AND > OR for logic");
console.log("When in doubt, use parentheses!");

