/**
 * Lab 094: Mouse Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Mouse events for user interactions:
 * 
 * Click events:
 * - click, dblclick, contextmenu
 * 
 * Movement events:
 * - mousemove, mouseenter, mouseleave
 * - mouseover, mouseout
 * 
 * Button events:
 * - mousedown, mouseup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle click events
 * 2. Track mouse movement
 * 3. Implement drag behavior
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Click Events
console.log("--- Click Events ---");

/*
const element = document.getElementById("clickable");

element.addEventListener("click", (event) => {
    console.log("Single click");
    console.log("Button:", event.button); // 0=left, 1=middle, 2=right
});

element.addEventListener("dblclick", (event) => {
    console.log("Double click");
});

element.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Prevent default context menu
    console.log("Right click - show custom menu");
});
*/

// Solution 2: Mouse Position
console.log("\n--- Mouse Position ---");

/*
document.addEventListener("mousemove", (event) => {
    // Relative to viewport
    console.log("clientX:", event.clientX);
    console.log("clientY:", event.clientY);
    
    // Relative to document
    console.log("pageX:", event.pageX);
    console.log("pageY:", event.pageY);
    
    // Relative to screen
    console.log("screenX:", event.screenX);
    console.log("screenY:", event.screenY);
    
    // Relative to target element
    console.log("offsetX:", event.offsetX);
    console.log("offsetY:", event.offsetY);
});
*/

// Solution 3: Enter/Leave vs Over/Out
console.log("\n--- Enter/Leave vs Over/Out ---");

/*
// mouseenter/mouseleave - don't bubble, ignore children
element.addEventListener("mouseenter", () => {
    console.log("Mouse entered element");
});

element.addEventListener("mouseleave", () => {
    console.log("Mouse left element");
});

// mouseover/mouseout - bubble, fire for children too
element.addEventListener("mouseover", (event) => {
    console.log("Mouse over:", event.target);
});

element.addEventListener("mouseout", (event) => {
    console.log("Mouse out:", event.target);
    console.log("Related target:", event.relatedTarget);
});
*/

// Solution 4: Mouse Buttons
console.log("\n--- Mouse Buttons ---");

/*
element.addEventListener("mousedown", (event) => {
    console.log("Mouse button pressed");
    console.log("Button:", event.button);
    // 0 = left, 1 = middle, 2 = right
    
    console.log("Buttons:", event.buttons);
    // Bitmask of all pressed buttons
});

element.addEventListener("mouseup", (event) => {
    console.log("Mouse button released");
});
*/

// Solution 5: Modifier Keys
console.log("\n--- Modifier Keys ---");

/*
element.addEventListener("click", (event) => {
    if (event.ctrlKey) console.log("Ctrl+Click");
    if (event.shiftKey) console.log("Shift+Click");
    if (event.altKey) console.log("Alt+Click");
    if (event.metaKey) console.log("Cmd/Win+Click");
    
    // Combination
    if (event.ctrlKey && event.shiftKey) {
        console.log("Ctrl+Shift+Click");
    }
});
*/

// Solution 6: Simple Drag Implementation
console.log("\n--- Drag Implementation ---");

/*
let isDragging = false;
let offsetX, offsetY;

const draggable = document.getElementById("draggable");

draggable.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - draggable.offsetLeft;
    offsetY = event.clientY - draggable.offsetTop;
    draggable.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    
    draggable.style.left = (event.clientX - offsetX) + "px";
    draggable.style.top = (event.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    draggable.style.cursor = "grab";
});
*/

// Solution 7: Hover Effect
console.log("\n--- Hover Effect ---");

/*
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");
    });
    
    card.addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
    });
});
*/

// Solution 8: Mouse Tracking
console.log("\n--- Mouse Tracking ---");

/*
const tracker = document.getElementById("tracker");

document.addEventListener("mousemove", (event) => {
    tracker.style.left = event.clientX + "px";
    tracker.style.top = event.clientY + "px";
});
*/

// Simulated example for Node.js
console.log("\nSimulated Mouse Events:");

class MouseEventSimulator {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.buttons = 0;
    }
    
    move(x, y) {
        this.position = { x, y };
        console.log(`Mouse moved to (${x}, ${y})`);
    }
    
    click(button = 0) {
        console.log(`Click at (${this.position.x}, ${this.position.y}), button: ${button}`);
    }
    
    drag(startX, startY, endX, endY) {
        console.log(`Drag from (${startX}, ${startY}) to (${endX}, ${endY})`);
    }
}

const mouse = new MouseEventSimulator();
mouse.move(100, 200);
mouse.click(0);
mouse.drag(100, 200, 300, 400);

