/**
 * Lab 050: Function Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for writing clean, maintainable functions:
 *
 * 1. Single Responsibility
 * 2. Descriptive Names
 * 3. Small Functions
 * 4. Pure Functions (when possible)
 * 5. Avoid Side Effects
 * 6. Use Default Parameters
 * 7. Document Complex Functions
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Refactor bad examples
 * 3. Write clean functions
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Single Responsibility
console.log("--- Single Responsibility ---");

// BAD: Does too many things
function handleUserBad(userData) {
    // Validates
    // Saves to database
    // Sends email
    // Logs activity
}

// GOOD: One thing per function
function validateUser(userData) {
    return userData.email && userData.name;
}

function saveUser(userData) {
    console.log("Saving user:", userData.name);
    return { id: 1, ...userData };
}

function sendWelcomeEmail(user) {
    console.log("Sending email to:", user.email);
}

// Compose them
function handleUserGood(userData) {
    if (!validateUser(userData)) return null;
    const user = saveUser(userData);
    sendWelcomeEmail(user);
    return user;
}

handleUserGood({ name: "Alice", email: "alice@test.com" });

// Best Practice 2: Descriptive Names
console.log("\n--- Descriptive Names ---");

// BAD
function proc(d) { return d * 2; }
function fn(x, y) { return x > y; }

// GOOD
function doubleValue(value) { return value * 2; }
function isGreaterThan(a, b) { return a > b; }

console.log("doubleValue(5):", doubleValue(5));
console.log("isGreaterThan(5, 3):", isGreaterThan(5, 3));

// Best Practice 3: Keep Functions Small
console.log("\n--- Small Functions ---");

// BAD: Long function doing many things
// function processOrder(order) { ... 100 lines ... }

// GOOD: Break into smaller functions
function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function calculateTax(subtotal, rate = 0.08) {
    return subtotal * rate;
}

function calculateTotal(subtotal, tax, shipping) {
    return subtotal + tax + shipping;
}

const items = [{ price: 10, qty: 2 }, { price: 20, qty: 1 }];
const subtotal = calculateSubtotal(items);
const tax = calculateTax(subtotal);
const total = calculateTotal(subtotal, tax, 5);
console.log("Order total:", total);

// Best Practice 4: Pure Functions
console.log("\n--- Pure Functions ---");

// IMPURE: Depends on external state
let multiplier = 2;
function impureMultiply(x) {
    return x * multiplier; // Uses external variable
}

// PURE: Same input = same output
function pureMultiply(x, factor) {
    return x * factor;
}

console.log("Pure multiply:", pureMultiply(5, 2));

// Best Practice 5: Avoid Side Effects
console.log("\n--- Avoid Side Effects ---");

// BAD: Modifies input
function addItemBad(cart, item) {
    cart.push(item); // Mutates original
    return cart;
}

// GOOD: Returns new array
function addItemGood(cart, item) {
    return [...cart, item]; // New array
}

const cart = ["item1"];
const newCart = addItemGood(cart, "item2");
console.log("Original cart:", cart);
console.log("New cart:", newCart);

// Best Practice 6: Use Default Parameters
console.log("\n--- Default Parameters ---");

// BAD: Manual defaults
function greetBad(name) {
    name = name || "Guest";
    return `Hello, ${name}!`;
}

// GOOD: Default parameters
function greetGood(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greetGood());
console.log(greetGood("Alice"));

// Best Practice 7: Early Returns
console.log("\n--- Early Returns ---");

// BAD: Nested conditions
function getDiscountBad(user) {
    let discount = 0;
    if (user) {
        if (user.isPremium) {
            discount = 0.2;
        } else {
            discount = 0.1;
        }
    }
    return discount;
}

// GOOD: Early returns
function getDiscountGood(user) {
    if (!user) return 0;
    if (user.isPremium) return 0.2;
    return 0.1;
}

console.log("Discount:", getDiscountGood({ isPremium: true }));

// Best Practice 8: Limit Parameters
console.log("\n--- Limit Parameters ---");

// BAD: Too many parameters
function createUserBad(name, email, age, city, country, phone) {}

// GOOD: Use object parameter
function createUserGood({ name, email, age, city, country, phone }) {
    return { name, email, age, city, country, phone };
}

const user = createUserGood({
    name: "Alice",
    email: "alice@test.com",
    age: 25,
    city: "NYC",
    country: "USA",
    phone: "123-456-7890"
});
console.log("User:", user);

// Summary
console.log("\n--- Summary ---");
console.log("1. One function = one task");
console.log("2. Use descriptive verb names");
console.log("3. Keep functions under 20 lines");
console.log("4. Prefer pure functions");
console.log("5. Don't mutate inputs");
console.log("6. Use default parameters");
console.log("7. Return early to reduce nesting");
console.log("8. Use object params for 3+ arguments");