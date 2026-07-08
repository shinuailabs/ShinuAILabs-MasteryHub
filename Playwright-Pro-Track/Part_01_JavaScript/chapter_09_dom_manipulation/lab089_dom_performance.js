/**
 * Lab 089: DOM Performance
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Optimize DOM operations for better performance:
 *
 * Key principles:
 * - Minimize DOM access
 * - Batch DOM updates
 * - Use DocumentFragment
 * - Avoid layout thrashing
 * - Use event delegation
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify performance issues
 * 2. Apply optimization techniques
 * 3. Measure improvements
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Cache DOM References
console.log("--- Cache DOM References ---");

/*
// BAD: Query in loop
for (let i = 0; i < 1000; i++) {
    document.getElementById("counter").textContent = i;
}

// GOOD: Cache reference
const counter = document.getElementById("counter");
for (let i = 0; i < 1000; i++) {
    counter.textContent = i;
}
*/

// Solution 2: Batch DOM Updates
console.log("\n--- Batch Updates ---");

/*
// BAD: Multiple DOM updates
for (let i = 0; i < 100; i++) {
    const li = document.createElement("li");
    li.textContent = `Item ${i}`;
    list.appendChild(li); // Triggers reflow each time
}

// GOOD: Use DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const li = document.createElement("li");
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);
}
list.appendChild(fragment); // Single reflow
*/

// Solution 3: Avoid Layout Thrashing
console.log("\n--- Avoid Layout Thrashing ---");

/*
// BAD: Read-write-read-write pattern
elements.forEach(el => {
    const height = el.offsetHeight; // Read (forces layout)
    el.style.height = height + 10 + "px"; // Write (invalidates layout)
});

// GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
    el.style.height = heights[i] + 10 + "px"; // All writes
});
*/

// Solution 4: Use CSS Classes
console.log("\n--- Use CSS Classes ---");

/*
// BAD: Multiple style changes
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.fontSize = "16px";
element.style.padding = "10px";

// GOOD: Single class change
element.classList.add("highlighted");

// CSS:
// .highlighted {
//     color: red;
//     background-color: blue;
//     font-size: 16px;
//     padding: 10px;
// }
*/

// Solution 5: Event Delegation
console.log("\n--- Event Delegation ---");

/*
// BAD: Event listener on each item
items.forEach(item => {
    item.addEventListener("click", handleClick);
});

// GOOD: Single listener on parent
container.addEventListener("click", (event) => {
    const item = event.target.closest(".item");
    if (item) {
        handleClick(item);
    }
});
*/

// Solution 6: Virtual Scrolling Concept
console.log("\n--- Virtual Scrolling ---");

/*
// Only render visible items
function virtualScroll(container, items, itemHeight) {
    const visibleCount = Math.ceil(container.clientHeight / itemHeight);
    const scrollTop = container.scrollTop;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

    // Only render visible items
    const visibleItems = items.slice(startIndex, endIndex);

    // Add padding for scroll position
    container.style.paddingTop = startIndex * itemHeight + "px";
    container.style.paddingBottom = (items.length - endIndex) * itemHeight + "px";

    return visibleItems;
}
*/

// Solution 7: Debounce DOM Updates
console.log("\n--- Debounce Updates ---");

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/*
// Debounce scroll handler
window.addEventListener("scroll", debounce(() => {
    updateVisibleItems();
}, 100));

// Debounce input handler
input.addEventListener("input", debounce((e) => {
    search(e.target.value);
}, 300));
*/

// Solution 8: RequestAnimationFrame
console.log("\n--- RequestAnimationFrame ---");

/*
// BAD: Direct updates
window.addEventListener("scroll", () => {
    element.style.transform = `translateY(${window.scrollY}px)`;
});

// GOOD: Use requestAnimationFrame
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            element.style.transform = `translateY(${window.scrollY}px)`;
            ticking = false;
        });
        ticking = true;
    }
});
*/

// Solution 9: Lazy Loading
console.log("\n--- Lazy Loading ---");

/*
// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll("img[data-src]").forEach(img => {
    observer.observe(img);
});
*/

// Solution 10: Measure Performance
console.log("\n--- Measure Performance ---");

function measureDOMOperation(name, operation) {
    const start = performance.now();
    operation();
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

// Simulated example
measureDOMOperation("Array creation", () => {
    const arr = [];
    for (let i = 0; i < 10000; i++) {
        arr.push({ id: i, value: `Item ${i}` });
    }
});

measureDOMOperation("Array map", () => {
    const arr = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: `Item ${i}`
    }));
});

console.log("\nPerformance Tips Summary:");
console.log("1. Cache DOM references");
console.log("2. Use DocumentFragment for batch inserts");
console.log("3. Avoid layout thrashing");
console.log("4. Use CSS classes instead of inline styles");
console.log("5. Use event delegation");
console.log("6. Debounce/throttle event handlers");
console.log("7. Use requestAnimationFrame for animations");
console.log("8. Implement lazy loading");
console.log("9. Consider virtual scrolling for large lists");