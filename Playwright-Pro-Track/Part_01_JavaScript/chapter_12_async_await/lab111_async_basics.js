/**
 * Lab 111: Async/Await Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * async/await provides cleaner syntax for promises:
 * 
 * - async: Declares an async function (returns Promise)
 * - await: Pauses execution until Promise resolves
 * - Makes async code look synchronous
 * - Built on top of Promises
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create async functions
 * 2. Use await with promises
 * 3. Handle return values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Async Function
console.log("--- Basic Async Function ---");

async function greet() {
    return "Hello, World!";
}

// Async functions always return a Promise
greet().then(message => console.log(message));

// Solution 2: Using Await
console.log("\n--- Using Await ---");

function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

async function fetchData() {
    console.log("Fetching...");
    const data = await delay(100, { id: 1, name: "John" });
    console.log("Data received:", data);
    return data;
}

fetchData();

// Solution 3: Sequential Await
console.log("\n--- Sequential Await ---");

async function sequential() {
    const start = Date.now();
    
    const first = await delay(50, "First");
    console.log(first);
    
    const second = await delay(50, "Second");
    console.log(second);
    
    const third = await delay(50, "Third");
    console.log(third);
    
    console.log(`Sequential took: ${Date.now() - start}ms`);
}

sequential();

// Solution 4: Async Function Expressions
console.log("\n--- Function Expressions ---");

// Arrow function
const fetchUser = async (id) => {
    const user = await delay(50, { id, name: `User ${id}` });
    return user;
};

// Function expression
const fetchPosts = async function(userId) {
    const posts = await delay(50, [{ id: 1, title: "Post 1" }]);
    return posts;
};

fetchUser(1).then(user => console.log("User:", user));

// Solution 5: Async Methods
console.log("\n--- Async Methods ---");

class UserService {
    async getUser(id) {
        const user = await delay(50, { id, name: "John" });
        return user;
    }
    
    async getUserPosts(userId) {
        const user = await this.getUser(userId);
        const posts = await delay(50, [{ title: "Post 1" }]);
        return { user, posts };
    }
}

const service = new UserService();
service.getUserPosts(1).then(data => console.log("Service data:", data));

// Solution 6: Await with Non-Promises
console.log("\n--- Await Non-Promises ---");

async function awaitNonPromise() {
    // Await works with non-promises too
    const value = await 42;
    console.log("Non-promise value:", value);
    
    const obj = await { name: "John" };
    console.log("Non-promise object:", obj);
}

awaitNonPromise();

// Solution 7: Chaining Async Calls
console.log("\n--- Chaining Async Calls ---");

async function getFullUserData(userId) {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    
    return {
        ...user,
        posts
    };
}

getFullUserData(1).then(data => console.log("Full data:", data));

// Solution 8: Async IIFE
console.log("\n--- Async IIFE ---");

// Immediately Invoked Async Function Expression
(async () => {
    const result = await delay(50, "IIFE result");
    console.log("IIFE:", result);
})();

// Solution 9: Top-Level Await (ES2022)
console.log("\n--- Top-Level Await ---");

// In ES modules, you can use await at top level
// const data = await fetchData();

// For CommonJS, wrap in async IIFE
// (async () => {
//     const data = await fetchData();
// })();

// Solution 10: Return vs Return Await
console.log("\n--- Return vs Return Await ---");

// These are equivalent for success cases
async function returnPromise() {
    return delay(50, "value");
}

async function returnAwait() {
    return await delay(50, "value");
}

// But different for error handling in try/catch
async function withTryCatch() {
    try {
        // return await is needed to catch errors here
        return await delay(50, "value");
    } catch (error) {
        console.log("Caught:", error);
        return "default";
    }
}

returnPromise().then(v => console.log("Return promise:", v));
returnAwait().then(v => console.log("Return await:", v));

