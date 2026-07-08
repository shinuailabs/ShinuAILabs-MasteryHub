/**
 * Lab 090: DOM Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for DOM manipulation:
 * 
 * 1. Separation of concerns
 * 2. Progressive enhancement
 * 3. Accessibility
 * 4. Security (XSS prevention)
 * 5. Clean code patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Write maintainable DOM code
 * 3. Handle edge cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Best Practice 1: Use Semantic HTML
console.log("--- Semantic HTML ---");

/*
// BAD: Generic divs
<div class="header">
    <div class="nav">...</div>
</div>

// GOOD: Semantic elements
<header>
    <nav>...</nav>
</header>
*/

// Best Practice 2: Prevent XSS
console.log("\n--- XSS Prevention ---");

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/*
// BAD: Direct innerHTML with user input
element.innerHTML = userInput;

// GOOD: Use textContent or escape
element.textContent = userInput;
// or
element.innerHTML = escapeHtml(userInput);
*/

// Best Practice 3: Check Element Existence
console.log("\n--- Check Existence ---");

/*
// BAD: Assume element exists
document.getElementById("myElement").textContent = "Hello";

// GOOD: Check first
const element = document.getElementById("myElement");
if (element) {
    element.textContent = "Hello";
}

// Or use optional chaining
document.getElementById("myElement")?.classList.add("active");
*/

// Best Practice 4: Use Data Attributes
console.log("\n--- Data Attributes ---");

/*
// BAD: Store data in global variables
window.itemId = 123;

// GOOD: Use data attributes
<button data-item-id="123" data-action="delete">Delete</button>

button.addEventListener("click", (e) => {
    const itemId = e.target.dataset.itemId;
    const action = e.target.dataset.action;
});
*/

// Best Practice 5: Accessibility
console.log("\n--- Accessibility ---");

/*
// Add ARIA attributes
button.setAttribute("aria-label", "Close dialog");
button.setAttribute("aria-expanded", "false");

// Manage focus
dialog.querySelector("input").focus();

// Keyboard navigation
element.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        handleActivation();
    }
});

// Screen reader announcements
const announcement = document.createElement("div");
announcement.setAttribute("role", "status");
announcement.setAttribute("aria-live", "polite");
announcement.textContent = "Item added to cart";
*/

// Best Practice 6: Clean Up Event Listeners
console.log("\n--- Clean Up Listeners ---");

/*
// Store reference for removal
const handleClick = () => console.log("clicked");
element.addEventListener("click", handleClick);

// Later, remove it
element.removeEventListener("click", handleClick);

// Or use AbortController
const controller = new AbortController();
element.addEventListener("click", handleClick, { signal: controller.signal });

// Remove all listeners at once
controller.abort();
*/

// Best Practice 7: Modular DOM Code
console.log("\n--- Modular Code ---");

class UIComponent {
    constructor(container) {
        this.container = container;
        this.state = {};
        this.init();
    }
    
    init() {
        this.render();
        this.attachEvents();
    }
    
    render() {
        // Override in subclass
    }
    
    attachEvents() {
        // Override in subclass
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    
    destroy() {
        this.container.innerHTML = "";
    }
}

// Best Practice 8: Error Handling
console.log("\n--- Error Handling ---");

function safeQuerySelector(selector, context = document) {
    try {
        const element = context.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    } catch (error) {
        console.error(`Invalid selector: ${selector}`, error);
        return null;
    }
}

// Best Practice 9: Consistent Naming
console.log("\n--- Consistent Naming ---");

/*
// Use consistent prefixes
const $container = document.getElementById("container"); // $ for DOM elements
const btnSubmit = document.querySelector(".btn-submit"); // btn prefix for buttons
const inputEmail = document.querySelector("#email");     // input prefix for inputs

// Use descriptive names
const userListContainer = document.getElementById("user-list");
const modalCloseButton = document.querySelector(".modal-close");
*/

// Best Practice 10: Document Your DOM Structure
console.log("\n--- Documentation ---");

/*
/**
 * Creates a user card element
 * @param {Object} user - User data
 * @param {string} user.name - User's name
 * @param {string} user.email - User's email
 * @returns {HTMLElement} The user card element
 *
function createUserCard(user) {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
        <h3 class="user-name">${escapeHtml(user.name)}</h3>
        <p class="user-email">${escapeHtml(user.email)}</p>
    `;
    return card;
}
*/

// Summary
console.log("\n--- Summary ---");
console.log("1. Use semantic HTML elements");
console.log("2. Always escape user input (prevent XSS)");
console.log("3. Check element existence before manipulation");
console.log("4. Use data attributes for element data");
console.log("5. Implement accessibility features");
console.log("6. Clean up event listeners");
console.log("7. Write modular, reusable code");
console.log("8. Handle errors gracefully");
console.log("9. Use consistent naming conventions");
console.log("10. Document your DOM structure");

