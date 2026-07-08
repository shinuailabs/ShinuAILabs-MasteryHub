/**
 * Lab 007: Variable Scope Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Scope determines where variables are accessible in your code.
 * 
 * Types of scope:
 * - Global Scope: Accessible everywhere
 * - Function Scope: Accessible only within the function (var)
 * - Block Scope: Accessible only within the block {} (let, const)
 * 
 * Key differences:
 * - var: function-scoped
 * - let/const: block-scoped
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand global scope
 * 2. Understand function scope
 * 3. Understand block scope
 * 4. See scope chain in action
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Global Scope
console.log("--- Global Scope ---");
var globalVar = "I am global (var)";
let globalLet = "I am global (let)";
const globalConst = "I am global (const)";

function accessGlobals() {
    console.log("Inside function - globalVar:", globalVar);
    console.log("Inside function - globalLet:", globalLet);
    console.log("Inside function - globalConst:", globalConst);
}

accessGlobals();

// Solution 2: Function Scope
console.log("\n--- Function Scope ---");
function functionScopeDemo() {
    var functionVar = "I am function scoped";
    let functionLet = "I am also function scoped";
    
    console.log("Inside function:", functionVar);
    console.log("Inside function:", functionLet);
}

functionScopeDemo();
// console.log(functionVar); // ReferenceError: functionVar is not defined
// console.log(functionLet); // ReferenceError: functionLet is not defined

// Solution 3: Block Scope
console.log("\n--- Block Scope ---");
if (true) {
    var blockVar = "var is NOT block scoped";
    let blockLet = "let IS block scoped";
    const blockConst = "const IS block scoped";
    
    console.log("Inside block - blockVar:", blockVar);
    console.log("Inside block - blockLet:", blockLet);
    console.log("Inside block - blockConst:", blockConst);
}

console.log("Outside block - blockVar:", blockVar); // Works!
// console.log("Outside block - blockLet:", blockLet); // ReferenceError
// console.log("Outside block - blockConst:", blockConst); // ReferenceError

// Solution 4: Loop Scope Example
console.log("\n--- Loop Scope ---");

// var in loop - shares same variable
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var i:", i), 100);
}
// Prints: 3, 3, 3 (all same value!)

// let in loop - new variable each iteration
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let j:", j), 200);
}
// Prints: 0, 1, 2 (correct values!)

// Solution 5: Scope Chain
console.log("\n--- Scope Chain ---");
const outerVar = "outer";

function outerFunction() {
    const middleVar = "middle";
    
    function innerFunction() {
        const innerVar = "inner";
        
        // Can access all variables in scope chain
        console.log("innerVar:", innerVar);
        console.log("middleVar:", middleVar);
        console.log("outerVar:", outerVar);
    }
    
    innerFunction();
    // console.log(innerVar); // ReferenceError
}

outerFunction();

// Solution 6: Shadowing
console.log("\n--- Variable Shadowing ---");
const shadowVar = "global";

function shadowDemo() {
    const shadowVar = "function level"; // Shadows global
    console.log("Function level:", shadowVar);
    
    if (true) {
        const shadowVar = "block level"; // Shadows function level
        console.log("Block level:", shadowVar);
    }
    
    console.log("Back to function level:", shadowVar);
}

shadowDemo();
console.log("Global level:", shadowVar);

