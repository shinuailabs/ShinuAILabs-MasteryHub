/**
 * Lab 045: Return Values
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Functions can return values using the return statement.
 * 
 * Key points:
 * - return exits the function immediately
 * - Can return any type (primitive, object, function)
 * - No return = returns undefined
 * - Can have multiple return statements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Return different types
 * 2. Use early returns
 * 3. Return multiple values
 * 4. Return functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Returning Primitives
console.log("--- Returning Primitives ---");

function getNumber() { return 42; }
function getString() { return "Hello"; }
function getBoolean() { return true; }

console.log("Number:", getNumber());
console.log("String:", getString());
console.log("Boolean:", getBoolean());

// Solution 2: Returning Objects
console.log("\n--- Returning Objects ---");

function createPerson(name, age) {
    return {
        name: name,
        age: age,
        greet() {
            return `Hi, I'm ${this.name}`;
        }
    };
}

const person = createPerson("Alice", 25);
console.log("Person:", person);
console.log("Greeting:", person.greet());

// Solution 3: Returning Arrays
console.log("\n--- Returning Arrays ---");

function getMinMax(numbers) {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    return [min, max];
}

const [min, max] = getMinMax([5, 2, 8, 1, 9]);
console.log(`Min: ${min}, Max: ${max}`);

// Solution 4: No Return (undefined)
console.log("\n--- No Return ---");

function logMessage(msg) {
    console.log("LOG:", msg);
    // No return statement
}

const result = logMessage("Test");
console.log("Return value:", result); // undefined

// Solution 5: Early Return (Guard Clauses)
console.log("\n--- Early Return ---");

function divide(a, b) {
    if (b === 0) {
        return null; // Early return for error case
    }
    return a / b;
}

console.log("10 / 2 =", divide(10, 2));
console.log("10 / 0 =", divide(10, 0));

// Solution 6: Multiple Return Statements
console.log("\n--- Multiple Returns ---");

function getGrade(score) {
    if (score >= 90) return { grade: "A", status: "Excellent" };
    if (score >= 80) return { grade: "B", status: "Good" };
    if (score >= 70) return { grade: "C", status: "Average" };
    if (score >= 60) return { grade: "D", status: "Below Average" };
    return { grade: "F", status: "Failing" };
}

console.log("Score 95:", getGrade(95));
console.log("Score 72:", getGrade(72));

// Solution 7: Returning Functions
console.log("\n--- Returning Functions ---");

function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("Double 5:", double(5));
console.log("Triple 5:", triple(5));

// Solution 8: Returning Promises
console.log("\n--- Returning Promises ---");

function fetchData(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, data: "Sample data" });
            } else {
                reject(new Error("Invalid ID"));
            }
        }, 100);
    });
}

fetchData(1).then(data => console.log("Fetched:", data));

// Solution 9: Returning Multiple Values via Object
console.log("\n--- Multiple Values (Object) ---");

function analyzeArray(arr) {
    return {
        length: arr.length,
        sum: arr.reduce((a, b) => a + b, 0),
        average: arr.reduce((a, b) => a + b, 0) / arr.length,
        min: Math.min(...arr),
        max: Math.max(...arr)
    };
}

const stats = analyzeArray([1, 2, 3, 4, 5]);
console.log("Stats:", stats);

// Solution 10: Conditional Return Types
console.log("\n--- Conditional Return ---");

function processInput(input) {
    if (typeof input === "string") {
        return input.toUpperCase();
    }
    if (typeof input === "number") {
        return input * 2;
    }
    if (Array.isArray(input)) {
        return input.length;
    }
    return null;
}

console.log("String:", processInput("hello"));
console.log("Number:", processInput(21));
console.log("Array:", processInput([1, 2, 3]));
console.log("Other:", processInput({}));

// Solution 11: Return vs Console.log
console.log("\n--- Return vs Console.log ---");

// BAD: Only logs, doesn't return
function addBad(a, b) {
    console.log(a + b);
}

// GOOD: Returns value (can also log if needed)
function addGood(a, b) {
    return a + b;
}

const badResult = addBad(1, 2);  // undefined
const goodResult = addGood(1, 2); // 3

console.log("Bad result:", badResult);
console.log("Good result:", goodResult);
console.log("Can chain:", addGood(addGood(1, 2), 3));

