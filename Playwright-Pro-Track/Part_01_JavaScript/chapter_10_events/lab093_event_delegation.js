/**
 * Lab 093: Event Delegation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Event delegation uses bubbling to handle events
 * on a parent element instead of individual children.
 * 
 * Benefits:
 * - Fewer event listeners (better performance)
 * - Works with dynamically added elements
 * - Cleaner code
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement event delegation
 * 2. Handle dynamic elements
 * 3. Filter by selector
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Basic Delegation
console.log("--- Basic Delegation ---");

/*
<ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

// BAD: Listener on each item
document.querySelectorAll("#list li").forEach(li => {
    li.addEventListener("click", () => {
        console.log("Clicked:", li.textContent);
    });
});

// GOOD: Single listener on parent
document.getElementById("list").addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        console.log("Clicked:", event.target.textContent);
    }
});
*/

// Solution 2: Using closest()
console.log("\n--- Using closest() ---");

/*
<ul id="list">
    <li><span>Item 1</span></li>
    <li><span>Item 2</span></li>
</ul>

// Handle clicks on nested elements
document.getElementById("list").addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (li) {
        console.log("Clicked:", li.textContent);
    }
});
*/

// Solution 3: Dynamic Elements
console.log("\n--- Dynamic Elements ---");

/*
const list = document.getElementById("list");

// Delegation works for elements added later
list.addEventListener("click", (event) => {
    if (event.target.matches(".delete-btn")) {
        event.target.closest("li").remove();
    }
});

// Add new item - no need to add listener
function addItem(text) {
    const li = document.createElement("li");
    li.innerHTML = `${text} <button class="delete-btn">Delete</button>`;
    list.appendChild(li);
}

addItem("New Item"); // Click handler already works!
*/

// Solution 4: Multiple Actions
console.log("\n--- Multiple Actions ---");

/*
<div id="toolbar">
    <button data-action="save">Save</button>
    <button data-action="delete">Delete</button>
    <button data-action="edit">Edit</button>
</div>

const actions = {
    save: () => console.log("Saving..."),
    delete: () => console.log("Deleting..."),
    edit: () => console.log("Editing...")
};

document.getElementById("toolbar").addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (action && actions[action]) {
        actions[action]();
    }
});
*/

// Solution 5: Delegation Helper Function
console.log("\n--- Delegation Helper ---");

function delegate(parent, selector, eventType, handler) {
    parent.addEventListener(eventType, (event) => {
        const target = event.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, event);
        }
    });
}

// Usage (simulated)
/*
delegate(
    document.getElementById("list"),
    "li",
    "click",
    function(event) {
        console.log("Clicked:", this.textContent);
    }
);
*/

// Solution 6: Table Row Selection
console.log("\n--- Table Selection ---");

/*
<table id="dataTable">
    <tr data-id="1"><td>Row 1</td></tr>
    <tr data-id="2"><td>Row 2</td></tr>
</table>

const table = document.getElementById("dataTable");
let selectedRow = null;

table.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (!row) return;
    
    // Remove previous selection
    if (selectedRow) {
        selectedRow.classList.remove("selected");
    }
    
    // Select new row
    row.classList.add("selected");
    selectedRow = row;
    
    console.log("Selected ID:", row.dataset.id);
});
*/

// Solution 7: Form Field Delegation
console.log("\n--- Form Delegation ---");

/*
<form id="myForm">
    <input name="username" type="text">
    <input name="email" type="email">
    <input name="password" type="password">
</form>

document.getElementById("myForm").addEventListener("input", (event) => {
    const field = event.target;
    console.log(`${field.name} changed to: ${field.value}`);
    
    // Validate field
    validateField(field);
});

document.getElementById("myForm").addEventListener("focus", (event) => {
    event.target.classList.add("focused");
}, true); // Use capture for focus

document.getElementById("myForm").addEventListener("blur", (event) => {
    event.target.classList.remove("focused");
}, true);
*/

// Simulated example for Node.js
console.log("\nSimulated Event Delegation:");

class MockList {
    constructor() {
        this.items = [];
        this.handlers = [];
    }
    
    addItem(text) {
        this.items.push({ text, id: this.items.length + 1 });
    }
    
    delegate(selector, handler) {
        this.handlers.push({ selector, handler });
    }
    
    simulateClick(itemIndex) {
        const item = this.items[itemIndex];
        if (item) {
            this.handlers.forEach(({ handler }) => {
                handler({ target: item, type: "click" });
            });
        }
    }
}

const list = new MockList();
list.addItem("Item 1");
list.addItem("Item 2");
list.addItem("Item 3");

list.delegate("li", (event) => {
    console.log("Clicked:", event.target.text);
});

list.simulateClick(0);
list.simulateClick(1);

// Add new item - delegation still works
list.addItem("Item 4");
list.simulateClick(3);

