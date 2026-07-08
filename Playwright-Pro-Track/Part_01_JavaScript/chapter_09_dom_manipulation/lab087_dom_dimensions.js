/**
 * Lab 087: DOM Dimensions and Position
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Get element dimensions and positions:
 * 
 * Dimensions:
 * - offsetWidth/Height: Including border
 * - clientWidth/Height: Including padding
 * - scrollWidth/Height: Full scrollable size
 * 
 * Position:
 * - offsetTop/Left: Relative to offset parent
 * - getBoundingClientRect(): Viewport position
 * - scrollTop/Left: Scroll position
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Get element dimensions
 * 2. Get element positions
 * 3. Handle scroll positions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Element Dimensions
console.log("--- Element Dimensions ---");

/*
const element = document.getElementById("myElement");

// offsetWidth/Height: content + padding + border
console.log("offsetWidth:", element.offsetWidth);
console.log("offsetHeight:", element.offsetHeight);

// clientWidth/Height: content + padding (no border)
console.log("clientWidth:", element.clientWidth);
console.log("clientHeight:", element.clientHeight);

// scrollWidth/Height: full scrollable content
console.log("scrollWidth:", element.scrollWidth);
console.log("scrollHeight:", element.scrollHeight);
*/

// Solution 2: getBoundingClientRect
console.log("\n--- getBoundingClientRect ---");

/*
const element = document.getElementById("myElement");
const rect = element.getBoundingClientRect();

console.log("top:", rect.top);       // Distance from viewport top
console.log("left:", rect.left);     // Distance from viewport left
console.log("bottom:", rect.bottom); // Distance from viewport top to bottom edge
console.log("right:", rect.right);   // Distance from viewport left to right edge
console.log("width:", rect.width);
console.log("height:", rect.height);
console.log("x:", rect.x);           // Same as left
console.log("y:", rect.y);           // Same as top
*/

// Solution 3: Offset Position
console.log("\n--- Offset Position ---");

/*
const element = document.getElementById("myElement");

// Position relative to offsetParent
console.log("offsetTop:", element.offsetTop);
console.log("offsetLeft:", element.offsetLeft);
console.log("offsetParent:", element.offsetParent);

// Get absolute position on page
function getAbsolutePosition(element) {
    let top = 0, left = 0;
    
    while (element) {
        top += element.offsetTop;
        left += element.offsetLeft;
        element = element.offsetParent;
    }
    
    return { top, left };
}
*/

// Solution 4: Scroll Position
console.log("\n--- Scroll Position ---");

/*
const element = document.getElementById("scrollable");

// Current scroll position
console.log("scrollTop:", element.scrollTop);
console.log("scrollLeft:", element.scrollLeft);

// Set scroll position
element.scrollTop = 100;
element.scrollLeft = 50;

// Page scroll position
console.log("Page scrollY:", window.scrollY);
console.log("Page scrollX:", window.scrollX);
// or
console.log("Page scrollY:", document.documentElement.scrollTop);
*/

// Solution 5: Scroll Methods
console.log("\n--- Scroll Methods ---");

/*
// Scroll to position
window.scrollTo(0, 500);
window.scrollTo({ top: 500, behavior: "smooth" });

// Scroll by amount
window.scrollBy(0, 100);
window.scrollBy({ top: 100, behavior: "smooth" });

// Scroll element into view
element.scrollIntoView();
element.scrollIntoView({ behavior: "smooth", block: "center" });
*/

// Solution 6: Viewport Dimensions
console.log("\n--- Viewport Dimensions ---");

/*
// Viewport size (excluding scrollbars)
console.log("innerWidth:", window.innerWidth);
console.log("innerHeight:", window.innerHeight);

// Document size
console.log("documentWidth:", document.documentElement.scrollWidth);
console.log("documentHeight:", document.documentElement.scrollHeight);

// Screen size
console.log("screenWidth:", screen.width);
console.log("screenHeight:", screen.height);
*/

// Solution 7: Check if Element is Visible
console.log("\n--- Element Visibility ---");

/*
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}

function isElementPartiallyVisible(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}
*/

// Solution 8: Intersection Observer
console.log("\n--- Intersection Observer ---");

/*
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("Element is visible:", entry.target);
            entry.target.classList.add("visible");
        } else {
            entry.target.classList.remove("visible");
        }
    });
}, {
    threshold: 0.5 // 50% visible
});

// Observe elements
document.querySelectorAll(".observe-me").forEach(el => {
    observer.observe(el);
});

// Stop observing
observer.unobserve(element);
observer.disconnect();
*/

// Simulated example for Node.js
console.log("\nSimulated Dimensions:");

const mockElement = {
    offsetWidth: 200,
    offsetHeight: 100,
    clientWidth: 180,
    clientHeight: 80,
    scrollWidth: 500,
    scrollHeight: 300,
    getBoundingClientRect() {
        return {
            top: 50,
            left: 100,
            bottom: 150,
            right: 300,
            width: 200,
            height: 100
        };
    }
};

console.log("Dimensions:", {
    offset: `${mockElement.offsetWidth}x${mockElement.offsetHeight}`,
    client: `${mockElement.clientWidth}x${mockElement.clientHeight}`,
    scroll: `${mockElement.scrollWidth}x${mockElement.scrollHeight}`
});

const rect = mockElement.getBoundingClientRect();
console.log("Position:", { top: rect.top, left: rect.left });

