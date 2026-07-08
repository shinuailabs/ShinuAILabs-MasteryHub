/**
 * Lab 033: do...while Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The do...while loop executes at least once, then repeats while condition is true.
 * 
 * Syntax:
 * do {
 *     // code to repeat
 * } while (condition);
 * 
 * - Condition checked AFTER each iteration
 * - Always executes at least once
 * - Useful for menu systems, validation loops
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand difference from while
 * 2. Use for menu/prompt systems
 * 3. Input validation patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic do...while
console.log("--- Basic do...while ---");
let count = 1;

do {
    console.log("Count:", count);
    count++;
} while (count <= 5);

// Solution 2: Executes At Least Once
console.log("\n--- Always Runs Once ---");

// do...while with false condition
let x = 10;
do {
    console.log("do...while runs even with x =", x);
} while (x < 5);

// Compare with while
x = 10;
while (x < 5) {
    console.log("while would NOT run");
}
console.log("while loop skipped");

// Solution 3: Menu System
console.log("\n--- Menu System ---");
const menuChoices = [1, 2, 3, 4]; // Simulated user choices
let choiceIndex = 0;
let choice;

do {
    choice = menuChoices[choiceIndex++];
    console.log(`
    Menu:
    1. View Profile
    2. Settings
    3. Help
    4. Exit
    
    User chose: ${choice}`);
    
    switch (choice) {
        case 1: console.log("Viewing profile..."); break;
        case 2: console.log("Opening settings..."); break;
        case 3: console.log("Showing help..."); break;
        case 4: console.log("Exiting..."); break;
        default: console.log("Invalid choice");
    }
} while (choice !== 4);

// Solution 4: Input Validation
console.log("\n--- Input Validation ---");
const passwords = ["123", "short", "validPassword123"];
let passIndex = 0;
let password;

do {
    password = passwords[passIndex++];
    console.log(`Trying password: "${password}"`);
    
    if (password.length < 8) {
        console.log("Password too short (min 8 chars)");
    }
} while (password.length < 8);

console.log("Password accepted!");

// Solution 5: Number Guessing Game
console.log("\n--- Number Guessing ---");
const targetNumber = 7;
const guesses = [3, 5, 8, 7];
let guessIdx = 0;
let userGuess;

do {
    userGuess = guesses[guessIdx++];
    console.log("Your guess:", userGuess);
    
    if (userGuess < targetNumber) {
        console.log("Too low!");
    } else if (userGuess > targetNumber) {
        console.log("Too high!");
    } else {
        console.log("Correct!");
    }
} while (userGuess !== targetNumber);

// Solution 6: Retry Pattern
console.log("\n--- Retry Pattern ---");
const apiResponses = [
    { success: false, error: "Timeout" },
    { success: false, error: "Server busy" },
    { success: true, data: "Result!" }
];

let attempt = 0;
let response;
const maxAttempts = 5;

do {
    attempt++;
    console.log(`Attempt ${attempt}...`);
    response = apiResponses[attempt - 1] || { success: false, error: "Failed" };
    
    if (!response.success) {
        console.log(`Failed: ${response.error}`);
    }
} while (!response.success && attempt < maxAttempts);

if (response.success) {
    console.log("Success:", response.data);
} else {
    console.log("All attempts failed");
}

// Solution 7: Process At Least One Item
console.log("\n--- Process Items ---");
const items = ["item1"];  // Even with one item, always processes

let itemIdx = 0;
do {
    const item = items[itemIdx];
    console.log("Processing:", item);
    itemIdx++;
} while (itemIdx < items.length);

// Solution 8: Factorial Calculation
console.log("\n--- Factorial ---");
const n = 5;
let factorial = 1;
let i = 1;

do {
    factorial *= i;
    console.log(`${i}! = ${factorial}`);
    i++;
} while (i <= n);

// Solution 9: Countdown with Condition
console.log("\n--- Countdown ---");
let countdown = 5;

do {
    console.log(countdown);
    countdown--;
} while (countdown > 0);

console.log("Liftoff!");

