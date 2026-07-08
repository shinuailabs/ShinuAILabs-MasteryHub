/**
 * Lab 013: Comparison Operators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Comparison operators compare values and return boolean:
 * 
 * ==   Equal (loose, with coercion)
 * ===  Strict equal (no coercion)
 * !=   Not equal (loose)
 * !==  Strict not equal
 * >    Greater than
 * <    Less than
 * >=   Greater than or equal
 * <=   Less than or equal
 * 
 * Best Practice: Always use === and !== to avoid type coercion bugs.
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand == vs === difference
 * 2. Compare different data types
 * 3. Use comparison operators in conditions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Loose Equality (==) - With Type Coercion
console.log("--- Loose Equality (==) ---");
console.log('5 == 5:', 5 == 5);           // true
console.log('5 == "5":', 5 == "5");       // true (coercion!)
console.log('0 == false:', 0 == false);   // true
console.log('1 == true:', 1 == true);     // true
console.log('"" == 0:', "" == 0);         // true
console.log('null == undefined:', null == undefined); // true
console.log('"0" == false:', "0" == false); // true (confusing!)

// Solution 2: Strict Equality (===) - No Type Coercion
console.log("\n--- Strict Equality (===) ---");
console.log('5 === 5:', 5 === 5);           // true
console.log('5 === "5":', 5 === "5");       // false
console.log('0 === false:', 0 === false);   // false
console.log('1 === true:', 1 === true);     // false
console.log('"" === 0:', "" === 0);         // false
console.log('null === undefined:', null === undefined); // false

// Solution 3: Inequality
console.log("\n--- Inequality ---");
console.log('5 != "5":', 5 != "5");     // false (loose)
console.log('5 !== "5":', 5 !== "5");   // true (strict)
console.log('5 != 6:', 5 != 6);         // true
console.log('5 !== 5:', 5 !== 5);       // false

// Solution 4: Relational Operators
console.log("\n--- Relational Operators ---");
console.log('10 > 5:', 10 > 5);     // true
console.log('10 < 5:', 10 < 5);     // false
console.log('10 >= 10:', 10 >= 10); // true
console.log('10 <= 9:', 10 <= 9);   // false

// String comparison (lexicographic)
console.log("\n--- String Comparison ---");
console.log('"apple" < "banana":', "apple" < "banana"); // true
console.log('"2" > "10":', "2" > "10");     // true (string comparison!)
console.log('"A" < "a":', "A" < "a");       // true (A=65, a=97)

// Solution 5: Comparing Different Types
console.log("\n--- Mixed Type Comparison ---");
console.log('"10" > 9:', "10" > 9);         // true (converts to number)
console.log('null > 0:', null > 0);         // false
console.log('null == 0:', null == 0);       // false
console.log('null >= 0:', null >= 0);       // true (confusing!)

// Solution 6: Object Comparison
console.log("\n--- Object Comparison ---");
const obj1 = { name: "John" };
const obj2 = { name: "John" };
const obj3 = obj1;

console.log('obj1 == obj2:', obj1 == obj2);   // false (different references)
console.log('obj1 === obj2:', obj1 === obj2); // false
console.log('obj1 === obj3:', obj1 === obj3); // true (same reference)

// To compare object values, use JSON or custom comparison
console.log('JSON compare:', JSON.stringify(obj1) === JSON.stringify(obj2)); // true

// Solution 7: Practical Examples
console.log("\n--- Practical Examples ---");

// Age validation
const age = 18;
const canVote = age >= 18;
const canDrink = age >= 21;
console.log("Can vote:", canVote);
console.log("Can drink:", canDrink);

// Grade checking
const score = 85;
let grade;
if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else if (score >= 60) grade = "D";
else grade = "F";
console.log(`Score ${score} = Grade ${grade}`);

// Range checking
const value = 50;
const inRange = value >= 0 && value <= 100;
console.log(`${value} is in range 0-100:`, inRange);

// Best Practice Example
function validateInput(input) {
    // Always use strict equality
    if (input === null || input === undefined) {
        return "Invalid input";
    }
    if (typeof input !== "string") {
        return "Input must be a string";
    }
    return "Valid";
}

console.log(validateInput(null));      // "Invalid input"
console.log(validateInput(123));       // "Input must be a string"
console.log(validateInput("hello"));   // "Valid"

