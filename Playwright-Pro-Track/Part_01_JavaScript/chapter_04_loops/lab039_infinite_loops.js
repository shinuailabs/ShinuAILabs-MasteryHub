/**
 * Lab 039: Avoiding Infinite Loops
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * An infinite loop runs forever because its exit condition is never met.
 * 
 * Common causes:
 * - Forgetting to update loop variable
 * - Wrong condition direction
 * - Logic errors
 * - Off-by-one errors
 * 
 * Prevention:
 * - Always ensure progress toward exit
 * - Add safety limits
 * - Use debugging techniques
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify infinite loop patterns
 * 2. Add safety mechanisms
 * 3. Debug loop issues
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Common Mistake - Forgot Increment
console.log("--- Forgot Increment (FIXED) ---");

// BAD: Would be infinite
// let i = 0;
// while (i < 5) {
//     console.log(i);
//     // Forgot i++
// }

// FIXED:
let i = 0;
while (i < 5) {
    console.log("Count:", i);
    i++; // Don't forget this!
}

// Solution 2: Wrong Condition Direction
console.log("\n--- Wrong Direction (FIXED) ---");

// BAD: Would be infinite
// for (let i = 0; i >= 0; i++) { } // Always true!

// FIXED:
for (let j = 0; j < 5; j++) {
    console.log("Correct direction:", j);
}

// Solution 3: Condition Never Becomes False
console.log("\n--- Unreachable Exit (FIXED) ---");

// BAD: n never reaches 100 (only evens)
// let n = 0;
// while (n !== 100) {
//     n += 3; // 0, 3, 6... 99, 102 - skips 100!
// }

// FIXED: Use <= or >= instead of !==
let n = 0;
while (n < 100) {
    n += 3;
}
console.log("Stopped at n =", n);

// Solution 4: Safety Limit Pattern
console.log("\n--- Safety Limit ---");
const MAX_ITERATIONS = 1000;
let iterations = 0;
let value = 1;

while (value < 1000000) {
    value *= 2;
    iterations++;
    
    // Safety check
    if (iterations > MAX_ITERATIONS) {
        console.log("Safety limit reached!");
        break;
    }
}
console.log(`Completed in ${iterations} iterations, value = ${value}`);

// Solution 5: Timeout Pattern
console.log("\n--- Time-based Safety ---");
const startTime = Date.now();
const timeLimit = 100; // milliseconds
let count = 0;

while (true) {
    count++;
    
    // Check time elapsed
    if (Date.now() - startTime > timeLimit) {
        console.log("Time limit reached");
        break;
    }
    
    // Simulate work
    if (count % 10000 === 0) {
        console.log(`Processed ${count} items...`);
    }
    
    // Normal exit condition
    if (count >= 100000) {
        console.log("Normal completion");
        break;
    }
}

// Solution 6: Detecting Infinite Loops While Coding
console.log("\n--- Loop Verification Checklist ---");
console.log("1. Is the loop variable initialized?");
console.log("2. Is the condition correct? (< vs <=, etc.)");
console.log("3. Is the loop variable updated?");
console.log("4. Does the update move toward exit?");
console.log("5. Are there edge cases that skip the update?");

// Solution 7: Debugging with Logging
console.log("\n--- Debug with Logging ---");
function debugLoop(maxItems) {
    let processed = 0;
    let debugCount = 0;
    const debugLimit = 10;
    
    while (processed < maxItems) {
        processed++;
        
        // Limit debug output
        if (debugCount < debugLimit) {
            console.log(`Debug: processed = ${processed}`);
            debugCount++;
        }
        
        if (processed === debugLimit) {
            console.log(`... (${maxItems - debugLimit} more iterations)`);
        }
    }
    
    return processed;
}

debugLoop(20);

// Solution 8: Recursive Infinite Loop
console.log("\n--- Recursive Safety ---");
function recursiveWithSafety(n, depth = 0) {
    const MAX_DEPTH = 100;
    
    // Safety check
    if (depth > MAX_DEPTH) {
        console.log("Max recursion depth reached");
        return;
    }
    
    // Base case
    if (n <= 0) {
        return;
    }
    
    console.log(`Depth ${depth}: n = ${n}`);
    recursiveWithSafety(n - 1, depth + 1);
}

recursiveWithSafety(5);

// Solution 9: Common Patterns That Cause Issues
console.log("\n--- Watch Out For ---");

// Floating point comparison
let x = 0;
let loopCount = 0;
while (x !== 1.0 && loopCount < 20) { // !== with floats is risky
    x += 0.1;
    loopCount++;
}
console.log(`Float loop: x = ${x}, iterations = ${loopCount}`);
console.log("Tip: Use x < 1.0 instead of x !== 1.0");

// Solution 10: Using do...while Safely
console.log("\n--- Safe do...while ---");
let attempts = 0;
const maxAttempts = 5;

do {
    attempts++;
    console.log(`Attempt ${attempts}`);
    
    const success = attempts >= 3;
    if (success) {
        console.log("Success!");
        break;
    }
} while (attempts < maxAttempts);

if (attempts >= maxAttempts) {
    console.log("Max attempts reached");
}

