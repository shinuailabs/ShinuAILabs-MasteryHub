/**
 * Lab 092: Event Propagation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Events propagate through the DOM in three phases:
 * 
 * 1. Capture phase: Window → Target
 * 2. Target phase: At the target element
 * 3. Bubble phase: Target → Window
 * 
 * Control propagation:
 * - stopPropagation(): Stop further propagation
 * - stopImmediatePropagation(): Stop all handlers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand event phases
 * 2. Stop propagation
 * 3. Use capture vs bubble
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Event Bubbling
console.log("--- Event Bubbling ---");

/*
<div id="outer">
    <div id="inner">
        <button id="button">Click</button>
    </div>
</div>

// Events bubble up by default
document.getElementById("button").addEventListener("click", () => {
    console.log("Button clicked");
});

document.getElementById("inner").addEventListener("click", () => {
    console.log("Inner div clicked");
});

document.getElementById("outer").addEventListener("click", () => {
    console.log("Outer div clicked");
});

// Clicking button logs:
// "Button clicked"
// "Inner div clicked"
// "Outer div clicked"
*/

// Solution 2: Event Capturing
console.log("\n--- Event Capturing ---");

/*
// Use capture phase (third argument = true)
document.getElementById("outer").addEventListener("click", () => {
    console.log("Outer (capture)");
}, true);

document.getElementById("inner").addEventListener("click", () => {
    console.log("Inner (capture)");
}, true);

document.getElementById("button").addEventListener("click", () => {
    console.log("Button");
});

// Clicking button logs:
// "Outer (capture)"
// "Inner (capture)"
// "Button"
*/

// Solution 3: stopPropagation
console.log("\n--- stopPropagation ---");

/*
document.getElementById("button").addEventListener("click", (event) => {
    console.log("Button clicked");
    event.stopPropagation(); // Stop bubbling
});

document.getElementById("inner").addEventListener("click", () => {
    console.log("This won't run when button is clicked");
});
*/

// Solution 4: stopImmediatePropagation
console.log("\n--- stopImmediatePropagation ---");

/*
// Multiple handlers on same element
button.addEventListener("click", (event) => {
    console.log("First handler");
    event.stopImmediatePropagation();
});

button.addEventListener("click", () => {
    console.log("Second handler - won't run!");
});
*/

// Solution 5: Event Target vs CurrentTarget
console.log("\n--- target vs currentTarget ---");

/*
document.getElementById("outer").addEventListener("click", (event) => {
    console.log("target:", event.target);         // Element that was clicked
    console.log("currentTarget:", event.currentTarget); // Element with listener
});

// If button inside outer is clicked:
// target = button
// currentTarget = outer
*/

// Solution 6: Practical Example - Modal
console.log("\n--- Modal Example ---");

/*
<div id="modal-overlay">
    <div id="modal-content">
        <p>Modal content</p>
    </div>
</div>

// Close modal when clicking overlay, not content
document.getElementById("modal-overlay").addEventListener("click", (event) => {
    // Only close if clicking the overlay itself
    if (event.target === event.currentTarget) {
        closeModal();
    }
});

// Or stop propagation on content
document.getElementById("modal-content").addEventListener("click", (event) => {
    event.stopPropagation();
});
*/

// Solution 7: Event Phases Visualization
console.log("\n--- Phase Visualization ---");

/*
function logPhase(name) {
    return function(event) {
        console.log(`${name} - Phase: ${event.eventPhase}`);
        // 1 = Capturing, 2 = At Target, 3 = Bubbling
    };
}

outer.addEventListener("click", logPhase("Outer"), true);  // Capture
inner.addEventListener("click", logPhase("Inner"), true);  // Capture
button.addEventListener("click", logPhase("Button"));      // Target
inner.addEventListener("click", logPhase("Inner"));        // Bubble
outer.addEventListener("click", logPhase("Outer"));        // Bubble
*/

// Simulated example for Node.js
console.log("\nSimulated Event Propagation:");

class DOMNode {
    constructor(name, parent = null) {
        this.name = name;
        this.parent = parent;
        this.listeners = { capture: [], bubble: [] };
    }
    
    addEventListener(type, callback, capture = false) {
        const phase = capture ? "capture" : "bubble";
        this.listeners[phase].push({ type, callback });
    }
    
    dispatchEvent(type) {
        // Build path from root to target
        const path = [];
        let node = this;
        while (node) {
            path.unshift(node);
            node = node.parent;
        }
        
        // Capture phase
        console.log("--- Capture Phase ---");
        for (const node of path) {
            node.listeners.capture
                .filter(l => l.type === type)
                .forEach(l => l.callback({ target: this, currentTarget: node }));
        }
        
        // Bubble phase
        console.log("--- Bubble Phase ---");
        for (const node of path.reverse()) {
            node.listeners.bubble
                .filter(l => l.type === type)
                .forEach(l => l.callback({ target: this, currentTarget: node }));
        }
    }
}

const outer = new DOMNode("outer");
const inner = new DOMNode("inner", outer);
const button = new DOMNode("button", inner);

outer.addEventListener("click", (e) => console.log(`Outer capture`), true);
inner.addEventListener("click", (e) => console.log(`Inner capture`), true);
button.addEventListener("click", (e) => console.log(`Button bubble`));
inner.addEventListener("click", (e) => console.log(`Inner bubble`));
outer.addEventListener("click", (e) => console.log(`Outer bubble`));

button.dispatchEvent("click");

