/**
 * Lab 098: Custom Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Create and dispatch custom events:
 * 
 * - new Event(): Basic event
 * - new CustomEvent(): Event with data
 * - dispatchEvent(): Trigger event
 * 
 * Use cases:
 * - Component communication
 * - Decoupled architecture
 * - Plugin systems
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom events
 * 2. Pass data with events
 * 3. Build event-driven components
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Basic Custom Event
console.log("--- Basic Custom Event ---");

/*
// Create event
const event = new Event("myEvent");

// Listen for event
element.addEventListener("myEvent", () => {
    console.log("Custom event fired!");
});

// Dispatch event
element.dispatchEvent(event);
*/

// Solution 2: CustomEvent with Data
console.log("\n--- CustomEvent with Data ---");

/*
// Create event with data
const event = new CustomEvent("userLogin", {
    detail: {
        userId: 123,
        username: "john",
        timestamp: Date.now()
    },
    bubbles: true,    // Allow bubbling
    cancelable: true  // Allow preventDefault
});

// Listen and access data
document.addEventListener("userLogin", (event) => {
    console.log("User logged in:", event.detail.username);
    console.log("User ID:", event.detail.userId);
});

// Dispatch
document.dispatchEvent(event);
*/

// Solution 3: Event Options
console.log("\n--- Event Options ---");

/*
const event = new CustomEvent("notification", {
    detail: { message: "Hello" },
    bubbles: true,      // Event bubbles up
    cancelable: true,   // Can be cancelled
    composed: true      // Crosses shadow DOM boundary
});

// Check if cancelled
element.addEventListener("notification", (event) => {
    if (someCondition) {
        event.preventDefault();
    }
});

const wasCancelled = !element.dispatchEvent(event);
console.log("Was cancelled:", wasCancelled);
*/

// Solution 4: Event Bus Pattern
console.log("\n--- Event Bus ---");

class EventBus {
    constructor() {
        this.target = document.createElement("div");
    }
    
    on(event, callback) {
        this.target.addEventListener(event, (e) => callback(e.detail));
    }
    
    off(event, callback) {
        this.target.removeEventListener(event, callback);
    }
    
    emit(event, data) {
        this.target.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
}

// Usage
const bus = new EventBus();
bus.on("message", (data) => console.log("Received:", data));
bus.emit("message", { text: "Hello World" });

// Solution 5: Component Communication
console.log("\n--- Component Communication ---");

/*
// Cart component
class Cart {
    constructor() {
        this.items = [];
        document.addEventListener("addToCart", (event) => {
            this.addItem(event.detail);
        });
    }
    
    addItem(item) {
        this.items.push(item);
        document.dispatchEvent(new CustomEvent("cartUpdated", {
            detail: { items: this.items, count: this.items.length }
        }));
    }
}

// Product component
class Product {
    constructor(element) {
        element.querySelector(".add-btn").addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent("addToCart", {
                detail: { id: element.dataset.id, name: element.dataset.name }
            }));
        });
    }
}

// Header component (shows cart count)
document.addEventListener("cartUpdated", (event) => {
    document.querySelector(".cart-count").textContent = event.detail.count;
});
*/

// Solution 6: Async Event Pattern
console.log("\n--- Async Events ---");

/*
// Dispatch async event
async function fetchAndNotify() {
    const data = await fetch("/api/data").then(r => r.json());
    
    document.dispatchEvent(new CustomEvent("dataLoaded", {
        detail: data
    }));
}

// Listen for data
document.addEventListener("dataLoaded", (event) => {
    renderData(event.detail);
});
*/

// Solution 7: Namespaced Events
console.log("\n--- Namespaced Events ---");

class NamespacedEventEmitter {
    constructor(namespace) {
        this.namespace = namespace;
    }
    
    emit(event, data) {
        const fullEvent = `${this.namespace}:${event}`;
        document.dispatchEvent(new CustomEvent(fullEvent, { detail: data }));
    }
    
    on(event, callback) {
        const fullEvent = `${this.namespace}:${event}`;
        document.addEventListener(fullEvent, (e) => callback(e.detail));
    }
}

// Usage
const userEvents = new NamespacedEventEmitter("user");
userEvents.on("login", (data) => console.log("User login:", data));
userEvents.emit("login", { username: "john" });

// Solution 8: Event with Validation
console.log("\n--- Event Validation ---");

function createValidatedEvent(type, schema, data) {
    // Validate data against schema
    for (const [key, validator] of Object.entries(schema)) {
        if (!validator(data[key])) {
            throw new Error(`Invalid ${key} in event ${type}`);
        }
    }
    
    return new CustomEvent(type, { detail: data, bubbles: true });
}

// Usage
const schema = {
    userId: (v) => typeof v === "number",
    action: (v) => ["create", "update", "delete"].includes(v)
};

try {
    const event = createValidatedEvent("userAction", schema, {
        userId: 123,
        action: "create"
    });
    console.log("Valid event created");
} catch (error) {
    console.error(error.message);
}

// Simulated example for Node.js
console.log("\nSimulated Custom Events:");

class SimpleEventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        (this.events[event] || []).forEach(cb => cb(data));
    }
}

const emitter = new SimpleEventEmitter();
emitter.on("notification", (data) => console.log("Notification:", data.message));
emitter.emit("notification", { message: "Hello from custom event!" });

