/**
 * Lab 132: Arrow Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Arrow function syntax and behavior:
 * 
 * - Shorter syntax
 * - Lexical this binding
 * - Implicit return
 * - No arguments object
 * - Cannot be used as constructors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert functions to arrows
 * 2. Understand this binding
 * 3. Use implicit returns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Syntax
console.log("--- Basic Syntax ---");

// Traditional function
const add1 = function(a, b) {
    return a + b;
};

// Arrow function
const add2 = (a, b) => {
    return a + b;
};

// Arrow with implicit return
const add3 = (a, b) => a + b;

console.log("Traditional:", add1(2, 3));
console.log("Arrow:", add2(2, 3));
console.log("Implicit return:", add3(2, 3));

// Solution 2: Single Parameter
console.log("\n--- Single Parameter ---");

// Parentheses optional for single parameter
const double = x => x * 2;
const greet = name => `Hello, ${name}!`;

console.log("Double:", double(5));
console.log("Greet:", greet("World"));

// Solution 3: No Parameters
console.log("\n--- No Parameters ---");

const sayHello = () => "Hello!";
const getTimestamp = () => Date.now();

console.log(sayHello());
console.log("Timestamp:", getTimestamp());

// Solution 4: Returning Objects
console.log("\n--- Returning Objects ---");

// Wrap object in parentheses for implicit return
const createUser = (name, age) => ({ name, age });
const getCoords = () => ({ x: 10, y: 20 });

console.log("User:", createUser("John", 30));
console.log("Coords:", getCoords());

// Solution 5: Lexical this
console.log("\n--- Lexical this ---");

// Traditional function - this depends on how it's called
const obj1 = {
    name: "Object 1",
    greet: function() {
        setTimeout(function() {
            // console.log(this.name); // undefined - this is window/global
        }, 100);
    }
};

// Arrow function - this is lexically bound
const obj2 = {
    name: "Object 2",
    greet: function() {
        setTimeout(() => {
            console.log("Arrow this:", this.name); // "Object 2"
        }, 100);
    }
};

obj2.greet();

// Solution 6: Array Methods
console.log("\n--- Array Methods ---");

const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Chaining
const result = numbers
    .filter(n => n > 2)
    .map(n => n * 2)
    .reduce((acc, n) => acc + n, 0);
console.log("Chained result:", result);

// Solution 7: No arguments Object
console.log("\n--- No arguments Object ---");

// Traditional function has arguments
function traditional() {
    console.log("Arguments:", Array.from(arguments));
}
traditional(1, 2, 3);

// Arrow function - use rest parameters
const arrow = (...args) => {
    console.log("Rest args:", args);
};
arrow(1, 2, 3);

// Solution 8: Cannot be Constructors
console.log("\n--- Not Constructors ---");

// Traditional function can be constructor
function Person(name) {
    this.name = name;
}
const person = new Person("John");
console.log("Constructor:", person);

// Arrow function cannot
const PersonArrow = (name) => {
    this.name = name;
};
// const person2 = new PersonArrow("Jane"); // Error!

// Solution 9: Method Shorthand vs Arrow
console.log("\n--- Methods ---");

const calculator = {
    value: 0,
    
    // Method shorthand (recommended for methods)
    add(n) {
        this.value += n;
        return this;
    },
    
    // Arrow (this won't work correctly as method)
    // subtract: (n) => { this.value -= n; } // Wrong!
    
    // Arrow in callback (works because of lexical this)
    addAsync(n) {
        setTimeout(() => {
            this.value += n;
            console.log("Async value:", this.value);
        }, 100);
    }
};

calculator.add(5).add(3);
console.log("Calculator value:", calculator.value);
calculator.addAsync(2);

// Solution 10: IIFE with Arrow
console.log("\n--- IIFE ---");

// Immediately Invoked Arrow Function
const result2 = (() => {
    const secret = "hidden";
    return secret.toUpperCase();
})();

console.log("IIFE result:", result2);

// Summary
console.log("\n--- Summary ---");
console.log("Arrow functions:");
console.log("- Shorter syntax");
console.log("- Lexical this binding");
console.log("- Great for callbacks");
console.log("- Cannot be constructors");
console.log("- No arguments object");

