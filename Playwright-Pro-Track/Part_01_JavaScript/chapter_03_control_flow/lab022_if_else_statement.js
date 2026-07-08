/**
 * Lab 022: if...else Statement
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The if...else statement provides an alternative path when condition is false.
 * 
 * Syntax:
 * if (condition) {
 *     // code if true
 * } else {
 *     // code if false
 * }
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write if...else statements
 * 2. Handle binary conditions
 * 3. Use with functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic if...else
console.log("--- Basic if...else ---");
const age = 16;

if (age >= 18) {
    console.log("You are an adult");
} else {
    console.log("You are a minor");
}

// Solution 2: Boolean Toggle
console.log("\n--- Boolean Toggle ---");
let isLoggedIn = true;

if (isLoggedIn) {
    console.log("Welcome back!");
} else {
    console.log("Please log in");
}

isLoggedIn = false;

if (isLoggedIn) {
    console.log("Welcome back!");
} else {
    console.log("Please log in");
}

// Solution 3: Even/Odd Check
console.log("\n--- Even/Odd Check ---");
function checkEvenOdd(number) {
    if (number % 2 === 0) {
        return "even";
    } else {
        return "odd";
    }
}

console.log(`10 is ${checkEvenOdd(10)}`);
console.log(`7 is ${checkEvenOdd(7)}`);

// Solution 4: Comparison Results
console.log("\n--- Comparison Results ---");
const a = 10;
const b = 20;

if (a > b) {
    console.log(`${a} is greater than ${b}`);
} else {
    console.log(`${a} is not greater than ${b}`);
}

// Solution 5: String Validation
console.log("\n--- String Validation ---");
function validateEmail(email) {
    if (email && email.includes("@") && email.includes(".")) {
        return "Valid email format";
    } else {
        return "Invalid email format";
    }
}

console.log(validateEmail("test@example.com"));
console.log(validateEmail("invalid-email"));
console.log(validateEmail(""));

// Solution 6: Array Operations
console.log("\n--- Array Operations ---");
const cart = ["item1", "item2"];

if (cart.length > 0) {
    console.log(`You have ${cart.length} items in your cart`);
} else {
    console.log("Your cart is empty");
}

const emptyCart = [];
if (emptyCart.length > 0) {
    console.log(`You have ${emptyCart.length} items`);
} else {
    console.log("Your cart is empty");
}

// Solution 7: Function Return Values
console.log("\n--- Function Returns ---");
function getDiscount(isPremium) {
    if (isPremium) {
        return 0.20; // 20% discount
    } else {
        return 0.05; // 5% discount
    }
}

const premiumDiscount = getDiscount(true);
const regularDiscount = getDiscount(false);

console.log(`Premium discount: ${premiumDiscount * 100}%`);
console.log(`Regular discount: ${regularDiscount * 100}%`);

// Solution 8: Object Property Check
console.log("\n--- Object Property Check ---");
const user = {
    name: "John",
    role: "user"
};

if (user.role === "admin") {
    console.log("Access to admin panel granted");
} else {
    console.log("Access to admin panel denied");
}

// Solution 9: Null/Undefined Handling
console.log("\n--- Null/Undefined Handling ---");
function processData(data) {
    if (data !== null && data !== undefined) {
        return `Processing: ${data}`;
    } else {
        return "No data to process";
    }
}

console.log(processData("Hello"));
console.log(processData(null));
console.log(processData(undefined));

// Solution 10: Practical - User Authentication
console.log("\n--- User Authentication ---");
function authenticate(username, password) {
    const validUsername = "admin";
    const validPassword = "secret123";
    
    if (username === validUsername && password === validPassword) {
        return { success: true, message: "Login successful" };
    } else {
        return { success: false, message: "Invalid credentials" };
    }
}

console.log(authenticate("admin", "secret123"));
console.log(authenticate("admin", "wrong"));

