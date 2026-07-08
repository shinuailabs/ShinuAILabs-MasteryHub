/**
 * Lab 032: while Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The while loop repeats code while a condition is true.
 * 
 * Syntax:
 * while (condition) {
 *     // code to repeat
 * }
 * 
 * - Condition checked BEFORE each iteration
 * - May never execute if condition is initially false
 * - Useful when number of iterations is unknown
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic while loops
 * 2. Use while for unknown iterations
 * 3. Avoid infinite loops
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic while Loop
console.log("--- Basic while ---");
let count = 1;

while (count <= 5) {
    console.log("Count:", count);
    count++;
}

// Solution 2: while with Condition
console.log("\n--- Until Threshold ---");
let value = 1;

while (value < 100) {
    console.log("Value:", value);
    value *= 2;
}
console.log("Final value:", value);

// Solution 3: Processing Unknown Length
console.log("\n--- Process Until Done ---");
const queue = ["task1", "task2", "task3"];

while (queue.length > 0) {
    const task = queue.shift(); // Remove first element
    console.log("Processing:", task);
}
console.log("Queue empty!");

// Solution 4: User Input Simulation
console.log("\n--- Simulated Input ---");
const inputs = ["", "  ", "valid input"];
let inputIndex = 0;
let userInput = "";

while (!userInput.trim()) {
    userInput = inputs[inputIndex];
    console.log(`Attempt ${inputIndex + 1}: "${userInput}"`);
    inputIndex++;
}
console.log("Valid input received:", userInput);

// Solution 5: Random Number Game
console.log("\n--- Guess Number ---");
const secretNumber = 7;
const guesses = [3, 5, 7];
let guessIndex = 0;
let guess;

while (guess !== secretNumber) {
    guess = guesses[guessIndex];
    console.log("Guessing:", guess);
    guessIndex++;
}
console.log("Correct!");

// Solution 6: Sum Until Limit
console.log("\n--- Sum Until Limit ---");
let sum = 0;
let num = 1;

while (sum + num <= 20) {
    sum += num;
    console.log(`Added ${num}, sum = ${sum}`);
    num++;
}
console.log("Final sum:", sum);

// Solution 7: Finding Element
console.log("\n--- Find Element ---");
const data = [10, 20, 30, 40, 50];
let i = 0;
const searchFor = 30;

while (i < data.length && data[i] !== searchFor) {
    i++;
}

if (i < data.length) {
    console.log(`Found ${searchFor} at index ${i}`);
} else {
    console.log("Not found");
}

// Solution 8: Digit Sum
console.log("\n--- Digit Sum ---");
let number = 12345;
let digitSum = 0;

while (number > 0) {
    const digit = number % 10;
    digitSum += digit;
    console.log(`Digit: ${digit}, Running sum: ${digitSum}`);
    number = Math.floor(number / 10);
}
console.log("Total digit sum:", digitSum);

// Solution 9: Read Stream Simulation
console.log("\n--- Stream Processing ---");
const stream = ["data1", "data2", "data3", null]; // null = end
let streamIndex = 0;
let chunk;

while ((chunk = stream[streamIndex++]) !== null) {
    console.log("Received:", chunk);
}
console.log("Stream ended");

// Solution 10: Avoid Infinite Loops
console.log("\n--- Infinite Loop Protection ---");
let counter = 0;
const maxIterations = 1000;

while (true) {
    counter++;
    if (counter >= 5) {
        console.log("Breaking at:", counter);
        break;
    }
    
    // Safety check
    if (counter > maxIterations) {
        console.log("Safety break - too many iterations!");
        break;
    }
}

// Solution 11: Condition Never True
console.log("\n--- Never Executes ---");
let x = 10;

while (x < 5) {
    console.log("This won't print");
    x++;
}
console.log("Loop skipped, x =", x);

