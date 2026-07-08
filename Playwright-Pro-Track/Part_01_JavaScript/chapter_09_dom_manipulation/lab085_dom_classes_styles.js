/**
 * Lab 085: DOM Classes and Styles
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Manipulate element classes and styles:
 * 
 * Classes:
 * - className property
 * - classList API (add, remove, toggle, contains)
 * 
 * Styles:
 * - style property (inline styles)
 * - getComputedStyle (computed styles)
 * - CSS custom properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add and remove classes
 * 2. Toggle classes
 * 3. Modify inline styles
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: className Property
console.log("--- className ---");

/*
<div id="myDiv" class="container active"></div>

const div = document.getElementById("myDiv");

// Get all classes as string
console.log("className:", div.className);

// Set classes (replaces all)
div.className = "new-class another-class";

// Add to existing
div.className += " extra-class";
*/

// Solution 2: classList API
console.log("\n--- classList ---");

/*
const element = document.getElementById("myElement");

// Add classes
element.classList.add("active");
element.classList.add("visible", "highlighted"); // Multiple

// Remove classes
element.classList.remove("hidden");
element.classList.remove("class1", "class2"); // Multiple

// Toggle class
element.classList.toggle("active"); // Add if missing, remove if present

// Toggle with condition
element.classList.toggle("visible", isVisible); // Add if true, remove if false

// Check if class exists
if (element.classList.contains("active")) {
    console.log("Element is active");
}

// Replace class
element.classList.replace("old-class", "new-class");

// Get class count
console.log("Class count:", element.classList.length);

// Iterate classes
for (const className of element.classList) {
    console.log("Class:", className);
}
*/

// Solution 3: Inline Styles
console.log("\n--- Inline Styles ---");

/*
const element = document.getElementById("myElement");

// Set individual styles
element.style.color = "red";
element.style.backgroundColor = "blue";  // camelCase for hyphenated
element.style.fontSize = "16px";
element.style.marginTop = "10px";

// Set multiple styles at once
Object.assign(element.style, {
    color: "white",
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "5px"
});

// Using cssText
element.style.cssText = "color: red; font-size: 16px; padding: 10px;";

// Remove inline style
element.style.color = "";  // or null

// Get inline style
console.log("Color:", element.style.color);
*/

// Solution 4: Computed Styles
console.log("\n--- Computed Styles ---");

/*
const element = document.getElementById("myElement");

// Get computed style (includes CSS rules)
const computed = getComputedStyle(element);

console.log("Color:", computed.color);
console.log("Font size:", computed.fontSize);
console.log("Display:", computed.display);

// Get pseudo-element styles
const beforeStyles = getComputedStyle(element, "::before");
console.log("Before content:", beforeStyles.content);
*/

// Solution 5: CSS Custom Properties
console.log("\n--- CSS Variables ---");

/*
// Set CSS variable
element.style.setProperty("--primary-color", "#007bff");
element.style.setProperty("--spacing", "20px");

// Get CSS variable
const primaryColor = getComputedStyle(element)
    .getPropertyValue("--primary-color");

// Remove CSS variable
element.style.removeProperty("--primary-color");

// Set on root for global variables
document.documentElement.style.setProperty("--theme-color", "blue");
*/

// Solution 6: Conditional Styling
console.log("\n--- Conditional Styling ---");

/*
function setActiveState(element, isActive) {
    if (isActive) {
        element.classList.add("active");
        element.style.opacity = "1";
    } else {
        element.classList.remove("active");
        element.style.opacity = "0.5";
    }
}

// Using toggle with condition
element.classList.toggle("visible", shouldBeVisible);
element.classList.toggle("error", hasError);
*/

// Solution 7: Animation Classes
console.log("\n--- Animation Classes ---");

/*
// Add animation class
element.classList.add("fade-in");

// Remove after animation ends
element.addEventListener("animationend", () => {
    element.classList.remove("fade-in");
});

// Or with timeout
element.classList.add("highlight");
setTimeout(() => {
    element.classList.remove("highlight");
}, 1000);
*/

// Solution 8: Theme Switching
console.log("\n--- Theme Switching ---");

/*
function setTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    
    // Or using data attribute
    document.body.dataset.theme = theme;
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}
*/

// Simulated example for Node.js
console.log("\nSimulated Classes and Styles:");

class MockClassList {
    constructor() {
        this._classes = new Set();
    }
    
    add(...classes) {
        classes.forEach(c => this._classes.add(c));
    }
    
    remove(...classes) {
        classes.forEach(c => this._classes.delete(c));
    }
    
    toggle(className) {
        if (this._classes.has(className)) {
            this._classes.delete(className);
            return false;
        } else {
            this._classes.add(className);
            return true;
        }
    }
    
    contains(className) {
        return this._classes.has(className);
    }
    
    toString() {
        return [...this._classes].join(" ");
    }
}

const classList = new MockClassList();
classList.add("container", "active");
console.log("Classes:", classList.toString());
classList.toggle("active");
console.log("After toggle:", classList.toString());
console.log("Contains 'container':", classList.contains("container"));

