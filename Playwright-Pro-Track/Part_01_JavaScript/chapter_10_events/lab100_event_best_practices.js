/**
 * Lab 100: Event Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for event handling:
 * 
 * 1. Use event delegation
 * 2. Remove unused listeners
 * 3. Debounce/throttle handlers
 * 4. Use passive listeners
 * 5. Handle errors gracefully
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Optimize event handling
 * 3. Write maintainable code
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Use Event Delegation
console.log("--- Event Delegation ---");

/*
// BAD: Listener on each element
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", handleClick);
});

// GOOD: Single listener on parent
document.getElementById("container").addEventListener("click", (event) => {
    if (event.target.matches(".btn")) {
        handleClick(event);
    }
});
*/

// Best Practice 2: Remove Listeners
console.log("\n--- Remove Listeners ---");

/*
// Store reference for removal
const handler = () => console.log("clicked");
element.addEventListener("click", handler);

// Remove when done
element.removeEventListener("click", handler);

// Or use AbortController
const controller = new AbortController();
element.addEventListener("click", handler, { signal: controller.signal });
controller.abort(); // Removes listener

// Or use { once: true }
element.addEventListener("click", handler, { once: true });
*/

// Best Practice 3: Debounce and Throttle
console.log("\n--- Debounce/Throttle ---");

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/*
// Debounce for input
input.addEventListener("input", debounce((e) => {
    search(e.target.value);
}, 300));

// Throttle for scroll
window.addEventListener("scroll", throttle(() => {
    updatePosition();
}, 100));
*/

// Best Practice 4: Use Passive Listeners
console.log("\n--- Passive Listeners ---");

/*
// For scroll/touch events that don't call preventDefault
window.addEventListener("scroll", handleScroll, { passive: true });
element.addEventListener("touchstart", handleTouch, { passive: true });

// Better performance - browser doesn't wait to see if preventDefault is called
*/

// Best Practice 5: Error Handling
console.log("\n--- Error Handling ---");

function safeHandler(handler) {
    return function(event) {
        try {
            handler.call(this, event);
        } catch (error) {
            console.error("Event handler error:", error);
            // Report to error tracking service
        }
    };
}

/*
element.addEventListener("click", safeHandler((event) => {
    // Handler code that might throw
}));
*/

// Best Practice 6: Avoid Memory Leaks
console.log("\n--- Avoid Memory Leaks ---");

class Component {
    constructor(element) {
        this.element = element;
        this.controller = new AbortController();
        this.init();
    }
    
    init() {
        this.element.addEventListener("click", this.handleClick.bind(this), {
            signal: this.controller.signal
        });
    }
    
    handleClick(event) {
        console.log("Clicked");
    }
    
    destroy() {
        this.controller.abort(); // Removes all listeners
        this.element = null;
    }
}

// Best Practice 7: Use Named Functions
console.log("\n--- Named Functions ---");

/*
// BAD: Anonymous functions (can't remove, hard to debug)
element.addEventListener("click", function() {
    console.log("clicked");
});

// GOOD: Named functions
function handleElementClick(event) {
    console.log("clicked");
}
element.addEventListener("click", handleElementClick);
*/

// Best Practice 8: Prevent Default Appropriately
console.log("\n--- Prevent Default ---");

/*
// Only prevent when necessary
form.addEventListener("submit", (event) => {
    if (!isValid) {
        event.preventDefault();
        showErrors();
    }
});

// Don't prevent unnecessarily
link.addEventListener("click", (event) => {
    // Don't prevent if you want navigation
    trackClick();
});
*/

// Best Practice 9: Use Event Properties Correctly
console.log("\n--- Event Properties ---");

/*
element.addEventListener("click", (event) => {
    // Use currentTarget for the element with the listener
    const container = event.currentTarget;
    
    // Use target for the actual clicked element
    const clicked = event.target;
    
    // Use closest for finding parent
    const item = event.target.closest(".item");
});
*/

// Best Practice 10: Document Event Handlers
console.log("\n--- Documentation ---");

/**
 * Handles user click on action buttons
 * @param {MouseEvent} event - The click event
 * @fires actionPerformed - When action completes
 */
function handleActionClick(event) {
    const action = event.target.dataset.action;
    // ... handle action
}

// Summary
console.log("\n--- Summary ---");
console.log("1. Use event delegation for dynamic content");
console.log("2. Always remove listeners when done");
console.log("3. Debounce/throttle frequent events");
console.log("4. Use passive listeners for scroll/touch");
console.log("5. Wrap handlers in try-catch");
console.log("6. Use AbortController for cleanup");
console.log("7. Prefer named functions over anonymous");
console.log("8. Only preventDefault when necessary");
console.log("9. Use correct event properties");
console.log("10. Document your event handlers");

