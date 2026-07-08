/**
 * Lab 084: DOM Attributes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Work with element attributes:
 * 
 * Methods:
 * - getAttribute, setAttribute
 * - hasAttribute, removeAttribute
 * - attributes collection
 * 
 * Properties vs Attributes:
 * - Properties: JavaScript object properties
 * - Attributes: HTML attributes
 * 
 * Data attributes:
 * - data-* attributes
 * - dataset property
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Get and set attributes
 * 2. Use data attributes
 * 3. Understand property vs attribute
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Getting Attributes
console.log("--- Getting Attributes ---");

/*
<a id="link" href="https://example.com" target="_blank">Link</a>

const link = document.getElementById("link");

// getAttribute
console.log("href:", link.getAttribute("href"));
console.log("target:", link.getAttribute("target"));

// Property access (for standard attributes)
console.log("href property:", link.href);

// Check if attribute exists
console.log("has target:", link.hasAttribute("target"));
console.log("has rel:", link.hasAttribute("rel"));
*/

// Solution 2: Setting Attributes
console.log("\n--- Setting Attributes ---");

/*
const img = document.getElementById("myImage");

// setAttribute
img.setAttribute("src", "image.jpg");
img.setAttribute("alt", "My Image");
img.setAttribute("width", "300");

// Property assignment (for standard attributes)
img.src = "image.jpg";
img.alt = "My Image";

// Custom attributes
img.setAttribute("data-id", "123");
*/

// Solution 3: Removing Attributes
console.log("\n--- Removing Attributes ---");

/*
const element = document.getElementById("myElement");

// Remove single attribute
element.removeAttribute("disabled");
element.removeAttribute("class");

// Toggle attribute
if (element.hasAttribute("hidden")) {
    element.removeAttribute("hidden");
} else {
    element.setAttribute("hidden", "");
}
*/

// Solution 4: Attributes Collection
console.log("\n--- Attributes Collection ---");

/*
<div id="myDiv" class="container" data-id="123" title="My Div"></div>

const div = document.getElementById("myDiv");

// Get all attributes
const attrs = div.attributes;
console.log("Attribute count:", attrs.length);

// Iterate attributes
for (const attr of attrs) {
    console.log(`${attr.name}: ${attr.value}`);
}

// Convert to object
const attrObj = {};
for (const attr of attrs) {
    attrObj[attr.name] = attr.value;
}
*/

// Solution 5: Data Attributes
console.log("\n--- Data Attributes ---");

/*
<div id="user" 
     data-user-id="123" 
     data-user-name="Alice"
     data-is-active="true">
</div>

const user = document.getElementById("user");

// Access via dataset (camelCase)
console.log("userId:", user.dataset.userId);      // "123"
console.log("userName:", user.dataset.userName);  // "Alice"
console.log("isActive:", user.dataset.isActive);  // "true"

// Set data attributes
user.dataset.role = "admin";  // Creates data-role="admin"
user.dataset.lastLogin = "2024-01-15";

// Delete data attribute
delete user.dataset.isActive;

// Or use getAttribute/setAttribute
user.getAttribute("data-user-id");
user.setAttribute("data-user-id", "456");
*/

// Solution 6: Property vs Attribute
console.log("\n--- Property vs Attribute ---");

/*
<input id="myInput" type="text" value="initial">

const input = document.getElementById("myInput");

// Attribute: Initial HTML value
console.log("Attribute:", input.getAttribute("value")); // "initial"

// Property: Current value
input.value = "changed";
console.log("Property:", input.value);           // "changed"
console.log("Attribute:", input.getAttribute("value")); // Still "initial"

// For boolean attributes
<input id="checkbox" type="checkbox" checked>

const checkbox = document.getElementById("checkbox");
console.log("Attribute:", checkbox.getAttribute("checked")); // "" or "checked"
console.log("Property:", checkbox.checked);                  // true/false
*/

// Solution 7: Class Attribute
console.log("\n--- Class Attribute ---");

/*
// className property
element.className = "class1 class2";

// classList (preferred)
element.classList.add("new-class");
element.classList.remove("old-class");
element.classList.toggle("active");
element.classList.contains("active");
element.classList.replace("old", "new");

// Multiple classes
element.classList.add("class1", "class2", "class3");
*/

// Solution 8: Style Attribute
console.log("\n--- Style Attribute ---");

/*
// Inline styles via style property
element.style.color = "red";
element.style.backgroundColor = "blue";  // camelCase
element.style.fontSize = "16px";

// Get computed style
const computed = getComputedStyle(element);
console.log("Computed color:", computed.color);

// Set multiple styles
Object.assign(element.style, {
    color: "red",
    fontSize: "16px",
    padding: "10px"
});

// Remove inline style
element.style.color = "";
*/

// Simulated example for Node.js
console.log("\nSimulated Attributes:");

class MockElement {
    constructor() {
        this._attributes = new Map();
        this.dataset = {};
    }
    
    setAttribute(name, value) {
        this._attributes.set(name, value);
        if (name.startsWith("data-")) {
            const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            this.dataset[key] = value;
        }
    }
    
    getAttribute(name) {
        return this._attributes.get(name);
    }
}

const el = new MockElement();
el.setAttribute("id", "test");
el.setAttribute("data-user-id", "123");
console.log("id:", el.getAttribute("id"));
console.log("dataset:", el.dataset);

