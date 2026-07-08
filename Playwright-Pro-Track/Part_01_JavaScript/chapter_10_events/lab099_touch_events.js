/**
 * Lab 099: Touch Events
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Touch events for mobile devices:
 *
 * Events:
 * - touchstart: Finger touches screen
 * - touchmove: Finger moves on screen
 * - touchend: Finger leaves screen
 * - touchcancel: Touch interrupted
 *
 * Touch properties:
 * - touches: All current touches
 * - targetTouches: Touches on target
 * - changedTouches: Changed touches
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle touch events
 * 2. Implement swipe gestures
 * 3. Support multi-touch
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Basic Touch Events
console.log("--- Basic Touch Events ---");

/*
const element = document.getElementById("touchArea");

element.addEventListener("touchstart", (event) => {
    console.log("Touch started");
    console.log("Touches:", event.touches.length);
});

element.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Prevent scrolling
    console.log("Touch moving");
});

element.addEventListener("touchend", (event) => {
    console.log("Touch ended");
});

element.addEventListener("touchcancel", (event) => {
    console.log("Touch cancelled");
});
*/

// Solution 2: Touch Coordinates
console.log("\n--- Touch Coordinates ---");

/*
element.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];

    console.log("Client:", touch.clientX, touch.clientY);
    console.log("Page:", touch.pageX, touch.pageY);
    console.log("Screen:", touch.screenX, touch.screenY);
    console.log("Target:", touch.target);
    console.log("Identifier:", touch.identifier);
});
*/

// Solution 3: Swipe Detection
console.log("\n--- Swipe Detection ---");

function createSwipeDetector(element, callback) {
    let startX, startY, startTime;
    const threshold = 50;
    const maxTime = 300;

    element.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
    });

    element.addEventListener("touchend", (e) => {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const deltaTime = Date.now() - startTime;

        if (deltaTime > maxTime) return;

        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            callback(deltaX > 0 ? "right" : "left");
        } else if (Math.abs(deltaY) > threshold) {
            callback(deltaY > 0 ? "down" : "up");
        }
    });
}

// Usage (simulated)
console.log("Swipe detector created");

// Solution 4: Pinch to Zoom
console.log("\n--- Pinch to Zoom ---");

/*
let initialDistance = 0;
let currentScale = 1;

function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

element.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
        initialDistance = getDistance(event.touches);
    }
});

element.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();
        const currentDistance = getDistance(event.touches);
        const scale = currentDistance / initialDistance;
        element.style.transform = `scale(${currentScale * scale})`;
    }
});

element.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) {
        // Update base scale
        currentScale = parseFloat(element.style.transform.match(/scale\((.*?)\)/)?.[1] || 1);
    }
});
*/

// Solution 5: Long Press
console.log("\n--- Long Press ---");

/*
let pressTimer;
const longPressDelay = 500;

element.addEventListener("touchstart", (event) => {
    pressTimer = setTimeout(() => {
        console.log("Long press detected");
        handleLongPress(event);
    }, longPressDelay);
});

element.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
});

element.addEventListener("touchmove", () => {
    clearTimeout(pressTimer);
});
*/

// Solution 6: Touch vs Click
console.log("\n--- Touch vs Click ---");

/*
// Handle both touch and click
function addUniversalClickHandler(element, handler) {
    let touchHandled = false;

    element.addEventListener("touchend", (event) => {
        touchHandled = true;
        handler(event);
    });

    element.addEventListener("click", (event) => {
        if (!touchHandled) {
            handler(event);
        }
        touchHandled = false;
    });
}

// Or use pointer events (recommended)
element.addEventListener("pointerdown", handler);
element.addEventListener("pointerup", handler);
element.addEventListener("pointermove", handler);
*/

// Solution 7: Drag with Touch
console.log("\n--- Touch Drag ---");

/*
let isDragging = false;
let offsetX, offsetY;

element.addEventListener("touchstart", (event) => {
    isDragging = true;
    const touch = event.touches[0];
    offsetX = touch.clientX - element.offsetLeft;
    offsetY = touch.clientY - element.offsetTop;
});

element.addEventListener("touchmove", (event) => {
    if (!isDragging) return;
    event.preventDefault();

    const touch = event.touches[0];
    element.style.left = (touch.clientX - offsetX) + "px";
    element.style.top = (touch.clientY - offsetY) + "px";
});

element.addEventListener("touchend", () => {
    isDragging = false;
});
*/

// Simulated example for Node.js
console.log("\nSimulated Touch Events:");

class TouchSimulator {
    constructor() {
        this.touches = [];
    }

    touchStart(x, y) {
        this.touches.push({ clientX: x, clientY: y, identifier: this.touches.length });
        console.log(`Touch start at (${x}, ${y})`);
    }

    touchMove(x, y) {
        if (this.touches.length > 0) {
            this.touches[0] = { ...this.touches[0], clientX: x, clientY: y };
            console.log(`Touch move to (${x}, ${y})`);
        }
    }

    touchEnd() {
        const touch = this.touches.pop();
        if (touch) {
            console.log(`Touch end at (${touch.clientX}, ${touch.clientY})`);
        }
    }

    simulateSwipe(startX, startY, endX, endY) {
        this.touchStart(startX, startY);
        this.touchMove(endX, endY);
        this.touchEnd();

        const direction = Math.abs(endX - startX) > Math.abs(endY - startY)
            ? (endX > startX ? "right" : "left")
            : (endY > startY ? "down" : "up");
        console.log(`Swipe direction: ${direction}`);
    }
}

const touch = new TouchSimulator();
touch.simulateSwipe(100, 100, 300, 100);