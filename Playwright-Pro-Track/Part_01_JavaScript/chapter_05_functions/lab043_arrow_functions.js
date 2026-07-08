/**
 * Lab 043: Arrow Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Arrow functions provide a shorter syntax for function expressions.
 * 
 * Syntax variations:
 * - (a, b) => a + b           // Implicit return
 * - (a, b) => { return a + b; } // Explicit return
 * - a => a * 2                // Single parameter (no parens)
 * - () => console.log("Hi")   // No parameters
 * 
 * Key differences from regular functions:
 * - No own 'this' binding
 * - No 'arguments' object
 * - Cannot be used as constructors
 * - No hoisting
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert functions to arrow syntax
 * 2. Understand implicit vs explicit return
 * 3. Know when NOT to use arrow functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Arrow Function
console.log("--- Basic Arrow Function ---");

const greet = () => {
    console.log("Hello from arrow function!");
};

greet();

// Solution 2: With Parameters
console.log("\n--- With Parameters ---");

const add = (a, b) => {
    return a + b;
};

console.log("5 + 3 =", add(5, 3));

// Solution 3: Implicit Return (Single Expression)
console.log("\n--- Implicit Return ---");

const multiply = (a, b) => a * b;
console.log("5 * 3 =", multiply(5, 3));

const square = n => n * n; // Single param: no parens needed
console.log("5² =", square(5));

// Solution 4: Returning Objects
console.log("\n--- Returning Objects ---");

// Must wrap object in parentheses for implicit return
const createUser = (name, age) => ({ name, age });
console.log("User:", createUser("Alice", 25));

// Or use explicit return
const createUserExplicit = (name, age) => {
    return { name, age };
};

// Solution 5: Array Methods with Arrows
console.log("\n--- Array Methods ---");

const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// filter
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Solution 6: Chaining with Arrows
console.log("\n--- Chaining ---");

const result = numbers
    .filter(n => n > 2)
    .map(n => n * 10)
    .reduce((acc, n) => acc + n, 0);

console.log("Filter > 2, multiply by 10, sum:", result);

// Solution 7: Arrow Functions and 'this'
console.log("\n--- Arrow and 'this' ---");

const obj = {
    name: "Object",
    
    // Regular function: has own 'this'
    regularMethod: function() {
        console.log("Regular this.name:", this.name);
    },
    
    // Arrow function: inherits 'this' from enclosing scope
    arrowMethod: () => {
        console.log("Arrow this.name:", this.name); // undefined (global this)
    },
    
    // Practical use: arrow in callback
    delayedGreet: function() {
        setTimeout(() => {
            // Arrow inherits 'this' from delayedGreet
            console.log("Delayed:", this.name);
        }, 100);
    }
};

obj.regularMethod();
obj.arrowMethod();
obj.delayedGreet();

// Solution 8: When NOT to Use Arrow Functions
console.log("\n--- When NOT to Use Arrows ---");

// 1. Object methods (need 'this')
const person = {
    name: "John",
    // BAD: Arrow doesn't have own 'this'
    // greet: () => console.log(this.name),
    
    // GOOD: Regular function
    greet() {
        console.log("Hello, I'm", this.name);
    }
};
person.greet();

// 2. Event handlers (need 'this' to reference element)
// element.addEventListener('click', function() {
//     this.classList.toggle('active'); // 'this' is the element
// });

// 3. Constructors (arrows can't be constructors)
// const Person = (name) => { this.name = name; }; // Error!

// Solution 9: Converting Regular to Arrow
console.log("\n--- Conversion Examples ---");

// Regular
function addRegular(a, b) {
    return a + b;
}

// Arrow
const addArrow = (a, b) => a + b;

// Regular with body
function processRegular(data) {
    const cleaned = data.trim();
    const upper = cleaned.toUpperCase();
    return upper;
}

// Arrow with body
const processArrow = (data) => {
    const cleaned = data.trim();
    const upper = cleaned.toUpperCase();
    return upper;
};

console.log("Regular:", addRegular(1, 2));
console.log("Arrow:", addArrow(1, 2));

// Solution 10: Higher-Order Functions
console.log("\n--- Higher-Order Functions ---");

const createMultiplier = (factor) => (number) => number * factor;

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("Double 5:", double(5));
console.log("Triple 5:", triple(5));

// Solution 11: Quick Reference
console.log("\n--- Quick Reference ---");
console.log("() => expression        // No params, implicit return");
console.log("x => expression         // One param, implicit return");
console.log("(x, y) => expression    // Multiple params, implicit return");
console.log("() => ({ key: value })  // Return object literal");
console.log("() => { statements }    // Multiple statements, explicit return");

