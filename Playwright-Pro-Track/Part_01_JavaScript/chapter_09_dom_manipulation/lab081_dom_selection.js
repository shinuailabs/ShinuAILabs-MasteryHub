/**
 * Lab 081: DOM Selection
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The DOM (Document Object Model) represents HTML as a tree of objects.
 * 
 * Selection methods:
 * - getElementById: Single element by ID
 * - getElementsByClassName: Collection by class
 * - getElementsByTagName: Collection by tag
 * - querySelector: First match (CSS selector)
 * - querySelectorAll: All matches (CSS selector)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Select elements using different methods
 * 2. Understand live vs static collections
 * 3. Use CSS selectors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment
// For Node.js, you would need jsdom or similar

// Solution 1: getElementById
console.log("--- getElementById ---");

/*
<div id="myDiv">Hello</div>

const element = document.getElementById("myDiv");
console.log("Element:", element);
console.log("Text:", element.textContent);
*/

// Solution 2: getElementsByClassName
console.log("\n--- getElementsByClassName ---");

/*
<div class="item">Item 1</div>
<div class="item">Item 2</div>
<div class="item">Item 3</div>

const items = document.getElementsByClassName("item");
console.log("Count:", items.length);
console.log("First:", items[0].textContent);

// Returns HTMLCollection (live)
// Updates automatically when DOM changes
*/

// Solution 3: getElementsByTagName
console.log("\n--- getElementsByTagName ---");

/*
const paragraphs = document.getElementsByTagName("p");
console.log("Paragraphs:", paragraphs.length);

// Get all elements
const allElements = document.getElementsByTagName("*");
console.log("All elements:", allElements.length);
*/

// Solution 4: querySelector
console.log("\n--- querySelector ---");

/*
// Returns first matching element
const first = document.querySelector(".item");
const byId = document.querySelector("#myDiv");
const complex = document.querySelector("div.container > p.intro");

// CSS selectors
document.querySelector("input[type='text']");
document.querySelector("li:first-child");
document.querySelector("p:nth-child(2)");
*/

// Solution 5: querySelectorAll
console.log("\n--- querySelectorAll ---");

/*
// Returns NodeList (static)
const allItems = document.querySelectorAll(".item");
console.log("Items:", allItems.length);

// Iterate with forEach
allItems.forEach((item, index) => {
    console.log(`Item ${index}:`, item.textContent);
});

// Convert to array
const itemsArray = Array.from(allItems);
// or [...allItems]
*/

// Solution 6: Live vs Static Collections
console.log("\n--- Live vs Static ---");

/*
// HTMLCollection (live) - updates automatically
const liveCollection = document.getElementsByClassName("item");

// NodeList (static) - snapshot at time of query
const staticList = document.querySelectorAll(".item");

// Add new element
const newDiv = document.createElement("div");
newDiv.className = "item";
document.body.appendChild(newDiv);

console.log("Live count:", liveCollection.length); // Updated!
console.log("Static count:", staticList.length);   // Same as before
*/

// Solution 7: Scoped Selection
console.log("\n--- Scoped Selection ---");

/*
<div id="container">
    <p class="text">Inside</p>
</div>
<p class="text">Outside</p>

const container = document.getElementById("container");

// Select only within container
const insideText = container.querySelector(".text");
const allInside = container.querySelectorAll(".text");
*/

// Solution 8: Checking if Element Exists
console.log("\n--- Element Existence ---");

/*
const element = document.querySelector("#mayNotExist");

if (element) {
    console.log("Element found");
} else {
    console.log("Element not found");
}

// Optional chaining
const text = document.querySelector("#myDiv")?.textContent ?? "Not found";
*/

// Solution 9: Closest and Matches
console.log("\n--- closest and matches ---");

/*
<div class="parent">
    <div class="child">
        <button class="btn">Click</button>
    </div>
</div>

const btn = document.querySelector(".btn");

// Find closest ancestor matching selector
const parent = btn.closest(".parent");
console.log("Parent:", parent);

// Check if element matches selector
console.log("Is button:", btn.matches(".btn"));
console.log("Is div:", btn.matches("div"));
*/

// Solution 10: Selection Best Practices
console.log("\n--- Best Practices ---");

/*
// 1. Prefer querySelector/querySelectorAll for flexibility
// 2. Use getElementById for single elements (fastest)
// 3. Cache selections if used multiple times

// BAD: Query in loop
for (let i = 0; i < 100; i++) {
    document.querySelector(".item").style.color = "red";
}

// GOOD: Cache the selection
const item = document.querySelector(".item");
for (let i = 0; i < 100; i++) {
    item.style.color = "red";
}

// 4. Use specific selectors
// BAD: document.querySelector("div")
// GOOD: document.querySelector(".specific-class")
*/

// Simulated example for Node.js
console.log("\nSimulated DOM Selection:");
const mockDOM = {
    getElementById: (id) => ({ id, textContent: `Content of #${id}` }),
    querySelector: (sel) => ({ selector: sel, textContent: `First match for ${sel}` }),
    querySelectorAll: (sel) => [
        { selector: sel, textContent: "Match 1" },
        { selector: sel, textContent: "Match 2" }
    ]
};

console.log("getElementById:", mockDOM.getElementById("test"));
console.log("querySelector:", mockDOM.querySelector(".item"));
console.log("querySelectorAll:", mockDOM.querySelectorAll(".item"));

