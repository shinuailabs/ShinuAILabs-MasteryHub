/**
 * Lab 049: Recursion
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recursion is when a function calls itself.
 * 
 * Requirements:
 * 1. Base case: Condition to stop recursion
 * 2. Recursive case: Function calls itself with modified input
 * 3. Progress: Each call must move toward base case
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write recursive functions
 * 2. Identify base and recursive cases
 * 3. Understand call stack
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Countdown
console.log("--- Countdown ---");

function countdown(n) {
    // Base case
    if (n <= 0) {
        console.log("Liftoff!");
        return;
    }
    
    // Action
    console.log(n);
    
    // Recursive case
    countdown(n - 1);
}

countdown(5);

// Solution 2: Factorial
console.log("\n--- Factorial ---");

function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}

console.log("5! =", factorial(5));
console.log("10! =", factorial(10));

// Solution 3: Fibonacci
console.log("\n--- Fibonacci ---");

function fibonacci(n) {
    // Base cases
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i <= 10; i++) {
    console.log(`F(${i}) = ${fibonacci(i)}`);
}

// Solution 4: Sum of Array
console.log("\n--- Sum Array ---");

function sumArray(arr) {
    // Base case
    if (arr.length === 0) return 0;
    
    // Recursive case
    return arr[0] + sumArray(arr.slice(1));
}

console.log("Sum [1,2,3,4,5]:", sumArray([1, 2, 3, 4, 5]));

// Solution 5: Reverse String
console.log("\n--- Reverse String ---");

function reverseString(str) {
    // Base case
    if (str.length <= 1) return str;
    
    // Recursive case
    return reverseString(str.slice(1)) + str[0];
}

console.log("Reverse 'hello':", reverseString("hello"));

// Solution 6: Deep Object Traversal
console.log("\n--- Deep Object ---");

function findValue(obj, key) {
    // Check current level
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    
    // Recurse into nested objects
    for (const k in obj) {
        if (typeof obj[k] === "object" && obj[k] !== null) {
            const result = findValue(obj[k], key);
            if (result !== undefined) {
                return result;
            }
        }
    }
    
    return undefined;
}

const nested = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 3,
            target: "Found me!"
        }
    }
};

console.log("Find 'target':", findValue(nested, "target"));

// Solution 7: Flatten Array
console.log("\n--- Flatten Array ---");

function flatten(arr) {
    let result = [];
    
    for (const item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item));
        } else {
            result.push(item);
        }
    }
    
    return result;
}

const nestedArray = [1, [2, 3], [4, [5, 6]], 7];
console.log("Flattened:", flatten(nestedArray));

// Solution 8: Binary Search
console.log("\n--- Binary Search ---");

function binarySearch(arr, target, low = 0, high = arr.length - 1) {
    // Base case: not found
    if (low > high) return -1;
    
    const mid = Math.floor((low + high) / 2);
    
    // Base case: found
    if (arr[mid] === target) return mid;
    
    // Recursive cases
    if (arr[mid] > target) {
        return binarySearch(arr, target, low, mid - 1);
    } else {
        return binarySearch(arr, target, mid + 1, high);
    }
}

const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log("Find 7:", binarySearch(sorted, 7));
console.log("Find 6:", binarySearch(sorted, 6));

// Solution 9: Tail Recursion (Optimized)
console.log("\n--- Tail Recursion ---");

// Regular recursion (builds up call stack)
function factorialRegular(n) {
    if (n <= 1) return 1;
    return n * factorialRegular(n - 1);
}

// Tail recursion (can be optimized)
function factorialTail(n, accumulator = 1) {
    if (n <= 1) return accumulator;
    return factorialTail(n - 1, n * accumulator);
}

console.log("Regular:", factorialRegular(5));
console.log("Tail:", factorialTail(5));

// Solution 10: Recursion vs Iteration
console.log("\n--- Recursion vs Iteration ---");

// Recursive
function sumRecursive(n) {
    if (n <= 0) return 0;
    return n + sumRecursive(n - 1);
}

// Iterative
function sumIterative(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

console.log("Recursive sum(10):", sumRecursive(10));
console.log("Iterative sum(10):", sumIterative(10));

console.log("\n--- When to Use Recursion ---");
console.log("Good for: Trees, nested structures, divide & conquer");
console.log("Avoid for: Simple iterations, deep recursion (stack overflow)");

