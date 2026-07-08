/**
 * Lab 091: Event Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Events are actions that happen in the browser:
 * 
 * - User interactions (click, keypress, scroll)
 * - Browser actions (load, resize, error)
 * - Custom events
 * 
 * Event handling methods:
 * - addEventListener (recommended)
 * - on* properties (onclick, etc.)
 * - HTML attributes (inline - avoid)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add event listeners
 * 2. Handle different event types
 * 3. Remove event listeners
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: addEventListener
console.log("--- addEventListener ---");

/*
const button = document.getElementById("myButton");

// Basic usage
button.addEventListener("click", function() {
    console.log("Button clicked!");
});

// With arrow function
button.addEventListener("click", () => {
    console.log("Arrow function handler");
});

// Named function (can be removed later)
function handleClick() {
    console.log("Named function handler");
}
button.addEventListener("click", handleClick);
*/

// Solution 2: Event Object
console.log("\n--- Event Object ---");

/*
button.addEventListener("click", function(event) {
    console.log("Event type:", event.type);
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Timestamp:", event.timeStamp);
});
*/

// Solution 3: Multiple Listeners
console.log("\n--- Multiple Listeners ---");

/*
// Multiple listeners on same event
button.addEventListener("click", () => console.log("First handler"));
button.addEventListener("click", () => console.log("Second handler"));
// Both will execute in order
*/

// Solution 4: Removing Listeners
console.log("\n--- Removing Listeners ---");

/*
function handleClick() {
    console.log("Clicked!");
}

// Add listener
button.addEventListener("click", handleClick);

// Remove listener (must use same function reference)
button.removeEventListener("click", handleClick);

// Anonymous functions cannot be removed!
button.addEventListener("click", () => console.log("Can't remove this"));
*/

// Solution 5: Event Options
console.log("\n--- Event Options ---");

/*
// once: Remove after first trigger
button.addEventListener("click", () => {
    console.log("Only fires once");
}, { once: true });

// capture: Handle during capture phase
button.addEventListener("click", handler, { capture: true });
// or
button.addEventListener("click", handler, true);

// passive: Won't call preventDefault (performance)
element.addEventListener("scroll", handler, { passive: true });
*/

// Solution 6: on* Properties
console.log("\n--- on* Properties ---");

/*
// Only one handler per event type
button.onclick = function() {
    console.log("First handler");
};

button.onclick = function() {
    console.log("Second handler - replaces first!");
};

// Remove by setting to null
button.onclick = null;
*/

// Solution 7: Common Event Types
console.log("\n--- Common Events ---");

/*
// Mouse events
element.addEventListener("click", handler);
element.addEventListener("dblclick", handler);
element.addEventListener("mouseenter", handler);
element.addEventListener("mouseleave", handler);
element.addEventListener("mousemove", handler);

// Keyboard events
element.addEventListener("keydown", handler);
element.addEventListener("keyup", handler);
element.addEventListener("keypress", handler); // Deprecated

// Form events
input.addEventListener("input", handler);
input.addEventListener("change", handler);
input.addEventListener("focus", handler);
input.addEventListener("blur", handler);
form.addEventListener("submit", handler);

// Window events
window.addEventListener("load", handler);
window.addEventListener("resize", handler);
window.addEventListener("scroll", handler);
*/

// Solution 8: this in Event Handlers
console.log("\n--- this Keyword ---");

/*
// Regular function: this = element
button.addEventListener("click", function() {
    console.log(this); // button element
});

// Arrow function: this = outer scope
button.addEventListener("click", () => {
    console.log(this); // window or undefined
});

// Use event.currentTarget instead
button.addEventListener("click", (event) => {
    console.log(event.currentTarget); // button element
});
*/

// Simulated example for Node.js
console.log("\nSimulated Event System:");

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    
    addEventListener(type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }
    
    removeEventListener(type, callback) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type]
                .filter(cb => cb !== callback);
        }
    }
    
    dispatchEvent(type, data) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(callback => {
                callback({ type, data, target: this });
            });
        }
    }
}

const emitter = new EventEmitter();
emitter.addEventListener("click", (e) => console.log("Clicked!", e.data));
emitter.dispatchEvent("click", { x: 100, y: 200 });

