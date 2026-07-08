/**
 * Lab 095: Keyboard Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Keyboard events for user input:
 * 
 * Events:
 * - keydown: Key pressed (repeats if held)
 * - keyup: Key released
 * - keypress: Character key (deprecated)
 * 
 * Key properties:
 * - key: Character or key name
 * - code: Physical key code
 * - keyCode: Numeric code (deprecated)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle keyboard input
 * 2. Detect key combinations
 * 3. Implement keyboard shortcuts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Basic Keyboard Events
console.log("--- Basic Keyboard Events ---");

/*
document.addEventListener("keydown", (event) => {
    console.log("Key down:", event.key);
});

document.addEventListener("keyup", (event) => {
    console.log("Key up:", event.key);
});
*/

// Solution 2: Key Properties
console.log("\n--- Key Properties ---");

/*
document.addEventListener("keydown", (event) => {
    console.log("key:", event.key);       // "a", "Enter", "ArrowUp"
    console.log("code:", event.code);     // "KeyA", "Enter", "ArrowUp"
    console.log("keyCode:", event.keyCode); // 65, 13, 38 (deprecated)
    
    // key vs code:
    // key = character produced (affected by Shift, layout)
    // code = physical key (same regardless of layout)
});
*/

// Solution 3: Special Keys
console.log("\n--- Special Keys ---");

/*
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter":
            console.log("Enter pressed");
            break;
        case "Escape":
            console.log("Escape pressed");
            break;
        case "Tab":
            console.log("Tab pressed");
            break;
        case "Backspace":
            console.log("Backspace pressed");
            break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            console.log("Arrow key:", event.key);
            break;
    }
});
*/

// Solution 4: Modifier Keys
console.log("\n--- Modifier Keys ---");

/*
document.addEventListener("keydown", (event) => {
    // Check modifier state
    console.log("Ctrl:", event.ctrlKey);
    console.log("Shift:", event.shiftKey);
    console.log("Alt:", event.altKey);
    console.log("Meta:", event.metaKey); // Cmd on Mac, Win on Windows
    
    // Detect modifier key press
    if (event.key === "Control") console.log("Ctrl key pressed");
    if (event.key === "Shift") console.log("Shift key pressed");
    if (event.key === "Alt") console.log("Alt key pressed");
    if (event.key === "Meta") console.log("Meta key pressed");
});
*/

// Solution 5: Keyboard Shortcuts
console.log("\n--- Keyboard Shortcuts ---");

/*
document.addEventListener("keydown", (event) => {
    // Ctrl+S (or Cmd+S on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        console.log("Save shortcut");
        saveDocument();
    }
    
    // Ctrl+Z
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        console.log("Undo shortcut");
        undo();
    }
    
    // Ctrl+Shift+P
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "P") {
        event.preventDefault();
        console.log("Command palette");
    }
});
*/

// Solution 6: Input Field Handling
console.log("\n--- Input Field ---");

/*
const input = document.getElementById("searchInput");

input.addEventListener("keydown", (event) => {
    // Submit on Enter
    if (event.key === "Enter") {
        event.preventDefault();
        performSearch(input.value);
    }
    
    // Clear on Escape
    if (event.key === "Escape") {
        input.value = "";
        input.blur();
    }
});

// Real-time input
input.addEventListener("input", (event) => {
    console.log("Current value:", event.target.value);
});
*/

// Solution 7: Prevent Default Behavior
console.log("\n--- Prevent Default ---");

/*
// Prevent certain keys
input.addEventListener("keydown", (event) => {
    // Prevent numbers
    if (/\d/.test(event.key)) {
        event.preventDefault();
    }
    
    // Prevent spaces
    if (event.key === " ") {
        event.preventDefault();
    }
});
*/

// Solution 8: Key Repeat Detection
console.log("\n--- Key Repeat ---");

/*
document.addEventListener("keydown", (event) => {
    if (event.repeat) {
        console.log("Key is being held:", event.key);
    } else {
        console.log("Initial key press:", event.key);
    }
});
*/

// Solution 9: Shortcut Manager
console.log("\n--- Shortcut Manager ---");

class ShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }
    
    init() {
        document.addEventListener("keydown", (event) => {
            const key = this.getKeyString(event);
            const handler = this.shortcuts.get(key);
            if (handler) {
                event.preventDefault();
                handler(event);
            }
        });
    }
    
    getKeyString(event) {
        const parts = [];
        if (event.ctrlKey || event.metaKey) parts.push("Ctrl");
        if (event.shiftKey) parts.push("Shift");
        if (event.altKey) parts.push("Alt");
        parts.push(event.key.toUpperCase());
        return parts.join("+");
    }
    
    register(shortcut, handler) {
        this.shortcuts.set(shortcut, handler);
    }
}

// Usage
const shortcuts = new ShortcutManager();
shortcuts.register("Ctrl+S", () => console.log("Save"));
shortcuts.register("Ctrl+Shift+P", () => console.log("Command Palette"));

// Simulated example for Node.js
console.log("\nSimulated Keyboard Events:");

function simulateKeyPress(key, modifiers = {}) {
    const event = {
        key,
        code: `Key${key.toUpperCase()}`,
        ctrlKey: modifiers.ctrl || false,
        shiftKey: modifiers.shift || false,
        altKey: modifiers.alt || false,
        metaKey: modifiers.meta || false
    };
    
    console.log(`Key: ${event.key}, Ctrl: ${event.ctrlKey}, Shift: ${event.shiftKey}`);
    return event;
}

simulateKeyPress("a");
simulateKeyPress("s", { ctrl: true });
simulateKeyPress("P", { ctrl: true, shift: true });

