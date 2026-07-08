/**
 * Lab 097: Window and Document Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Browser-level events:
 * 
 * Load events:
 * - DOMContentLoaded, load, beforeunload, unload
 * 
 * View events:
 * - resize, scroll
 * 
 * Visibility:
 * - visibilitychange
 * 
 * Network:
 * - online, offline
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle page lifecycle
 * 2. Respond to viewport changes
 * 3. Detect network status
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Page Load Events
console.log("--- Page Load Events ---");

/*
// DOM ready (HTML parsed, before images/styles)
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready");
    initializeApp();
});

// Everything loaded (images, styles, etc.)
window.addEventListener("load", () => {
    console.log("Page fully loaded");
    hideLoadingSpinner();
});

// Before leaving page
window.addEventListener("beforeunload", (event) => {
    if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome
        return "You have unsaved changes!";
    }
});

// Page unloading
window.addEventListener("unload", () => {
    // Send analytics, cleanup
    navigator.sendBeacon("/api/analytics", data);
});
*/

// Solution 2: Resize Event
console.log("\n--- Resize Event ---");

/*
// Basic resize handler
window.addEventListener("resize", () => {
    console.log("Width:", window.innerWidth);
    console.log("Height:", window.innerHeight);
});

// Debounced resize handler
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        handleResize();
    }, 250);
});

// ResizeObserver for specific elements
const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
        console.log("Element resized:", entry.contentRect);
    }
});
observer.observe(document.getElementById("resizable"));
*/

// Solution 3: Scroll Event
console.log("\n--- Scroll Event ---");

/*
// Basic scroll handler
window.addEventListener("scroll", () => {
    console.log("Scroll Y:", window.scrollY);
    console.log("Scroll X:", window.scrollX);
});

// Throttled scroll handler
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Scroll direction detection
let lastScrollY = 0;
window.addEventListener("scroll", () => {
    const direction = window.scrollY > lastScrollY ? "down" : "up";
    console.log("Scrolling:", direction);
    lastScrollY = window.scrollY;
});
*/

// Solution 4: Visibility Change
console.log("\n--- Visibility Change ---");

/*
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log("Page is hidden");
        pauseVideo();
        pauseAnimations();
    } else {
        console.log("Page is visible");
        resumeVideo();
        resumeAnimations();
    }
});
*/

// Solution 5: Online/Offline
console.log("\n--- Online/Offline ---");

/*
window.addEventListener("online", () => {
    console.log("Back online");
    showNotification("Connection restored");
    syncData();
});

window.addEventListener("offline", () => {
    console.log("Gone offline");
    showNotification("No internet connection");
    enableOfflineMode();
});

// Check current status
console.log("Online:", navigator.onLine);
*/

// Solution 6: Hash Change
console.log("\n--- Hash Change ---");

/*
window.addEventListener("hashchange", (event) => {
    console.log("Old URL:", event.oldURL);
    console.log("New URL:", event.newURL);
    console.log("Hash:", location.hash);
    
    // Handle navigation
    handleRoute(location.hash);
});
*/

// Solution 7: Pop State (History)
console.log("\n--- Pop State ---");

/*
window.addEventListener("popstate", (event) => {
    console.log("State:", event.state);
    // Handle back/forward navigation
    if (event.state) {
        loadPage(event.state.page);
    }
});

// Push state
history.pushState({ page: "about" }, "About", "/about");
*/

// Solution 8: Error Handling
console.log("\n--- Error Events ---");

/*
// JavaScript errors
window.addEventListener("error", (event) => {
    console.error("Error:", event.message);
    console.error("File:", event.filename);
    console.error("Line:", event.lineno);
    
    // Send to error tracking service
    reportError(event);
});

// Unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled rejection:", event.reason);
    event.preventDefault(); // Prevent default console error
});

// Resource loading errors
window.addEventListener("error", (event) => {
    if (event.target.tagName === "IMG") {
        event.target.src = "/fallback-image.png";
    }
}, true); // Capture phase for resource errors
*/

// Simulated example for Node.js
console.log("\nSimulated Window Events:");

class MockWindow {
    constructor() {
        this.innerWidth = 1920;
        this.innerHeight = 1080;
        this.scrollY = 0;
        this.online = true;
        this.listeners = {};
    }
    
    addEventListener(type, callback) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(callback);
    }
    
    emit(type, data = {}) {
        (this.listeners[type] || []).forEach(cb => cb(data));
    }
    
    resize(width, height) {
        this.innerWidth = width;
        this.innerHeight = height;
        this.emit("resize");
    }
    
    scroll(y) {
        this.scrollY = y;
        this.emit("scroll");
    }
}

const mockWindow = new MockWindow();
mockWindow.addEventListener("resize", () => {
    console.log(`Resized to ${mockWindow.innerWidth}x${mockWindow.innerHeight}`);
});
mockWindow.addEventListener("scroll", () => {
    console.log(`Scrolled to ${mockWindow.scrollY}`);
});

mockWindow.resize(1024, 768);
mockWindow.scroll(500);

