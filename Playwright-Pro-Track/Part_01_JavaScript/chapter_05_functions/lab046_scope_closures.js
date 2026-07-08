/**
 * Lab 046: Scope and Closures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Scope: Where variables are accessible
 * - Global scope: Accessible everywhere
 * - Function scope: Accessible within function
 * - Block scope: Accessible within {} (let, const)
 * 
 * Closure: Function that remembers its outer scope
 * - Inner function has access to outer function's variables
 * - Even after outer function has returned
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand different scopes
 * 2. Create and use closures
 * 3. Practical closure patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Global Scope
console.log("--- Global Scope ---");

const globalVar = "I am global";

function accessGlobal() {
    console.log("Inside function:", globalVar);
}

accessGlobal();
console.log("Outside function:", globalVar);

// Solution 2: Function Scope
console.log("\n--- Function Scope ---");

function functionScope() {
    const localVar = "I am local";
    console.log("Inside:", localVar);
}

functionScope();
// console.log(localVar); // Error: localVar is not defined

// Solution 3: Block Scope
console.log("\n--- Block Scope ---");

if (true) {
    let blockLet = "let is block scoped";
    const blockConst = "const is block scoped";
    var blockVar = "var is NOT block scoped";
    
    console.log("Inside block:", blockLet, blockConst);
}

// console.log(blockLet);   // Error
// console.log(blockConst); // Error
console.log("Outside block:", blockVar); // Works!

// Solution 4: Basic Closure
console.log("\n--- Basic Closure ---");

function outer() {
    const outerVar = "I am from outer";
    
    function inner() {
        console.log("Inner accessing:", outerVar);
    }
    
    return inner;
}

const closureFunc = outer();
closureFunc(); // Still has access to outerVar!

// Solution 5: Counter with Closure
console.log("\n--- Counter Closure ---");

function createCounter() {
    let count = 0; // Private variable
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
console.log("Increment:", counter.increment());
console.log("Increment:", counter.increment());
console.log("Decrement:", counter.decrement());
console.log("Get count:", counter.getCount());
// console.log(count); // Error: count is private

// Solution 6: Factory Function with Closure
console.log("\n--- Factory Function ---");

function createMultiplier(factor) {
    // factor is "closed over"
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("Double 5:", double(5));
console.log("Triple 5:", triple(5));

// Solution 7: Private Variables
console.log("\n--- Private Variables ---");

function createBankAccount(initialBalance) {
    let balance = initialBalance; // Private
    
    return {
        deposit(amount) {
            if (amount > 0) {
                balance += amount;
                return `Deposited $${amount}. Balance: $${balance}`;
            }
            return "Invalid amount";
        },
        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return `Withdrew $${amount}. Balance: $${balance}`;
            }
            return "Invalid amount or insufficient funds";
        },
        getBalance() {
            return `Balance: $${balance}`;
        }
    };
}

const account = createBankAccount(100);
console.log(account.deposit(50));
console.log(account.withdraw(30));
console.log(account.getBalance());
// account.balance = 1000000; // Doesn't affect internal balance

// Solution 8: Closure in Loops (Common Pitfall)
console.log("\n--- Closure in Loops ---");

// Problem with var
console.log("With var (problem):");
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log("var i:", i); // All print 3!
    }, 100);
}

// Solution with let
console.log("With let (fixed):");
for (let j = 0; j < 3; j++) {
    setTimeout(function() {
        console.log("let j:", j); // Prints 0, 1, 2
    }, 200);
}

// Solution 9: Memoization with Closure
console.log("\n--- Memoization ---");

function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            console.log("From cache:", key);
            return cache[key];
        }
        console.log("Computing:", key);
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

const expensiveCalc = memoize((n) => {
    return n * n;
});

console.log(expensiveCalc(5));
console.log(expensiveCalc(5)); // From cache
console.log(expensiveCalc(10));

